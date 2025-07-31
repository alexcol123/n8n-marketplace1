"use server";

import db from "./db";
import { clerkClient, currentUser } from "@clerk/nextjs/server";
// import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  workflowSchema,
  imageSchema,
  profileSchema,
  validateWithZodSchema,
  workflowStepSchema,
} from "./schemas";
import { revalidatePath } from "next/cache";
import { deleteImage, uploadImage } from "./supabase";

import slug from "slug";
import {
  CategoryType,
  IssueStatus,
  Priority,
  WorkflowStep,
} from "@prisma/client";
import { getDateTime } from "./functions/getDateTime";

import { CompletionCountData, CompletionWithUserData } from "./types";

import { identifyService } from "./functions/identifyService";
import { extractAndSaveWorkflowSteps } from "./functions/extractWorkflowSteps";

import { Prisma } from "@prisma/client"; // Add this import at the top
import OpenAI from "openai";
import { detectWorkflowTools } from "./functions/detectWorkflowTool";
import {
  stepTeachingSchema,
  teachingGuideSchema,
} from "./workflowTeachGuideSchemas";
import { extractRequiredApiServices } from "./functions/extractRequiredApiServices";

const getAuthUser = async () => {
  const user = await currentUser();

  if (!user) throw new Error(" You must be logged in to access this route ");

  return user;
};

const isAdminUser = async (): Promise<boolean> => {
  try {
    const user = await currentUser();
    const adminUserId = process.env.ADMIN_USER_ID;

    // Check if user exists and admin ID is configured
    if (!user || !adminUserId) {
      return false;
    }

    // Check if current user is admin
    return user.id === adminUserId;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
};

export const isWorkflowCreator = async (
  workflowId: string
): Promise<boolean> => {
  try {
    // Get the authenticated user
    const user = await getAuthUser();

    // Get the workflow to check ownership
    const workflow = await db.workflow.findUnique({
      where: { id: workflowId },
      select: {
        authorId: true,
      },
    });

    // Return false if workflow doesn't exist
    if (!workflow) {
      return false;
    }

    // Check if the authenticated user is the creator
    return workflow.authorId === user.id;
  } catch (error) {
    console.error("Error checking workflow creator:", error);
    return false;
  }
};

export const isCreatorOrAdmin = async (
  workflowId: string
): Promise<boolean> => {
  try {
    // Check if user is creator first (most common case)
    const isCreator = await isWorkflowCreator(workflowId);

    // If user is creator, return true immediately - no need to check admin
    if (isCreator) {
      return true;
    }

    // Only check admin if user is not the creator
    const isAdmin = await isAdminUser();

    return isAdmin;
  } catch (error) {
    console.error("Error checking creator or admin status:", error);
    return false;
  }
};

const renderError = (error: unknown): { message: string; success: boolean } => {
  console.log(error);
  return {
    message: error instanceof Error ? error.message : "An error occurred",
    success: false,
  };
};

export async function checkUsernameAvailability(username: string): Promise<{
  available: boolean;
  message: string;
}> {
  // Don't check if username is less than minimum length
  if (!username || username.length < 3) {
    return {
      available: false,
      message: "Username must be at least 3 characters",
    };
  }

  // Validate username format
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return {
      available: false,
      message: "Username can only contain letters, numbers, and underscores",
    };
  }

  try {
    // Get current user to exclude their existing username
    const user = await currentUser();

    // Check if username exists in database
    const existingUser = await db.profile.findUnique({
      where: {
        username: username,
      },
      select: {
        clerkId: true,
      },
    });

    // If username exists but belongs to the current user, it's still "available"
    if (existingUser && user && existingUser.clerkId === user.id) {
      return {
        available: true,
        message: "This is your current username",
      };
    }

    // If username exists and belongs to another user
    if (existingUser) {
      return {
        available: false,
        message: "This username is already taken",
      };
    }

    // Username is available
    return {
      available: true,
      message: "Username is available!",
    };
  } catch (error) {
    console.error("Error checking username availability:", error);
    return {
      available: false,
      message: "Error checking username availability",
    };
  }
}

export const CreateProfileAction = async (
  prevState: Record<string, unknown>,
  formData: FormData
) => {
  try {
    const user = await currentUser();

    if (!user) {
      throw new Error("Please login to create a profile");
    }

    const rawData = Object.fromEntries(formData.entries());
    const validatedFields = validateWithZodSchema(profileSchema, rawData);

    // Check if username is already taken
    const usernameCheck = await checkUsernameAvailability(
      validatedFields.username
    );
    if (!usernameCheck.available) {
      return {
        message: usernameCheck.message,
        success: false,
      };
    }

    const userData = {
      clerkId: user.id,
      email: user.emailAddresses[0].emailAddress,
      profileImage: user.imageUrl ?? "",
      ...validatedFields,
    };

    await db.profile.create({
      data: userData,
    });

    const client = await clerkClient();
    await client.users.updateUserMetadata(user.id, {
      privateMetadata: {
        hasProfile: true,
      },
    });
  } catch (error) {
    return renderError(error);
  }

  redirect("/dashboard");
};

export const fetchProfile = async () => {
  const user = await getAuthUser();
  const profile = await db.profile.findUnique({
    where: {
      clerkId: user.id,
    },
  });

  return profile;
};

export const updateProfileAction = async (
  prevState: Record<string, unknown>,
  formData: FormData
): Promise<{ message: string; success?: boolean }> => {
  const user = await getAuthUser();

  try {
    const rawData = Object.fromEntries(formData);

    const validatedFields = validateWithZodSchema(profileSchema, rawData);

    // Check if the username has changed
    const currentProfile = await db.profile.findUnique({
      where: { clerkId: user.id },
      select: { username: true },
    });

    if (
      currentProfile &&
      validatedFields.username !== currentProfile.username
    ) {
      // Username has changed, check availability
      const usernameCheck = await checkUsernameAvailability(
        validatedFields.username
      );
      if (!usernameCheck.available) {
        return {
          message: usernameCheck.message,
          success: false,
        };
      }
    }

    await db.profile.update({
      where: {
        clerkId: user.id,
      },
      data: validatedFields,
    });

    revalidatePath("/profile");
    return { message: "Profile updated successfully", success: true };
  } catch (error) {
    return renderError(error);
  }
};

export const updateProfileImageAction = async (
  prevState: Record<string, unknown>,
  formData: FormData
): Promise<{ message: string }> => {
  const user = await getAuthUser();
  try {
    const image = formData.get("image") as File;
    const validatedFields = validateWithZodSchema(imageSchema, { image });

    // Get the current profile to retrieve the old image URL
    const currentProfile = await db.profile.findUnique({
      where: {
        clerkId: user.id,
      },
      select: {
        profileImage: true,
      },
    });

    // Upload the new image
    const fullPath = await uploadImage(validatedFields.image);

    // Update the profile with the new image
    await db.profile.update({
      where: {
        clerkId: user.id,
      },
      data: {
        profileImage: fullPath,
      },
    });

    // Delete the old image from storage (if it exists and is a Supabase URL)
    if (
      currentProfile?.profileImage &&
      currentProfile.profileImage.includes("supabase.co")
    ) {
      try {
        await deleteImage(currentProfile.profileImage);
      } catch (deleteError) {
        // Log the error but don't fail the entire operation
        console.error("Failed to delete old profile image:", deleteError);
      }
    }

    revalidatePath("/profile");
    return { message: "Profile image updated successfully" };
  } catch (error) {
    return renderError(error);
  }
};

export const fetchWorkflows = async ({
  search = "",
  category,
}: {
  search?: string;
  category?: string;
}) => {
  const workflows = await db.workflow.findMany({
    where: {
      category: category as CategoryType | undefined,
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ],
    },
    select: {
      id: true,
      title: true,
      content: true,
      workflowImage: true,
      creationImage: true,
      createdAt: true,
      authorId: true,
      author: true,
      category: true,
      slug: true,
      viewCount: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return workflows;
};

export const fetchSingleWorkflow = async (slug: string) => {
  try {
    // Try to get current user, but don't fail if not logged in
    let user = null;
    try {
      user = await getAuthUser();
    } catch {
      // User is not logged in, continue without user
      console.log("User not logged in, continuing as public user");
    }
    //  studio
    //creating-and-sharing-customized-cartoon-content-author-henry-munoz-date-072125-910am
    //automated-cartoon-video-creation-and-sharing-author-henry-munoz-date-072125-907am

    console.log(slug);
    const workflow = await db.workflow.findUnique({
      where: { slug },
      include: {
        author: true,
        workflowSteps: {
          orderBy: { stepNumber: "asc" },
        },
      },
    });

    if (!workflow) {
      return { message: "Workflow not found", success: false };
    }

    // Always update workflow view count
    await db.workflow.update({
      where: { slug },
      data: { viewCount: { increment: 1 } },
    });

    // Only update user's last viewed workflow if user is logged in
    if (user) {
      await db.profile.update({
        where: { clerkId: user.id },
        data: {
          lastWorkflowId: workflow.id,
          lastViewedAt: new Date(),
        },
      });
    }

    return workflow;
  } catch (error) {
    return renderError(error);
  }
};

export const fetchMyWorkflows = async () => {
  const user = await getAuthUser();

  const workflows = await db.workflow.findMany({
    where: {
      authorId: user.id,
    },
    orderBy: {
      createdAt: "desc", // This sorts by newest first
    },
    include: {
      author: true, // Optionally include author details if needed
    },
  });

  return workflows;
};

export async function getUserWorkflowStats() {
  try {
    // Get the current authenticated user
    const user = await getAuthUser();

    // Fetch all workflows created by the user
    const userWorkflows = await db.workflow.findMany({
      where: {
        authorId: user.id,
      },
      select: {
        id: true,
        viewCount: true,
        category: true,
      },
    });

    // Calculate total workflows
    const totalWorkflows = userWorkflows.length;

    // Calculate total views
    const totalViews = userWorkflows.reduce(
      (sum, workflow) => sum + workflow.viewCount,
      0
    );

    // Count categories
    const categoryCount = new Map<string, number>();

    userWorkflows.forEach((workflow) => {
      const category = workflow.category;
      categoryCount.set(category, (categoryCount.get(category) || 0) + 1);
    });

    // Convert category map to array
    const categoriesUsed = Array.from(categoryCount.entries()).map(
      ([name, count]) => ({
        name,
        count,
      })
    );

    // Sort categories by count (highest first)
    categoriesUsed.sort((a, b) => b.count - a.count);

    // Get most used category

    return {
      totalWorkflows,
      totalViews,
      categoriesUsed,
    };
  } catch (error) {
    console.error("Error fetching user workflow stats:", error);
    // Return default values in case of error
    return {
      totalWorkflows: 0,
      totalViews: 0,
      categoriesUsed: [],
    };
  }
}

// Downloads

// utils/actions.ts
export const recordWorkflowDownload = async (workflowId: string) => {
  try {
    const user = await getAuthUser();

    // Create the download record
    await db.workflowDownload.create({
      data: {
        workflowId,
        userId: user.id,
      },
    });

    return { message: "Download recorded successfully" };
  } catch (error) {
    return renderError(error);
  }
};

// utils/actions.ts
export const fetchUserDownloads = async () => {
  try {
    const user = await getAuthUser();

    const downloads = await db.workflowDownload.findMany({
      where: {
        userId: user.id,
      },
      include: {
        workflow: {
          include: {
            author: true,
          },
        },
      },
      orderBy: {
        downloadedAt: "desc",
      },
    });

    return downloads;
  } catch (error) {
    return renderError(error);
  }
};

export const deleteWorkflowAction = async (
  prevState: Record<string, unknown>,
  formData: FormData | { workflowId: string }
): Promise<{ message: string; success: boolean }> => {
  try {
    // Get workflow ID from either FormData or direct object
    const workflowId =
      formData instanceof FormData
        ? (formData.get("workflowId") as string)
        : formData.workflowId;

    if (!workflowId) {
      throw new Error("Workflow ID is required");
    }

    // Check permissions using the reusable function
    const canDelete = await isCreatorOrAdmin(workflowId);

    if (!canDelete) {
      return {
        message: "You do not have permission to delete this workflow",
        success: false,
      };
    }

    // Get the workflow with all step images AND workflow image before deletion
    const workflow = await db.workflow.findUnique({
      where: { id: workflowId },
      select: {
        title: true,
        workflowImage: true,
        creationImage: true,
        workflowSteps: {
          select: {
            stepImage: true,
          },
        },
      },
    });

    // Check if workflow exists
    if (!workflow) {
      return {
        message: "No workflow found with that id",
        success: false,
      };
    }

    // Collect all images that need to be deleted from Supabase
    const imagesToDelete: string[] = [];

    // Add workflow image if it exists and is from Supabase
    if (
      workflow.workflowImage &&
      workflow.workflowImage.includes("supabase.co")
    ) {
      imagesToDelete.push(workflow.workflowImage);
    }

    // Add workflow image if it exists and is from Supabase
    if (
      workflow.creationImage &&
      workflow.creationImage.includes("supabase.co")
    ) {
      imagesToDelete.push(workflow.creationImage);
    }

    // Add all step images from Supabase
    const stepImages = workflow.workflowSteps
      .map((step) => step.stepImage)
      .filter(
        (imageUrl) => imageUrl && imageUrl.includes("supabase.co")
      ) as string[];

    imagesToDelete.push(...stepImages);

    // Delete the workflow from the database first
    // This will cascade delete related records based on your schema relationships
    await db.workflow.delete({
      where: { id: workflowId },
    });

    if (imagesToDelete.length > 0) {
      const deletePromises = imagesToDelete.map((imageUrl) =>
        deleteImage(imageUrl)
      );

      // Wait for all image deletions to complete
      await Promise.allSettled(deletePromises);
    }

    // Revalidate relevant paths to update the UI
    revalidatePath("/dashboard/wf"); // My Workflows page
    revalidatePath("/"); // Home page that might show the workflows

    // Return success message
    return {
      message: `"${workflow.title}" was successfully deleted`,
      success: true,
    };
  } catch (error) {
    return renderError(error);
  }
};

// Add this to utils/actions.ts

// Leaderboard data types
interface TopDownloadedWorkflow {
  id: string;
  title: string;
  authorName: string;
  authorProfileImage: string;
  _count: {
    downloads: number;
  };
}

interface TopContributor {
  id: string;
  name: string;
  username: string;
  profileImage: string;
  workflowCount: number;
}

interface TrendingWorkflow {
  id: string;
  title: string;
  authorName: string;
  authorProfileImage: string;
  recentViews: number;
}

interface LeaderboardData {
  topDownloadedWorkflows: TopDownloadedWorkflow[];
  topWorkflowCreators: TopContributor[];
  trendingThisMonth: TrendingWorkflow[];
}

// Function to fetch leaderboard data
export const getLeaderboardData = async (): Promise<LeaderboardData> => {
  try {
    // Get top downloaded workflows
    const topDownloadedWorkflows = await db.workflow.findMany({
      take: 10,
      select: {
        id: true,
        title: true,
        slug: true,
        author: {
          select: {
            firstName: true,
            lastName: true,
            profileImage: true,
          },
        },
        _count: {
          select: {
            downloads: true,
          },
        },
      },
      orderBy: {
        downloads: {
          _count: "desc",
        },
      },
    });

    // Get top workflow creators
    const topWorkflowCreators = await db.profile.findMany({
      take: 10,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        username: true,
        profileImage: true,
        _count: {
          select: {
            Workflow: true,
          },
        },
      },
      orderBy: {
        Workflow: {
          _count: "desc",
        },
      },
    });

    // Get trending workflows this month
    // First get the date for the beginning of the current month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Find workflows with the most views in the current month
    const trendingThisMonth = await db.workflow.findMany({
      take: 10,
      select: {
        id: true,
        title: true,
        slug: true,
        viewCount: true, // This is used as a proxy for monthly views
        author: {
          select: {
            firstName: true,
            lastName: true,
            profileImage: true,
          },
        },
      },
      where: {
        updatedAt: {
          gte: startOfMonth,
        },
      },
      orderBy: {
        viewCount: "desc",
      },
    });

    // Format the data for the component
    return {
      topDownloadedWorkflows: topDownloadedWorkflows.map((workflow) => ({
        id: workflow.slug, // Using slug as ID for URL construction
        title: workflow.title,
        slug: workflow.slug,
        authorName: `${workflow.author.firstName} ${workflow.author.lastName}`,
        authorProfileImage: workflow.author.profileImage,
        _count: {
          downloads: workflow._count.downloads,
        },
      })),

      topWorkflowCreators: topWorkflowCreators.map((creator) => ({
        id: creator.id,
        name: `${creator.firstName} ${creator.lastName}`,
        username: creator.username,
        profileImage: creator.profileImage,
        workflowCount: creator._count.Workflow,
      })),

      trendingThisMonth: trendingThisMonth.map((workflow) => ({
        id: workflow.slug, // Using slug as ID for URL construction
        title: workflow.title,
        authorName: `${workflow.author.firstName} ${workflow.author.lastName}`,
        authorProfileImage: workflow.author.profileImage,
        recentViews: workflow.viewCount, // Using viewCount as proxy for monthly views
      })),
    };
  } catch (error) {
    console.error("Error fetching leaderboard data:", error);

    // Return empty data in case of error
    return {
      topDownloadedWorkflows: [],
      topWorkflowCreators: [],
      trendingThisMonth: [],
    };
  }
};

export const getUserProfileWithWorkflows = async (username: string) => {
  try {
    // Find the user profile by username
    const profile = await db.profile.findFirst({
      where: {
        username: username,
      },
      select: {
        id: true,
        clerkId: true,
        firstName: true,
        lastName: true,
        username: true,
        email: true,
        profileImage: true,
        bio: true,
        createdAt: true,
        _count: {
          select: {
            Workflow: true,
          },
        },
        Workflow: {
          select: {
            id: true,
            slug: true,
            title: true,
            category: true,
            workflowImage: true,
            creationImage: true,
            viewCount: true,
            createdAt: true,
            _count: {
              select: {
                downloads: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc", // Most recent first
          },
        },
      },
    });

    // Return null if profile doesn't exist
    if (!profile) {
      return null;
    }

    // Calculate total downloads across all workflows
    const totalDownloads = profile.Workflow.reduce(
      (sum, workflow) => sum + workflow._count.downloads,
      0
    );

    // Return formatted user profile data
    return {
      id: profile.id,
      firstName: profile.firstName,
      lastName: profile.lastName,
      username: profile.username,
      email: profile.email,
      profileImage: profile.profileImage,
      bio: profile.bio,
      createdAt: profile.createdAt,
      totalWorkflows: profile._count.Workflow,
      totalDownloads: totalDownloads,
      workflows: profile.Workflow,
    };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};

// COMPLETION TRACKING FOR STUDENTS  --------------------------------------------------------------------------

// Record workflow completion for current user ==================>
export const recordWorkflowCompletion = async (workflowId: string) => {
  try {
    const user = await getAuthUser();

    // Check if workflow exists
    const workflow = await db.workflow.findUnique({
      where: { id: workflowId },
      select: { id: true, title: true },
    });

    if (!workflow) {
      return {
        success: false,
        message: "Workflow not found",
      };
    }

    // Check if user already completed this workflow
    const existingCompletion = await db.workflowCompletion.findUnique({
      where: {
        workflowId_userId: {
          workflowId,
          userId: user.id,
        },
      },
    });

    if (existingCompletion) {
      return {
        success: false,
        message: "You have already completed this workflow",
        completedAt: existingCompletion.completedAt,
      };
    }

    // Create completion record
    const completion = await db.workflowCompletion.create({
      data: {
        workflowId,
        userId: user.id,
      },
      include: {
        workflow: {
          select: {
            title: true,
          },
        },
      },
    });

    return {
      success: true,
      message: `Workflow "${workflow.title}" marked as completed!`,
      completedAt: completion.completedAt,
    };
  } catch (error) {
    console.error("Error recording workflow completion:", error);
    return {
      success: false,
      message: "Failed to record completion",
    };
  }
};

// Check if current user completed a specific workflow
export const checkWorkflowCompletion = async (workflowId: string) => {
  try {
    const user = await getAuthUser();

    const completion = await db.workflowCompletion.findUnique({
      where: {
        workflowId_userId: {
          workflowId,
          userId: user.id,
        },
      },
      select: {
        completedAt: true,
      },
    });

    return {
      isCompleted: !!completion,
      completedAt: completion?.completedAt || null,
    };
  } catch (error) {
    console.error("Error checking workflow completion:", error);
    return {
      isCompleted: false,
      completedAt: null,
    };
  }
};

// Get all completions for current user
export const fetchUserCompletions = async () => {
  try {
    const user = await getAuthUser();

    const completions = await db.workflowCompletion.findMany({
      where: {
        userId: user.id,
      },
      include: {
        workflow: {
          select: {
            id: true,
            title: true,
            category: true,
            slug: true,
            workflowImage: true,
            creationImage: true,
            author: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
      orderBy: {
        completedAt: "desc",
      },
    });

    return completions;
  } catch (error) {
    console.error("Error fetching user completions:", error);
    return [];
  }
};

// Get completion statistics for current user
export const getUserCompletionStats = async () => {
  try {
    const user = await getAuthUser();

    // Get total completion count
    const totalCompletions = await db.workflowCompletion.count({
      where: {
        userId: user.id,
      },
    });

    // Get completions by category

    // Get recent completions ALL USERS (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentCompletions = await db.workflowCompletion.count({
      where: {
        userId: user.id,
        completedAt: {
          gte: sevenDaysAgo,
        },
      },
    });

    // Get most recent completion
    const latestCompletion = await db.workflowCompletion.findFirst({
      where: {
        userId: user.id,
      },
      include: {
        workflow: {
          select: {
            title: true,
            slug: true,
          },
        },
      },
      orderBy: {
        completedAt: "desc",
      },
    });

    return {
      totalCompletions,
      recentCompletions,
      latestCompletion,
      // You can add category breakdown here if needed
    };
  } catch (error) {
    console.error("Error fetching user completion stats:", error);
    return {
      totalCompletions: 0,
      recentCompletions: 0,
      latestCompletion: null,
    };
  }
};

// Remove workflow completion (if user wants to "uncomplete" it)
export const removeWorkflowCompletion = async (workflowId: string) => {
  try {
    const user = await getAuthUser();

    const deletedCompletion = await db.workflowCompletion.delete({
      where: {
        workflowId_userId: {
          workflowId,
          userId: user.id,
        },
      },
      include: {
        workflow: {
          select: {
            title: true,
          },
        },
      },
    });

    return {
      success: true,
      message: `Completion status removed for "${deletedCompletion.workflow.title}"`,
    };
  } catch (error) {
    console.error("Error removing workflow completion:", error);
    return {
      success: false,
      message: "Failed to remove completion status",
    };
  }
};

// Get global completion leaderboard (top users by completion count)
export const getCompletionLeaderboard = async (limit: number = 10) => {
  try {
    const leaderboard = await db.workflowCompletion.groupBy({
      by: ["userId"],
      _count: {
        userId: true,
      },
      orderBy: {
        _count: {
          userId: "desc",
        },
      },
      take: limit,
    });

    // Get user details for the leaderboard
    const userIds = leaderboard.map((entry) => entry.userId);
    const users = await db.profile.findMany({
      where: {
        clerkId: {
          in: userIds,
        },
      },
      select: {
        clerkId: true,
        firstName: true,
        lastName: true,
        username: true,
        profileImage: true,
      },
    });

    // Combine completion counts with user data
    const leaderboardWithUsers = leaderboard.map((entry) => {
      const user = users.find((u) => u.clerkId === entry.userId);
      return {
        userId: entry.userId,
        completionCount: entry._count.userId,
        user: user || null,
      };
    });

    return leaderboardWithUsers;
  } catch (error) {
    console.error("Error fetching completion leaderboard:", error);
    return [];
  }
};

// Get user's ranking position
export const getUserCompletionRank = async () => {
  try {
    const user = await getAuthUser();

    // Get user's completion count
    const userCompletionCount = await db.workflowCompletion.count({
      where: {
        userId: user.id,
      },
    });

    // Get count of users with more completions
    const usersWithMoreCompletions = await db.workflowCompletion.groupBy({
      by: ["userId"],
      _count: {
        userId: true,
      },
      having: {
        userId: {
          _count: {
            gt: userCompletionCount,
          },
        },
      },
    });

    const rank = usersWithMoreCompletions.length + 1;

    return {
      rank,
      completionCount: userCompletionCount,
    };
  } catch (error) {
    console.error("Error fetching user completion rank:", error);
    return {
      rank: null,
      completionCount: 0,
    };
  }
};

export const getRecentCompletionLeaderboards = async () => {
  try {
    const now = new Date();

    // Calculate date boundaries
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // Get today's completions
    const todayCompletions = await db.workflowCompletion.groupBy({
      by: ["userId"],
      where: {
        completedAt: {
          gte: todayStart,
        },
      },
      _count: {
        userId: true,
      },
      orderBy: {
        _count: {
          userId: "desc",
        },
      },
      take: 10,
    });

    // Get this week's completions
    const weekCompletions = await db.workflowCompletion.groupBy({
      by: ["userId"],
      where: {
        completedAt: {
          gte: weekStart,
        },
      },
      _count: {
        userId: true,
      },
      orderBy: {
        _count: {
          userId: "desc",
        },
      },
      take: 10,
    });

    // Get this month's completions
    const monthCompletions = await db.workflowCompletion.groupBy({
      by: ["userId"],
      where: {
        completedAt: {
          gte: monthStart,
        },
      },
      _count: {
        userId: true,
      },
      orderBy: {
        _count: {
          userId: "desc",
        },
      },
      take: 10,
    });

    // Get user details for all completion data
    const allUserIds = [
      ...todayCompletions.map((c) => c.userId),
      ...weekCompletions.map((c) => c.userId),
      ...monthCompletions.map((c) => c.userId),
    ];

    const uniqueUserIds = [...new Set(allUserIds)];

    const users = await db.profile.findMany({
      where: {
        clerkId: {
          in: uniqueUserIds,
        },
      },
      select: {
        clerkId: true,
        firstName: true,
        lastName: true,
        username: true,
        profileImage: true,
      },
    });

    // Helper function to combine completion data with user info
    const combineWithUserData = (
      completions: CompletionCountData[]
    ): CompletionWithUserData[] => {
      return completions
        .map((completion) => {
          const user = users.find((u) => u.clerkId === completion.userId);
          return {
            userId: completion.userId,
            completionCount: completion._count.userId,
            user: user || null,
          };
        })
        .filter((item): item is CompletionWithUserData => item.user !== null); // Type guard to filter out null users
    };

    return {
      today: combineWithUserData(todayCompletions),
      week: combineWithUserData(weekCompletions),
      month: combineWithUserData(monthCompletions),
    };
  } catch (error) {
    console.error("Error fetching recent completion leaderboards:", error);
    return {
      today: [],
      week: [],
      month: [],
    };
  }
};

// Get completion streaks for gamification
export const getCompletionStreaks = async () => {
  try {
    const user = await getAuthUser();
    const now = new Date();

    // Get user's recent completions (last 30 days)
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const recentCompletions = await db.workflowCompletion.findMany({
      where: {
        userId: user.id,
        completedAt: {
          gte: thirtyDaysAgo,
        },
      },
      orderBy: {
        completedAt: "desc",
      },
      select: {
        completedAt: true,
      },
    });

    // Calculate current streak
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let lastDate: Date | null = null;

    // Group completions by date
    const completionsByDate = new Map<string, number>();
    recentCompletions.forEach((completion) => {
      const dateKey = completion.completedAt.toISOString().split("T")[0];
      completionsByDate.set(dateKey, (completionsByDate.get(dateKey) || 0) + 1);
    });

    // Sort dates and calculate streaks
    const sortedDates = Array.from(completionsByDate.keys()).sort().reverse();

    for (let i = 0; i < sortedDates.length; i++) {
      const currentDate = new Date(sortedDates[i]);

      if (lastDate === null) {
        // First date
        tempStreak = 1;
        if (isToday(currentDate) || isYesterday(currentDate)) {
          currentStreak = 1;
        }
      } else {
        const daysDiff = Math.floor(
          (lastDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysDiff === 1) {
          // Consecutive day
          tempStreak++;
          if (i === 0 && (isToday(currentDate) || isYesterday(currentDate))) {
            currentStreak = tempStreak;
          }
        } else {
          // Streak broken
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
          if (i === 0 && isToday(currentDate)) {
            currentStreak = 1;
          }
        }
      }

      lastDate = currentDate;
    }

    longestStreak = Math.max(longestStreak, tempStreak);

    // Get today's completions count
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const todayCompletions = await db.workflowCompletion.count({
      where: {
        userId: user.id,
        completedAt: {
          gte: todayStart,
        },
      },
    });

    return {
      currentStreak,
      longestStreak,
      todayCompletions,
      totalCompletions: recentCompletions.length,
    };
  } catch (error) {
    console.error("Error fetching completion streaks:", error);
    return {
      currentStreak: 0,
      longestStreak: 0,
      todayCompletions: 0,
      totalCompletions: 0,
    };
  }
};

// Helper functions
function isToday(date: Date): boolean {
  const today = new Date();
  return date.toDateString() === today.toDateString();
}

function isYesterday(date: Date): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return date.toDateString() === yesterday.toDateString();
}

// Get global completion statistics for leaderboard insights
export const getGlobalCompletionStats = async () => {
  try {
    const now = new Date();
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // Get completion counts
    const [
      totalCompletions,
      todayCompletions,
      weekCompletions,
      monthCompletions,
      totalActiveStudents,
      totalWorkflows,
    ] = await Promise.all([
      db.workflowCompletion.count(),
      db.workflowCompletion.count({
        where: { completedAt: { gte: todayStart } },
      }),
      db.workflowCompletion.count({
        where: { completedAt: { gte: weekStart } },
      }),
      db.workflowCompletion.count({
        where: { completedAt: { gte: monthStart } },
      }),
      db.workflowCompletion
        .groupBy({
          by: ["userId"],
          _count: {
            userId: true,
          },
        })
        .then((result) => result.length),
      db.workflow.count(),
    ]);

    // Calculate average completions per workflow
    const avgCompletionsPerWorkflow =
      totalWorkflows > 0
        ? Math.round((totalCompletions / totalWorkflows) * 100) / 100
        : 0;

    return {
      totalCompletions,
      todayCompletions,
      weekCompletions,
      monthCompletions,
      totalActiveStudents,
      totalWorkflows,
      avgCompletionsPerWorkflow,
    };
  } catch (error) {
    console.error("Error fetching global completion stats:", error);
    return {
      totalCompletions: 0,
      todayCompletions: 0,
      weekCompletions: 0,
      monthCompletions: 0,
      totalActiveStudents: 0,
      totalWorkflows: 0,
      avgCompletionsPerWorkflow: 0,
    };
  }
};

/// Issue reporting actions ====================================================================== >>>>

// Create a new issue report
export const createIssue = async (
  prevState: Record<string, unknown>,
  formData: FormData
): Promise<{ message: string; success: boolean }> => {
  try {
    // Get current user (optional - could be null for guests)
    const user = await currentUser();

    // Get form data
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const workflowUrl = formData.get("workflowUrl") as string;
    const content = formData.get("content") as string;

    // Basic validation
    if (!name || !content) {
      return {
        message: "Name and issue description are required",
        success: false,
      };
    }

    if (!email && !phone) {
      return {
        message: "Please provide either email or phone for response",
        success: false,
      };
    }

    // Create issue
    await db.issue.create({
      data: {
        name: name.trim(),
        email: email?.trim() || null,
        phone: phone?.trim() || null,
        workflowUrl: workflowUrl?.trim() || null,
        content: content.trim(),
        userId: user?.id || null, // Link to user if logged in
        status: "OPEN",
        priority: "MEDIUM", // ← Add this
      },
    });

    return {
      message: "Issue reported successfully! We'll get back to you soon.",
      success: true,
    };
  } catch (error) {
    console.error("Error creating issue:", error);
    return {
      message: "Failed to submit issue. Please try again.",
      success: false,
    };
  }
};

// Get all issues (for admin dashboard)
export const fetchAllIssues = async () => {
  try {
    const issues = await db.issue.findMany({
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return issues;
  } catch (error) {
    console.error("Error fetching issues:", error);
    return [];
  }
};

// Update issue status (admin only)
export const updateIssueStatus = async (
  issueId: string,
  newStatus: IssueStatus
): Promise<{ message: string; success: boolean }> => {
  try {
    await db.issue.update({
      where: { id: issueId },
      data: {
        status: newStatus,
        updatedAt: new Date(),
      },
    });

    revalidatePath("/admin/issues"); // Adjust path as needed

    return { message: `Issue status updated to ${newStatus}`, success: true };
  } catch (error) {
    console.error("Error updating issue status:", error);
    return { message: "Failed to update issue status", success: false };
  }
};

// Get issues by status (for admin filtering)
export const fetchIssuesByStatus = async (status?: IssueStatus) => {
  try {
    const issues = await db.issue.findMany({
      where: status ? { status: status as IssueStatus } : undefined,
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return issues;
  } catch (error) {
    console.error("Error fetching issues by status:", error);
    return [];
  }
};

// Get single issue details
export const fetchIssueById = async (issueId: string) => {
  try {
    const issue = await db.issue.findUnique({
      where: { id: issueId },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            username: true,
            profileImage: true,
          },
        },
      },
    });

    return issue;
  } catch (error) {
    console.error("Error fetching issue:", error);
    return null;
  }
};

// Delete issue (admin only)
export const deleteIssue = async (
  issueId: string
): Promise<{ message: string; success: boolean }> => {
  try {
    await db.issue.delete({
      where: { id: issueId },
    });

    revalidatePath("/admin/issues");

    return { message: "Issue deleted successfully", success: true };
  } catch (error) {
    console.error("Error deleting issue:", error);
    return { message: "Failed to delete issue", success: false };
  }
};

export const updateIssuePriority = async (
  issueId: string,
  newPriority: Priority
): Promise<{ message: string; success: boolean }> => {
  try {
    await db.issue.update({
      where: { id: issueId },
      data: {
        priority: newPriority,
        updatedAt: new Date(),
      },
    });

    revalidatePath("/dashboard/admin/issues"); // Adjust path as needed

    return {
      message: `Issue priority updated }`,
      success: true,
    };
  } catch (error) {
    console.error("Error updating issue priority:", error);
    return { message: "Failed to update issue priority", success: false };
  }
};

//  Admin actions ====================================================================== >>>>

// Add these functions to your utils/actions.ts file
// Add this single function to your utils/actions.ts file

// Updated fetchAdminDashboardStats with single admin check
export const fetchAdminDashboardStats = async () => {
  try {
    // Check if user is admin - throw error if not
    const isAdmin = await isAdminUser();
    if (!isAdmin) {
      throw new Error("Access denied. Admin privileges required.");
    }

    // Get current date boundaries
    const now = new Date();
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    // Fetch all main counts in parallel
    const [
      totalUsers,
      totalWorkflows,
      totalDownloads,
      totalIssues,
      totalViews,
      totalCompletions,
      newUsersToday,
      newWorkflowsToday,
      newDownloadsToday,
      newIssuesToday,
      newCompletionsToday,
    ] = await Promise.all([
      // Main totals
      db.profile.count(),
      db.workflow.count(),
      db.workflowDownload.count(),
      db.issue.count(),
      db.workflow
        .aggregate({
          _sum: { viewCount: true },
        })
        .then((result) => result._sum.viewCount || 0),
      db.workflowCompletion.count(),

      // Today's new records
      db.profile.count({
        where: { createdAt: { gte: todayStart } },
      }),
      db.workflow.count({
        where: { createdAt: { gte: todayStart } },
      }),
      db.workflowDownload.count({
        where: { downloadedAt: { gte: todayStart } },
      }),
      db.issue.count({
        where: { createdAt: { gte: todayStart } },
      }),
      db.workflowCompletion.count({
        where: { completedAt: { gte: todayStart } },
      }),
    ]);

    // Get issues by status
    const issuesByStatus = await db.issue.groupBy({
      by: ["status"],
      _count: {
        status: true,
      },
    });

    const issueStatusCounts = {
      open:
        issuesByStatus.find((item) => item.status === "OPEN")?._count.status ||
        0,
      inProgress:
        issuesByStatus.find((item) => item.status === "IN_PROGRESS")?._count
          .status || 0,
      resolved:
        issuesByStatus.find((item) => item.status === "RESOLVED")?._count
          .status || 0,
      closed:
        issuesByStatus.find((item) => item.status === "CLOSED")?._count
          .status || 0,
    };

    // Get top workflows by downloads
    const topWorkflows = await db.workflow.findMany({
      take: 5,
      select: {
        id: true,
        title: true,
        slug: true,
        viewCount: true,
        author: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        _count: {
          select: {
            downloads: true,
          },
        },
      },
      orderBy: {
        downloads: {
          _count: "desc",
        },
      },
    });

    // Get top users by workflow count
    const topUsers = await db.profile.findMany({
      take: 5,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        username: true,
        profileImage: true,
        _count: {
          select: {
            Workflow: true,
          },
        },
      },
      orderBy: {
        Workflow: {
          _count: "desc",
        },
      },
    });

    // Calculate total downloads for each top user
    const topUsersWithDownloads = await Promise.all(
      topUsers.map(async (user) => {
        const totalDownloads = await db.workflowDownload.count({
          where: {
            workflow: {
              authorId: user.id,
            },
          },
        });
        return {
          ...user,
          totalDownloads,
        };
      })
    );

    // Get recent activity (last 10 activities)
    const [
      recentUsers,
      recentWorkflows,
      recentDownloads,
      recentIssues,
      recentCompletions,
    ] = await Promise.all([
      db.profile.findMany({
        take: 2,
        select: {
          firstName: true,
          lastName: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      db.workflow.findMany({
        take: 2,
        select: {
          title: true,
          createdAt: true,
          author: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      db.workflowDownload.findMany({
        take: 2,
        select: {
          downloadedAt: true,
          workflow: {
            select: {
              title: true,
            },
          },
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: { downloadedAt: "desc" },
      }),
      db.issue.findMany({
        take: 2,
        select: {
          name: true,
          content: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      db.workflowCompletion.findMany({
        take: 2,
        select: {
          completedAt: true,
          workflow: {
            select: {
              title: true,
            },
          },
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: { completedAt: "desc" },
      }),
    ]);

    // Combine and format recent activity
    const recentActivity = [
      ...recentUsers.map((user) => ({
        type: "user" as const,
        message: `New user ${user.firstName} ${user.lastName} joined the platform`,
        timestamp: user.createdAt,
        user: `${user.firstName} ${user.lastName}`,
      })),
      ...recentWorkflows.map((workflow) => ({
        type: "workflow" as const,
        message: `New workflow "${workflow.title}" created by ${workflow.author.firstName} ${workflow.author.lastName}`,
        timestamp: workflow.createdAt,
        user: `${workflow.author.firstName} ${workflow.author.lastName}`,
      })),
      ...recentDownloads.map((download) => ({
        type: "download" as const,
        message: `${download.user.firstName} ${download.user.lastName} downloaded "${download.workflow.title}"`,
        timestamp: download.downloadedAt,
        user: `${download.user.firstName} ${download.user.lastName}`,
      })),
      ...recentIssues.map((issue) => ({
        type: "issue" as const,
        message: `New issue reported: "${issue.content.substring(0, 50)}..."`,
        timestamp: issue.createdAt,
        user: issue.name,
      })),
      ...recentCompletions.map((completion) => ({
        type: "completion" as const,
        message: `${completion.user.firstName} ${completion.user.lastName} completed "${completion.workflow.title}"`,
        timestamp: completion.completedAt,
        user: `${completion.user.firstName} ${completion.user.lastName}`,
      })),
    ]
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
      .slice(0, 10);

    return {
      totalUsers,
      totalWorkflows,
      totalDownloads,
      totalIssues,
      totalViews,
      totalCompletions,
      todayStats: {
        newUsers: newUsersToday,
        newWorkflows: newWorkflowsToday,
        newDownloads: newDownloadsToday,
        newIssues: newIssuesToday,
        newCompletions: newCompletionsToday,
      },
      issuesByStatus: issueStatusCounts,
      recentActivity,
      topWorkflows: topWorkflows.map((workflow) => ({
        id: workflow.slug,
        title: workflow.title,
        author: `${workflow.author.firstName} ${workflow.author.lastName}`,
        downloads: workflow._count.downloads,
        views: workflow.viewCount,
      })),
      topUsers: topUsersWithDownloads.map((user) => ({
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        workflowCount: user._count.Workflow,
        totalDownloads: user.totalDownloads,
      })),
    };
  } catch (error) {
    console.error("Error fetching admin dashboard stats:", error);

    // If it's an admin access error, re-throw it
    if (error instanceof Error && error.message.includes("Access denied")) {
      throw error;
    }

    // For other errors, return default values
    return {
      totalUsers: 0,
      totalWorkflows: 0,
      totalDownloads: 0,
      totalIssues: 0,
      totalViews: 0,
      totalCompletions: 0,
      todayStats: {
        newUsers: 0,
        newWorkflows: 0,
        newDownloads: 0,
        newIssues: 0,
        newCompletions: 0,
      },
      issuesByStatus: {
        open: 0,
        inProgress: 0,
        resolved: 0,
        closed: 0,
      },
      recentActivity: [],
      topWorkflows: [],
      topUsers: [],
    };
  }
};

//  Update video url  =======================================>

// Add this function to your utils/actions.ts file
export const updateWorkflowVideoAction = async (
  prevState: Record<string, unknown>,
  formData: FormData | { workflowId: string; videoUrl: string }
): Promise<{ message: string; success: boolean }> => {
  try {
    // Get workflow ID and video URL from either FormData or direct object
    const workflowId =
      formData instanceof FormData
        ? (formData.get("workflowId") as string)
        : formData.workflowId;

    const videoUrl =
      formData instanceof FormData
        ? (formData.get("videoUrl") as string)
        : formData.videoUrl;

    if (!workflowId) {
      throw new Error("Workflow ID is required");
    }

    // Validate YouTube URL if provided
    if (videoUrl && videoUrl.trim() !== "") {
      const youtubeRegex =
        /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)/;

      if (!youtubeRegex.test(videoUrl.trim())) {
        return {
          message:
            "Please provide a valid YouTube URL (youtube.com or youtu.be)",
          success: false,
        };
      }
    }

    // Check permissions using the reusable function
    const canEdit = await isCreatorOrAdmin(workflowId);

    if (!canEdit) {
      return {
        message: "You do not have permission to update this workflow",
        success: false,
      };
    }

    // Update the workflow with the new video URL
    await db.workflow.update({
      where: { id: workflowId },
      data: {
        videoUrl: videoUrl?.trim() || null, // Store null if empty string
        updatedAt: new Date(),
      },
    });

    // Revalidate relevant paths to update the UI
    revalidatePath("/dashboard/wf"); // My Workflows page
    revalidatePath(`/workflow/${workflowId}`); // Individual workflow page

    // Return success message
    const actionMessage = videoUrl?.trim()
      ? "Video URL updated successfully"
      : "Video URL removed successfully";

    return {
      message: actionMessage,
      success: true,
    };
  } catch (error) {
    console.error("Error updating workflow video:", error);
    return {
      message:
        error instanceof Error ? error.message : "Failed to update video URL",
      success: false,
    };
  }
};

// ================================>

export const adminFetchAllWorkflows = async () => {
  const isAnAdmin = await isAdminUser();

  if (!isAnAdmin) {
    return {
      message: "You do not have permission to view  this workflows",
      success: false,
    };
  } else {
    const workflows = await db.workflow.findMany({
      orderBy: {
        createdAt: "desc", // This sorts by newest first
      },
      include: {
        author: true, // Optionally include author details if needed
      },
    });

    return workflows;
  }
};

//  Steps actions ====================================================================== >>>>

// ===================================================
// Add this to utils/actions.ts

/**
 * Update workflow step information (stepTitle, stepDescription, helpText, helpLinks)
 */
export const updateWorkflowStepAction = async (
  stepId: string,
  data: {
    stepTitle: string;
    stepDescription?: string;
    helpText?: string;
    helpLinks?: Array<{ title: string; url: string }>;
  }
): Promise<{ success: boolean; message: string }> => {
  try {
    const user = await getAuthUser();

    // Validate the input data
    const validatedFields = validateWithZodSchema(workflowStepSchema, data);

    // First, check if the step exists and verify ownership through the workflow
    const step = await db.workflowStep.findUnique({
      where: { id: stepId },
      include: {
        workflow: {
          select: {
            id: true,
            authorId: true,
            title: true,
            slug: true,
          },
        },
      },
    });

    if (!step) {
      return {
        success: false,
        message: "Workflow step not found",
      };
    }

    // Verify that the current user owns the workflow
    if (step.workflow.authorId !== user.id) {
      return {
        success: false,
        message: "You do not have permission to edit this workflow step",
      };
    }

    // Prepare the update data - Fix for JSON field handling
    const updateData = {
      stepTitle: validatedFields.stepTitle,
      stepDescription: validatedFields.stepDescription || null,
      helpText: validatedFields.helpText || null,
      helpLinks:
        validatedFields.helpLinks && validatedFields.helpLinks.length > 0
          ? validatedFields.helpLinks
          : undefined, // Use undefined instead of null for JSON fields
      updatedAt: new Date(),
    };

    // Update the workflow step
    await db.workflowStep.update({
      where: { id: stepId },
      data: updateData,
    });

    // Revalidate the workflow page to reflect changes
    revalidatePath(`/workflow/${step.workflow.slug}`);
    revalidatePath("/dashboard/wf");

    return {
      success: true,
      message: "Workflow step updated successfully",
    };
  } catch (error) {
    console.error("Error updating workflow step:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update workflow step",
    };
  }
};

/**
 * Get a specific workflow step by ID with ownership verification
 */
export const fetchWorkflowStep = async (stepId: string) => {
  try {
    const user = await getAuthUser();

    const step = await db.workflowStep.findUnique({
      where: { id: stepId },
      include: {
        workflow: {
          select: {
            id: true,
            authorId: true,
            title: true,
            slug: true,
          },
        },
      },
    });

    if (!step) {
      return null;
    }

    // Verify ownership
    if (step.workflow.authorId !== user.id) {
      throw new Error(
        "You do not have permission to access this workflow step"
      );
    }

    return step;
  } catch (error) {
    console.error("Error fetching workflow step:", error);
    throw error;
  }
};

/**
 * Get all workflow steps for a specific workflow with ownership verification
 */
export const fetchWorkflowSteps = async (workflowId: string) => {
  try {
    const user = await getAuthUser();

    // First verify the user owns this workflow
    const workflow = await db.workflow.findUnique({
      where: { id: workflowId },
      select: {
        id: true,
        authorId: true,
        title: true,
      },
    });

    if (!workflow) {
      throw new Error("Workflow not found");
    }

    if (workflow.authorId !== user.id) {
      throw new Error("You do not have permission to access this workflow");
    }

    // Fetch all steps for this workflow
    const steps = await db.workflowStep.findMany({
      where: { workflowId },
      orderBy: { stepNumber: "asc" },
    });

    return steps;
  } catch (error) {
    console.error("Error fetching workflow steps:", error);
    throw error;
  }
};

export const updateWorkflowStepImageAction = async (
  prevState: Record<string, unknown>,
  formData: FormData
): Promise<{
  message: string;
  success?: boolean;
  imageUrl?: string;
  stepId?: string;
}> => {
  try {
    // Get the stepId from form data
    const stepId = formData.get("stepId") as string;
    const image = formData.get("image") as File;

    if (!stepId) {
      return { message: "Step ID is required" };
    }

    if (!image || image.size === 0) {
      return { message: "Image file is required" };
    }

    // Validate the image
    const validatedFields = validateWithZodSchema(imageSchema, { image });

    // Get the current step to retrieve the old image URL and verify ownership
    const currentStep = await db.workflowStep.findUnique({
      where: {
        id: stepId,
      },
      select: {
        stepImage: true,
        workflow: {
          select: {
            id: true,
            authorId: true,
            slug: true,
          },
        },
      },
    });

    if (!currentStep) {
      return { message: "Step not found" };
    }

    // Check if user is creator or admin
    const canEdit = await isCreatorOrAdmin(currentStep.workflow.id);

    if (!canEdit) {
      return {
        message: "You don't have permission to update this step",
        success: false,
      };
    }

    // Upload the new image
    const fullPath = await uploadImage(validatedFields.image);

    // Update the step with the new image
    const updatedStep = await db.workflowStep.update({
      where: {
        id: stepId,
      },
      data: {
        stepImage: fullPath,
      },
      include: {
        workflow: {
          select: {
            slug: true,
          },
        },
      },
    });

    // Delete the old image from storage (if it exists and is a Supabase URL)
    if (
      currentStep.stepImage &&
      currentStep.stepImage.includes("supabase.co")
    ) {
      await deleteImage(currentStep.stepImage);
    }

    // Revalidate the workflow page
    revalidatePath(`/dashboard/wf/${updatedStep.workflow.slug}`);
    revalidatePath("/dashboard/wf");

    return {
      message: "Step image updated successfully",
      success: true,
      imageUrl: fullPath,
      stepId: stepId,
    };
  } catch (error) {
    return renderError(error);
  }
};

export const updateWorkflowStepFormAction = async (
  prevState: unknown,
  formData: FormData
): Promise<{ success: boolean; message: string }> => {
  try {
    const stepId = formData.get("stepId") as string;
    const stepTitle = formData.get("stepTitle") as string;
    const stepDescription = formData.get("stepDescription") as string;
    const helpText = formData.get("helpText") as string;

    // Parse help links from form data (expecting JSON string)
    let helpLinks: Array<{ title: string; url: string }> = [];
    const helpLinksString = formData.get("helpLinks") as string;

    if (helpLinksString) {
      try {
        helpLinks = JSON.parse(helpLinksString);
      } catch (error) {
        console.error("Error parsing help links:", error);
        helpLinks = [];
      }
    }

    if (!stepId) {
      return {
        success: false,
        message: "Step ID is required",
      };
    }

    // Get the current step to verify ownership
    const currentStep = await db.workflowStep.findUnique({
      where: {
        id: stepId,
      },
      select: {
        workflow: {
          select: {
            id: true,
            authorId: true,
          },
        },
      },
    });

    if (!currentStep) {
      return {
        success: false,
        message: "Step not found",
      };
    }

    // Check if user is creator or admin
    const canEdit = await isCreatorOrAdmin(currentStep.workflow.id);

    if (!canEdit) {
      return {
        success: false,
        message: "You don't have permission to update this step",
      };
    }

    // Proceed with the update if permission check passes
    const result = await updateWorkflowStepAction(stepId, {
      stepTitle,
      stepDescription,
      helpText,
      helpLinks,
    });

    return result;
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update workflow step",
    };
  }
};

//  nodeUsageStats

// Add this action to your utils/actions.ts

// Fetch setup guides for a specific workflow's steps

export const fetchWorkflowGuides = async (workflowSteps: WorkflowStep[]) => {
  try {
    const serviceMap = new Map<
      string,
      { serviceName: string; hostIdentifier: string | null }
    >();

    for (const step of workflowSteps) {
      // Skip return steps and non-HTTP nodes
      if (step.nodeType.includes("StickyNote")) {
        continue;
      }

      const service = identifyService(step);

      // Only track services that we can identify
      if (service.serviceName) {
        // Create a unique key that handles null properly
        const key = `${service.serviceName}::${service.hostIdentifier}`;

        if (!serviceMap.has(key)) {
          serviceMap.set(key, {
            serviceName: service.serviceName,
            hostIdentifier: service.hostIdentifier,
          });
        }
      }
    }

    const serviceConditions = Array.from(serviceMap.values()).map(
      (service) => ({
        serviceName: service.serviceName,
        hostIdentifier: service.hostIdentifier,
      })
    );

    const guides = await db.nodeDocumentation.findMany({
      where: {
        OR: serviceConditions,
      },
    });

    // Build the guides map
    const guidesMap: Record<
      string,
      {
        serviceName: string;
        hostIdentifier: string | null;
        title: string | null;
        description: string | null;
        credentialGuide: string | null;
        credentialVideo: string | null;
        credentialsLinks: unknown;
        setupInstructions: string | null;
        helpLinks: unknown;
        nodeImage: string | null;
        videoLinks: unknown;
        troubleshooting: string | null;
      }
    > = {};

    for (const guide of guides) {
      const guideKey = guide.hostIdentifier
        ? `${guide.serviceName}|${guide.hostIdentifier}`
        : guide.serviceName;

      guidesMap[guideKey] = {
        serviceName: guide.serviceName,
        hostIdentifier: guide.hostIdentifier,
        title: typeof guide.title === "string" ? guide.title : null,
        description:
          typeof guide.description === "string" ? guide.description : null,
        credentialGuide:
          typeof guide.credentialGuide === "string"
            ? guide.credentialGuide
            : null,
        credentialVideo:
          typeof guide.credentialVideo === "string"
            ? guide.credentialVideo
            : null,
        credentialsLinks: guide.credentialsLinks,
        setupInstructions:
          typeof guide.setupInstructions === "string"
            ? guide.setupInstructions
            : null,
        helpLinks: guide.helpLinks,
        nodeImage: typeof guide.nodeImage === "string" ? guide.nodeImage : null,
        videoLinks: guide.videoLinks,
        troubleshooting:
          typeof guide.troubleshooting === "string"
            ? guide.troubleshooting
            : null,
      };
    }

    return guidesMap;
  } catch (error) {
    console.log(error);
    return {};
  }
};

export const fetchNodeUsageStats = async () => {
  try {
    const stats = await db.nodeUsageStats.findMany({
      orderBy: [{ usageCount: "desc" }, { lastUsedAt: "desc" }],
      include: {
        nodeDocumentation: true,
      },
    });

    // Transform the data to match what your component expects
    const transformedStats = stats.map((stat) => ({
      id: stat.id,
      serviceName: stat.serviceName,
      nodeType: stat.nodeType,
      hostIdentifier: stat.hostIdentifier,
      usageCount: stat.usageCount,
      lastUsedAt: stat.lastUsedAt,
      needsGuide: stat.needsGuide,
      nodeSetupGuide: stat.nodeDocumentation
        ? {
            id: stat.nodeDocumentation.id,
            title: stat.nodeDocumentation.title,
            description: stat.nodeDocumentation.description,
            // Credential fields
            credentialGuide: stat.nodeDocumentation.credentialGuide,
            credentialVideo: stat.nodeDocumentation.credentialVideo,
            credentialsLinks: stat.nodeDocumentation.credentialsLinks,
            // General fields
            setupInstructions: stat.nodeDocumentation.setupInstructions,
            helpLinks: stat.nodeDocumentation.helpLinks,
            videoLinks: stat.nodeDocumentation.videoLinks,
            troubleshooting: stat.nodeDocumentation.troubleshooting,
          }
        : null,
    }));

    return transformedStats;
  } catch (error) {
    console.error("Error fetching node usage stats:", error);
    return [];
  }
};

// Create a new setup guide
export const createNodeSetupGuideAction = async (
  prevState: Record<string, unknown>,
  formData: FormData
): Promise<{ message: string; success: boolean }> => {
  try {
    const isAdmin = await isAdminUser();
    if (!isAdmin) {
      throw new Error("Access denied. Admin privileges required.");
    }

    // Get form data
    const rawData = Object.fromEntries(formData);

    // Validate required fields
    const serviceName = rawData.serviceName as string;
    const hostIdentifier = rawData.hostIdentifier as string;
    const title = rawData.title as string;

    if (!serviceName || !title) {
      return {
        message: "Service name and title are required",
        success: false,
      };
    }

    // Handle node image (optional)
    let nodeImagePath: string | null = null;
    const nodeImage = formData.get("image") as File;
    if (nodeImage && nodeImage.size > 0) {
      try {
        const validatedNodeImage = validateWithZodSchema(imageSchema, {
          image: nodeImage,
        });
        nodeImagePath = await uploadImage(validatedNodeImage.image);
      } catch (error) {
        console.error("Error uploading node image:", error);
        return {
          message:
            "Invalid image file. Please ensure it's under 1MB and is a valid image format.",
          success: false,
        };
      }
    }

    // Parse optional JSON fields
    let helpLinks = null;
    if (rawData.helpLinks && typeof rawData.helpLinks === "string") {
      try {
        helpLinks = JSON.parse(rawData.helpLinks as string);
      } catch (error) {
        console.log(error);
        return {
          message: "Invalid JSON format for help links",
          success: false,
        };
      }
    }

    let videoLinks = null;
    if (rawData.videoLinks && typeof rawData.videoLinks === "string") {
      try {
        videoLinks = JSON.parse(rawData.videoLinks as string);
      } catch (error) {
        console.log(error);
        return {
          message: "Invalid JSON format for video links",
          success: false,
        };
      }
    }

    let troubleshooting = null;
    if (
      rawData.troubleshooting &&
      typeof rawData.troubleshooting === "string"
    ) {
      try {
        troubleshooting = JSON.parse(rawData.troubleshooting as string);
      } catch (error) {
        console.log(error);
        return {
          message: "Invalid JSON format for troubleshooting",
          success: false,
        };
      }
    }

    // Parse credentialsLinks JSON field
    let credentialsLinks = null;
    if (
      rawData.credentialsLinks &&
      typeof rawData.credentialsLinks === "string"
    ) {
      try {
        credentialsLinks = JSON.parse(rawData.credentialsLinks as string);
      } catch (error) {
        console.log(error);
        return {
          message: "Invalid JSON format for credentials links",
          success: false,
        };
      }
    }

    // Create the documentation guide
    const documentation = await db.nodeDocumentation.create({
      data: {
        serviceName,
        hostIdentifier: hostIdentifier || null,
        title,
        description: (rawData.description as string) || null,
        nodeImage: nodeImagePath, // Add the node image path
        // Credential fields
        credentialGuide: (rawData.credentialGuide as string) || null,
        credentialVideo: (rawData.credentialVideo as string) || null,
        credentialsLinks,
        // General fields
        setupInstructions: (rawData.setupInstructions as string) || null,
        helpLinks,
        videoLinks,
        troubleshooting,
      },
    });

    // Link existing usage stats to this guide
    await db.nodeUsageStats.updateMany({
      where: {
        serviceName,
        hostIdentifier: hostIdentifier || null,
        nodeDocumentationId: null,
      },
      data: {
        nodeDocumentationId: documentation.id,
        needsGuide: false,
      },
    });

    revalidatePath("/dashboard/node-guides");

    return {
      message: "Setup guide created successfully!",
      success: true,
    };
  } catch (error) {
    console.error("Error creating setup guide:", error);
    return {
      message:
        error instanceof Error ? error.message : "Failed to create setup guide",
      success: false,
    };
  }
};

export const updateNodeGuideImageAction = async (
  prevState: Record<string, unknown>,
  formData: FormData
): Promise<{
  message: string;
  success?: boolean;
  imageUrl?: string;
  stepId?: string;
}> => {
  try {
    const guideId = formData.get("stepId") as string; // Note: ImageInputContainer sends this as "stepId"
    const image = formData.get("image") as File;

    console.log("Guide ID:", guideId);
    console.log("Image file:", image?.name, image?.size);

    if (!guideId) {
      return { message: "Guide ID is required" };
    }

    if (!image || image.size === 0) {
      return { message: "Image file is required" };
    }

    const isAdmin = await isAdminUser();
    if (!isAdmin) {
      return { message: "Access denied. Admin privileges required." };
    }

    // Validate the image
    const validatedFields = validateWithZodSchema(imageSchema, { image });

    // Get the current guide to retrieve the old image URL
    const currentGuide = await db.nodeDocumentation.findUnique({
      where: { id: guideId },
      select: { nodeImage: true },
    });

    if (!currentGuide) {
      return { message: "Guide not found" };
    }

    console.log("Current guide found, uploading new image...");

    // Upload the new image
    const fullPath = await uploadImage(validatedFields.image);

    console.log("Image uploaded to:", fullPath);

    // Update the guide with the new image
    await db.nodeDocumentation.update({
      where: { id: guideId },
      data: { nodeImage: fullPath },
    });

    console.log("Database updated successfully");

    // Delete the old image from storage (if it exists and is a Supabase URL)
    if (
      currentGuide.nodeImage &&
      currentGuide.nodeImage.includes("supabase.co")
    ) {
      try {
        console.log("Deleting old image:", currentGuide.nodeImage);
        await deleteImage(currentGuide.nodeImage);
        console.log("Old image deleted successfully");
      } catch (deleteError) {
        console.error("Failed to delete old node image:", deleteError);
        // Don't fail the entire operation if image deletion fails
      }
    }

    // Revalidate the relevant pages

    // revalidatePath(`/admin/node-guides/${guideId}/edit`);

    console.log("Paths revalidated, returning success");

    return {
      message: "Node image updated successfully",
      success: true,
      imageUrl: fullPath,
      stepId: guideId,
    };
  } catch (error) {
    console.error("Error updating node guide image:", error);
    return {
      message:
        error instanceof Error ? error.message : "Failed to update node image",
    };
  }
};

// Update an existing setup guide

export const updateNodeSetupGuideAction = async (
  guideId: string,
  prevState: Record<string, unknown>,
  formData: FormData
): Promise<{ message: string; success: boolean }> => {
  try {
    const isAdmin = await isAdminUser();
    if (!isAdmin) {
      throw new Error("Access denied. Admin privileges required.");
    }

    // Get form data
    const rawData = Object.fromEntries(formData);

    // Validate required fields
    const title = rawData.title as string;

    if (!title) {
      return {
        message: "Title is required",
        success: false,
      };
    }

    // Handle node image update (optional)
    let nodeImagePath: string | null | undefined = undefined;
    const nodeImage = formData.get("image") as File;

    if (nodeImage && nodeImage.size > 0) {
      try {
        const validatedNodeImage = validateWithZodSchema(imageSchema, {
          image: nodeImage,
        });

        const currentGuide = await db.nodeDocumentation.findUnique({
          where: { id: guideId },
          select: { nodeImage: true },
        });

        if (!currentGuide) {
          return {
            message: "Guide not found",
            success: false,
          };
        }

        nodeImagePath = await uploadImage(validatedNodeImage.image);

        if (
          currentGuide.nodeImage &&
          currentGuide.nodeImage.includes("supabase.co")
        ) {
          try {
            await deleteImage(currentGuide.nodeImage);
          } catch (deleteError) {
            console.error("Failed to delete old node image:", deleteError);
          }
        }
      } catch (error) {
        console.error("Error uploading node image:", error);
        return {
          message:
            "Invalid image file. Please ensure it's under 1MB and is a valid image format.",
          success: false,
        };
      }
    }

    // Parse optional JSON fields with Prisma-compatible types
    let helpLinks: Prisma.InputJsonValue | undefined = undefined;
    if (rawData.helpLinks && typeof rawData.helpLinks === "string") {
      try {
        helpLinks = JSON.parse(rawData.helpLinks as string);
      } catch (error) {
        console.log(error);
        return {
          message: "Invalid JSON format for help links",
          success: false,
        };
      }
    }

    let videoLinks: Prisma.InputJsonValue | undefined = undefined;
    if (rawData.videoLinks && typeof rawData.videoLinks === "string") {
      try {
        videoLinks = JSON.parse(rawData.videoLinks as string);
      } catch (error) {
        console.log(error);
        return {
          message: "Invalid JSON format for video links",
          success: false,
        };
      }
    }

    let troubleshooting: Prisma.InputJsonValue | undefined = undefined;
    if (
      rawData.troubleshooting &&
      typeof rawData.troubleshooting === "string"
    ) {
      try {
        troubleshooting = JSON.parse(rawData.troubleshooting as string);
      } catch (error) {
        console.log(error);
        return {
          message: "Invalid JSON format for troubleshooting",
          success: false,
        };
      }
    }

    let credentialsLinks: Prisma.InputJsonValue | undefined = undefined;
    if (
      rawData.credentialsLinks &&
      typeof rawData.credentialsLinks === "string"
    ) {
      try {
        credentialsLinks = JSON.parse(rawData.credentialsLinks as string);
      } catch (error) {
        console.log(error);
        return {
          message: "Invalid JSON format for credentials links",
          success: false,
        };
      }
    }

    // Prepare update data
    const updateData: Prisma.NodeDocumentationUpdateInput = {
      title,
      description: (rawData.description as string) || null,
      credentialGuide: (rawData.credentialGuide as string) || null,
      credentialVideo: (rawData.credentialVideo as string) || null,
      setupInstructions: (rawData.setupInstructions as string) || null,
      ...(credentialsLinks !== undefined && { credentialsLinks }),
      ...(helpLinks !== undefined && { helpLinks }),
      ...(videoLinks !== undefined && { videoLinks }),
      ...(troubleshooting !== undefined && { troubleshooting }),
      ...(nodeImagePath !== undefined && { nodeImage: nodeImagePath }),
    };

    await db.nodeDocumentation.update({
      where: { id: guideId },
      data: updateData,
    });

    revalidatePath("/dashboard/node-guides");
    revalidatePath(`/dashboard/node-guides/${guideId}`);

    return {
      message: "Setup guide updated successfully!",
      success: true,
    };
  } catch (error) {
    console.error("Error updating setup guide:", error);
    return {
      message:
        error instanceof Error ? error.message : "Failed to update setup guide",
      success: false,
    };
  }
};

// Delete a setup guide
export const deleteNodeSetupGuideAction = async (
  guideId: string
): Promise<{ message: string; success: boolean }> => {
  try {
    const isAdmin = await isAdminUser();
    if (!isAdmin) {
      throw new Error("Access denied. Admin privileges required.");
    }

    // Update associated usage stats to indicate they need guides again
    await db.nodeUsageStats.updateMany({
      where: {
        nodeDocumentationId: guideId,
      },
      data: {
        nodeDocumentationId: null,
        needsGuide: true,
      },
    });

    // Delete the guide (will throw if not found)
    await db.nodeDocumentation.delete({
      where: { id: guideId },
    });

    revalidatePath("/dashboard/node-guides");

    return {
      message: "Setup guide deleted successfully!",
      success: true,
    };
  } catch (error) {
    console.error("Error deleting setup guide:", error);
    return {
      message:
        error instanceof Error ? error.message : "Failed to delete setup guide",
      success: false,
    };
  }
};

// Get a specific setup guide
// export const getNodeSetupGuide = async (guideId: string) => {
//   try {
//     const documentation = await db.nodeDocumentation.findUnique({
//       where: { id: guideId },
//       include: {
//         usageStats: true,
//       },
//     });

//     if (!documentation) {
//       return null;
//     }

//     // Transform to match expected format
//     return {
//       id: documentation.id,
//       serviceName: documentation.serviceName,
//       hostIdentifier: documentation.hostIdentifier,
//       title: documentation.title,
//       description: documentation.description,
//       // Credential fields
//       credentialGuide: documentation.credentialGuide,
//       credentialVideo: documentation.credentialVideo,
//       credentialsLinks: documentation.credentialsLinks,
//       // General fields
//       setupInstructions: documentation.setupInstructions,
//       helpLinks: documentation.helpLinks,
//       videoLinks: documentation.videoLinks,
//       troubleshooting: documentation.troubleshooting,
//       usageStats: documentation.usageStats,
//       nodeImage: documentation.nodeImage,
//     };
//   } catch (error) {
//     console.error("Error fetching setup guide:", error);
//     return null;
//   }
// };

export const getNodeSetupGuide = async (guideId: string) => {
  try {
    const documentation = await db.nodeDocumentation.findUnique({
      where: { id: guideId },
      include: {
        usageStats: true, // ✅ This is included
      },
    });

    return documentation; // Return the raw Prisma object
  } catch (error) {
    console.error("Error fetching setup guide:", error);
    return null;
  }
};

// =======================================================================================>
// =======================================================================================>
// =======================================================================================>
// =======================================================================================>
// =======================================================================================>

// Enhanced createWorkflowAction in utils/actions.ts

// Enhanced createWorkflowAction in utils/actions.ts

export const createWorkflowAction = async (
  prevState: Record<string, unknown>,
  formData: FormData
): Promise<{ message: string }> => {
  const user = await getAuthUser();
  const rawData = Object.fromEntries(formData);
  const workflowCreatedAt = getDateTime();
  const workflowImageFile = formData.get("image") as File;
  const creationImageFile = formData.get("creationImage") as File;

  try {
    // ... existing validation code ...
    const validatedFields = validateWithZodSchema(workflowSchema, {
      title: rawData.title,
      content: rawData.content,
      category: rawData.category,
      videoUrl: rawData.videoUrl || "",
    });

    // ... existing image upload code ...
    const validatedWorkflowImage = validateWithZodSchema(imageSchema, {
      image: workflowImageFile,
    });
    const workflowImagePath = await uploadImage(validatedWorkflowImage.image);

    // Handle creation image (optional)
    let creationImagePath: string | null = null;
    if (creationImageFile && creationImageFile.size > 0) {
      try {
        const validatedCreationImage = validateWithZodSchema(imageSchema, {
          image: creationImageFile,
        });
        creationImagePath = await uploadImage(validatedCreationImage.image);
      } catch (error) {
        console.error("Error uploading creation image:", error);
        // Don't fail the entire workflow creation if creation image upload fails
      }
    }

    // Create slug
    const slugContent = `${validatedFields.title} author ${user.firstName} ${user.lastName} date ${workflowCreatedAt}`;
    const slugString = slug(slugContent, { lower: true });

    // Process workflow JSON
    let workFlowJson = {};
    try {
      const workFlowJsonString = rawData.workFlowJson as string;
      if (workFlowJsonString?.trim() && workFlowJsonString !== "{}") {
        workFlowJson = JSON.parse(workFlowJsonString);
      }
    } catch (error) {
      console.error("Error parsing workflow JSON:", error);
    }

    // Create the workflow data
    const workflowData = {
      title: validatedFields.title,
      content: validatedFields.content,
      slug: slugString,
      viewCount: 0,
      workflowImage: workflowImagePath,
      creationImage: creationImagePath || null,
      category: validatedFields.category,
      authorId: user.id,
      workFlowJson,
      videoUrl: rawData.videoUrl ? rawData.videoUrl.toString() : null,
    };

    // CREATE WORKFLOW
    const createdWorkflow = await db.workflow.create({
      data: workflowData,
    });

    // ======= NEW: GENERATE TEACHING CONTENT =======

    // 1. Extract workflow steps from JSON
    try {
      await extractAndSaveWorkflowSteps(createdWorkflow.id, workFlowJson);
    } catch (error) {
      console.error("Error extracting workflow steps:", error);
    }

    // 2. Generate teaching content for each step
    try {
      await generateStepsTeachingContent(createdWorkflow.id);
    } catch (error) {
      console.error("Error generating steps teaching content:", error);
    }

    // 3. Generate workflow teaching guide
    try {
      await generateWorkflowTeachingGuide(
        createdWorkflow.id,
        workFlowJson,
        validatedFields.title
      );
    } catch (error) {
      console.error("Error generating workflow teaching guide:", error);
    }

    // Revalidate the dashboard to show the new workflow
  } catch (error) {
    console.error("Error creating workflow:", error);
    return {
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }

  // revalidatePath("/dashboard/wf");
  redirect("/dashboard/wf");
};

async function generateWorkflowTeachingGuide(
  workflowId: string,
  workflowJson: any,
  originalTitle: string
) {
  try {
    // Fetch the generated step teaching content
    const workflowSteps = await db.workflowStep.findMany({
      where: { workflowId },
      select: {
        stepNumber: true,
        stepTitle: true,
        nodeType: true,
        parameters: true,
        teachingSummary: true,
        teachingExplanation: true,
        teachingKeyPoints: true,
      },
      orderBy: { stepNumber: "asc" },
    });

    // Extract API services before sending to LLM


    const teachingContent = await generateTeachingGuideWithLLM(
      workflowJson,
      originalTitle,
      workflowSteps,

    );

    await db.workflowTeachingGuide.create({
      data: {
        workflowId,
        title: teachingContent.title,
        description: teachingContent.description,
        projectIntro: teachingContent.projectIntro,
        idealFor: teachingContent.idealFor,
        timeToValue: teachingContent.timeToValue,
        howItWorks: teachingContent.howItWorks,
        realCostOfNotHaving: teachingContent.realCostOfNotHaving,
        whatYoullBuild: teachingContent.whatYoullBuild,
        possibleMonetization: teachingContent.possibleMonetization,
        toolsUsed: teachingContent.toolsUsed,
        requiredApiServices: teachingContent.requiredApiServices,
      },
    });

    console.log(`✅ Teaching guide generated for workflow ${workflowId}`);
  } catch (error) {
    console.error("❌ Failed to generate workflow teaching guide:", error);
    throw error;
  }
}


async function generateTeachingGuideWithLLM(
  workflowJson: any,
  originalTitle: string,
  workflowSteps: any[] = []
) {
  // Validation: Handle empty or undefined steps
  if (!workflowSteps || workflowSteps.length === 0) {
    console.warn(
      "generateTeachingGuideWithLLM received empty or no steps. Using fallback."
    );

    const fallbackTools = detectWorkflowTools(workflowSteps);

    return {
      title: `💰 Get Results Fast - Master ${originalTitle}`,
      description:
        "Build powerful automation that saves time and increases efficiency for any business.",
      projectIntro:
        "Most businesses waste countless hours on repetitive tasks that could be automated. This workflow shows you how to reclaim that time and focus on what truly matters. Whether you're a small business owner looking to streamline operations or an entrepreneur ready to scale efficiently, this automation transforms daily chaos into systematic success.",
      idealFor:
        "🎯 Small Business Owners 🎯 Freelancers & Consultants 🎯 Operations Managers",
      timeToValue:
        "⚡ **2 hours** to build vs. **10+ hours** spent every week on manual, repetitive tasks that drain your energy and focus.",
      howItWorks:
        "✅ Automatically detects when tasks need to be processed ✅ Connects your existing tools without complex setup ✅ Runs in the background while you focus on growth ✅ Provides clear notifications when actions are completed",
      realCostOfNotHaving:
        "What you're really losing isn't just time - it's your competitive edge. Every hour spent on manual work is an hour not spent serving customers or growing your business. This inefficiency signals to competitors that you're stuck in operational quicksand while they're scaling systematically.",
      whatYoullBuild:
        "• A complete workflow that automates tasks and connects different services\n• Professional automation skills ready to be monetized\n• Experience with cutting-edge automation tools and APIs\n• A systematic approach to identifying automation opportunities",
      possibleMonetization:
        "🚀 BUSINESS OPPORTUNITY: Every small business around you is drowning in manual tasks and would pay handsomely to escape. Charge $497 to set up this exact automation for local businesses, or offer 'Done-For-You Automation' at $197/month per client. With just 25 business clients, you're earning $4,925/month solving real operational pain while they focus on growth.",
      toolsUsed:
        fallbackTools.length > 0
          ? fallbackTools
          : [
              "n8n - Powerful workflow automation platform that connects any service",
              "Webhooks - Instant triggers that start automations when events happen",
              "HTTP Requests - Universal connector for any web service or API",
            ],
      requiredApiServices: [], // Empty fallback
    };
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  // Extract raw API services from workflowJson
  const rawApiServices = extractRequiredApiServices(workflowJson);

  // Prepare step summaries for the LLM
  const stepSummaries = workflowSteps.map((step) => ({
    stepNumber: step.stepNumber,
    title: step.stepTitle,
    nodeType: step.nodeType,
    summary: step.teachingSummary,
    explanation: step.teachingExplanation,
    keyPoints: step.teachingKeyPoints,
    url: step.parameters?.url || null,
  }));

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",

      response_format: {
        type: "json_schema",
        json_schema: {
          name: "workflow_teaching_guide",
          schema: {
            ...teachingGuideSchema,
            properties: {
              ...teachingGuideSchema.properties,
              requiredApiServices: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    description: { type: "string" }
                  },
                  required: ["name", "description"]
                }
              }
            },
            required: [...teachingGuideSchema.required, "requiredApiServices"]
          }
        },
      },

      messages: [
        {
          role: "system",
          content:
            "You are Paul Graham teaching automation to business owners. Write with his distinctive style: start with the hidden pain, show what's really at stake, then reveal the solution. Focus on business transformation, not technical features. Make them feel the urgency of NOT having this automation. Your response MUST conform to the provided JSON schema and include ALL required fields.",
        },
        {
          role: "user",
          content: `Analyze this n8n workflow and create Paul Graham-style educational content.

WORKFLOW INFO:
- Title: ${originalTitle}
- Total Steps: ${stepSummaries.length}
- Required API Services: ${rawApiServices.join(", ")}

DETAILED STEP INFORMATION:
${stepSummaries
  .map(
    (step) => `
Step ${step.stepNumber}: ${step.title}
- Node Type: ${step.nodeType}
- Summary: ${step.summary || "No summary available"}
- URL (if HTTP): ${step.url || "N/A"}
- Key Points: ${
      Array.isArray(step.keyPoints) ? step.keyPoints.join(", ") : "N/A"
    }
`
  )
  .join("\n")}

PAUL GRAHAM STYLE REQUIREMENTS:
- title: Problem-focused, under 60 characters. "💰 Get Paid in Days, Not Weeks" style. Focus on business outcome + emotional impact.
- description: One crisp sentence about the business transformation, not the technology.
- projectIntro: Start with the pain. What are people REALLY losing by doing this manually? Make it feel costly and urgent.
- idealFor: Three specific audiences using "🎯 [Audience] 🎯 [Audience] 🎯 [Audience]" format.
- timeToValue: "⚡ **X time** to build vs. **Y time** wasted every week on [specific manual tasks]"
- howItWorks: 3-4 "✅ Automatically..." bullets showing what happens without human intervention.
- realCostOfNotHaving: Pure Paul Graham. What's the REAL cost? Opportunity cost, competitive disadvantage, reputation damage.
- whatYoullBuild: Technical outcomes with **bold tool names**, 4-6 bullets using •
- possibleMonetization: Focus on selling TO businesses who need this. Specific pricing for setup + monthly service. Calculate realistic revenue.
- toolsUsed: Array of "Tool Name - What it does for the business outcome" (not technical specs)
- requiredApiServices: For each service in [${rawApiServices.join(", ")}], provide:
  [{"name": "openai", "description": "AI text generation"}, {"name": "elevenlabs", "description": "voice synthesis"}]
  Keep descriptions to 2-4 words explaining what the service does.

Make every section feel urgent and valuable. They should think "I'm hemorrhaging money without this" not "that's a nice feature."`,
        },
      ],
      temperature: 0.8,
      max_tokens: 2000,
    });

    const responseText = completion.choices[0]?.message?.content;

    if (!responseText) {
      throw new Error("No response from OpenAI");
    }

    const teachingContent = JSON.parse(responseText);

    // Validate that all required fields exist (fail fast if LLM didn't follow schema)
    const requiredFields = [
      "title",
      "description",
      "projectIntro",
      "idealFor",
      "timeToValue",
      "howItWorks",
      "realCostOfNotHaving",
      "whatYoullBuild",
      "possibleMonetization",
      "toolsUsed",
      "requiredApiServices",
    ];

    for (const field of requiredFields) {
      if (!teachingContent[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    return teachingContent;
  } catch (error) {
    console.error("Error generating teaching guide with OpenAI:", error);

    // Enhanced fallback with ALL required fields including empty API services
    const fallbackTools = detectWorkflowTools(workflowSteps);

    return {
      title: `💰 Stop Wasting Time - Automate ${originalTitle}`,
      description: `Transform manual ${originalTitle.toLowerCase()} into a hands-free automation that works while you sleep.`,
      projectIntro: `Every minute spent on manual ${originalTitle.toLowerCase()} is a minute stolen from growing your business. While you're buried in repetitive tasks, competitors are scaling systematically with automation. This workflow shows you how to reclaim those lost hours and transform operational chaos into predictable results.`,
      idealFor:
        "🎯 Business Owners 🎯 Freelancers & Consultants 🎯 Operations Teams",
      timeToValue:
        "⚡ **2 hours** to build vs. **8+ hours** wasted every week on manual processes that drain your focus and energy.",
      howItWorks:
        "✅ Automatically triggers when specific events occur ✅ Processes tasks without human intervention ✅ Connects your existing tools seamlessly ✅ Provides notifications when work is completed",
      realCostOfNotHaving:
        "What you're really losing isn't just time - it's your competitive advantage. Every hour spent on manual work is an hour not spent on strategy, customer acquisition, or innovation. This operational inefficiency signals to the market that you're stuck in the weeds while smarter competitors are scaling systematically.",
      whatYoullBuild:
        "• A complete workflow that automates repetitive tasks automatically\n• Professional automation skills that create immediate business value\n• Experience with enterprise-grade automation tools\n• A systematic approach to identifying automation opportunities\n• Hands-free processes that work 24/7 without supervision",
      possibleMonetization:
        "🚀 BUSINESS OPPORTUNITY: Every business in your area is bleeding money on manual processes and would pay premium rates to escape this operational quicksand. Charge $397 to implement this automation for local companies, or offer 'Done-For-You Process Automation' at $147/month per client. With just 30 business clients, you're generating $4,410/month in recurring revenue helping them reclaim their time and sanity.",
      toolsUsed:
        fallbackTools.length > 0
          ? fallbackTools
          : [
              "n8n - Enterprise automation platform that connects any business system",
              "Webhooks - Instant triggers that start workflows when events happen",
              "HTTP Requests - Universal connector for any web service or database",
              "Data Processing - Smart logic that handles complex business rules automatically",
            ],
      requiredApiServices: [], // Empty fallback - let LLM handle it
    };
  }
}


async function generateStepsTeachingContent(workflowId: string) {
  try {
    const workflowSteps = await db.workflowStep.findMany({
      where: { workflowId },
      orderBy: { stepNumber: "asc" },
    });

    let cumulativeContext = "";

    for (const step of workflowSteps) {
      try {
        const teachingContent = await generateStepTeachingContentWithLLM(
          step,
          cumulativeContext
        );

        await db.workflowStep.update({
          where: { id: step.id },
          data: {
            teachingSummary: teachingContent.summary, // NEW: Add teaching summary
            teachingExplanation: teachingContent.explanation,
            teachingTips: teachingContent.tips,
            teachingKeyPoints: teachingContent.keyPoints,
          },
        });

        cumulativeContext = teachingContent.summaryForNext || "";

        console.log(
          `✅ Teaching content generated for step ${step.stepNumber}: ${step.stepTitle}`
        );
      } catch (stepError) {
        console.error(
          `❌ Failed to generate teaching content for step ${step.id}:`,
          stepError
        );
      }
    }

    console.log(
      `✅ Teaching content generated for ${workflowSteps.length} steps with progressive context`
    );
  } catch (error) {
    console.error("❌ Failed to generate steps teaching content:", error);
    throw error;
  }
}

async function generateStepTeachingContentWithLLM(
  step: any,
  previousContext: string = ""
) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",

      response_format: {
        type: "json_schema",
        json_schema: {
          name: "step_teaching_content",
          schema: stepTeachingSchema,
        },
      },

      messages: [
        {
          role: "system",
          content:
            "You are a practical automation mentor. Create direct, actionable teaching content that explains exactly what each step does, why it's needed, and how it fits into a bigger system. Use the WHAT -> WHY -> BIG PICTURE structure for explanations. Be concrete and jargon-free. Your response MUST conform to the provided JSON schema.",
        },
        {
          role: "user",
          content: `Create practical mentor-style educational content for this automation step.

CURRENT STEP:
- Step ${step.stepNumber}: ${step.stepTitle}
- Node Type: ${step.nodeType}
- Step Description: ${step.stepDescription || "No description"}
- Parameters: ${JSON.stringify(step.parameters).substring(0, 400)}

PREVIOUS WORKFLOW CONTEXT:
${previousContext || "This is the foundation of your automation system"}

PRACTICAL MENTOR STYLE REQUIREMENTS:
- summary: Direct 3-5 word action description. "Verb + Noun" format like a to-do item. "Upload photo to Google Drive" not "Creates file storage system"
- explanation: MUST follow this exact 3-sentence structure:
  1) WHAT: "This step [does exactly what technically]..."
  2) WHY: "We do this to/so that [immediate workflow reason]..."  
  3) BIG PICTURE: "This creates/demonstrates [systems principle], which is [why it matters for automation]..."
- tips: 3 practical, actionable tips that prevent real problems
- keyPoints: 2 concrete learning concepts
- summaryForNext: How this step's output enables the next capability

Be direct and practical. Students should understand exactly what's happening and why.`,
        },
      ],
      temperature: 0.75,
      max_tokens: 1200,
    });

    const responseText = completion.choices[0]?.message?.content;

    if (!responseText) {
      throw new Error("No response from OpenAI");
    }

    const teachingContent = JSON.parse(responseText);
    return teachingContent;
  } catch (error) {
    console.error(
      "❌ LLM Failed for step",
      step.stepNumber,
      ":",
      error.message
    );

    // Return empty strings so you can easily identify failed LLM generations
    return {
      summary: "",
      explanation: "",
      tips: ["", "", ""],
      keyPoints: ["", ""],
      summaryForNext: "",
    };
  }
}
// =======================================================================================>
// =======================================================================================>
// =======================================================================================>
// =======================================================================================>
// workflow guides

// Fetch Teaching guides ,

export const fetchWorkflowTeachingGuide = async (workflowId: string) => {
  try {
    // First verify the user has access to this workflow
    const workflow = await db.workflow.findUnique({
      where: { id: workflowId },
      select: {
        id: true,
        authorId: true,
        title: true,
        slug: true,
      },
    });

    if (!workflow) {
      throw new Error("Workflow not found");
    }

    // Check if user is creator or admin
    const canAccess = await isCreatorOrAdmin(workflow.id);
    if (!canAccess) {
      throw new Error("You don't have permission to access this workflow");
    }

    // Fetch the WorkflowTeachingGuide with ALL Paul Graham fields
    const teachingGuide = await db.workflowTeachingGuide.findUnique({
      where: { workflowId },
      select: {
        id: true,
        title: true,
        description: true,
        projectIntro: true,
        idealFor: true,
        timeToValue: true,
        howItWorks: true,
        realCostOfNotHaving: true,
        whatYoullBuild: true,
        possibleMonetization: true,
        toolsUsed: true, // NEW: Updated to String[]
        createdAt: true,
        updatedAt: true,
      },
    });

    // Fetch WorkflowSteps with only the teaching fields (in order)
    const workflowSteps = await db.workflowStep.findMany({
      where: { workflowId },
      select: {
        id: true,
        stepNumber: true,
        stepTitle: true,
        teachingSummary: true,
        teachingExplanation: true,
        teachingTips: true,
        teachingKeyPoints: true,
      },
      orderBy: { stepNumber: "asc" },
    });

    return {
      success: true,
      data: {
        workflow: {
          id: workflow.id,
          title: workflow.title,
          slug: workflow.slug,
        },
        teachingGuide,
        workflowSteps,
      },
    };
  } catch (error) {
    console.error("Error fetching workflow teaching guide:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch teaching guide",
    };
  }
};

// Alternative version if you want to fetch by slug instead of ID
export const fetchWorkflowTeachingGuideBySlug = async (slug: string) => {
  try {
    const user = await getAuthUser();

    // Find workflow by slug first
    const workflow = await db.workflow.findUnique({
      where: { slug },
      select: {
        id: true,
        authorId: true,
        title: true,
        slug: true,
      },
    });

    if (!workflow) {
      throw new Error("Workflow not found");
    }

    // Check if user is creator or admin
    const canAccess = await isCreatorOrAdmin(workflow.id);
    if (!canAccess) {
      throw new Error("You don't have permission to access this workflow");
    }

    // Fetch the WorkflowTeachingGuide with ALL Paul Graham fields
    const teachingGuide = await db.workflowTeachingGuide.findUnique({
      where: { workflowId: workflow.id },
      select: {
        id: true,
        title: true,
        description: true, // NEW: Paul Graham field
        projectIntro: true,
        idealFor: true, // NEW: Paul Graham field
        timeToValue: true, // NEW: Paul Graham field
        howItWorks: true, // NEW: Paul Graham field
        realCostOfNotHaving: true, // NEW: Paul Graham field
        whatYoullBuild: true,
        possibleMonetization: true,
        toolsUsed: true, // NEW: Updated to String[]
        createdAt: true,
        updatedAt: true,
      },
    });

    // Fetch WorkflowSteps with only the teaching fields (in order)
    const workflowSteps = await db.workflowStep.findMany({
      where: { workflowId: workflow.id },
      select: {
        id: true,
        stepNumber: true,
        stepTitle: true,
        teachingSummary: true,
        teachingExplanation: true,
        teachingTips: true,
        teachingKeyPoints: true,
      },
      orderBy: { stepNumber: "asc" },
    });

    return {
      success: true,
      data: {
        workflow: {
          id: workflow.id,
          title: workflow.title,
          slug: workflow.slug,
        },
        teachingGuide,
        workflowSteps,
      },
    };
  } catch (error) {
    console.error("Error fetching workflow teaching guide by slug:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch teaching guide",
    };
  }
};

// Public version (no auth check) for viewing published workflows
export const fetchPublicWorkflowTeachingGuide = async (slug: string) => {
  try {
    // Find workflow by slug
    const workflow = await db.workflow.findUnique({
      where: { slug },
      select: {
        id: true,
        title: true,
        slug: true,
      },
    });

    if (!workflow) {
      throw new Error("Workflow not found");
    }

    // Fetch the WorkflowTeachingGuide with ALL Paul Graham fields
    const teachingGuide = await db.workflowTeachingGuide.findUnique({
      where: { workflowId: workflow.id },
      select: {
        id: true,
        title: true,
        description: true, // NEW: Paul Graham field
        projectIntro: true,
        idealFor: true, // NEW: Paul Graham field
        timeToValue: true, // NEW: Paul Graham field
        howItWorks: true, // NEW: Paul Graham field
        realCostOfNotHaving: true, // NEW: Paul Graham field
        whatYoullBuild: true,
        possibleMonetization: true,
        toolsUsed: true, // NEW: Updated to String[]
        createdAt: true,
        updatedAt: true,
      },
    });

    // Fetch WorkflowSteps with only the teaching fields (in order)
    const workflowSteps = await db.workflowStep.findMany({
      where: { workflowId: workflow.id },
      select: {
        id: true,
        stepNumber: true,
        stepTitle: true,
        teachingSummary: true,
        teachingExplanation: true,
        teachingTips: true,
        teachingKeyPoints: true,
      },
      orderBy: { stepNumber: "asc" },
    });

    return {
      success: true,
      data: {
        workflow: {
          id: workflow.id,
          title: workflow.title,
          slug: workflow.slug,
        },
        teachingGuide,
        workflowSteps,
      },
    };
  } catch (error) {
    console.error("Error fetching public workflow teaching guide:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch teaching guide",
    };
  }
};
