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
} from "./schemas";
import { revalidatePath } from "next/cache";
import { uploadImage } from "./supabase";

import slug from "slug";
import { CategoryType, IssueStatus, Priority } from "@prisma/client";
import { getDateTime } from "./functions/getDateTime";

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

    const fullPath = await uploadImage(validatedFields.image);

    await db.profile.update({
      where: {
        clerkId: user.id,
      },
      data: {
        profileImage: fullPath,
      },
    });
    revalidatePath("/profile");
    return { message: "Profile image updated successfully" };
  } catch (error) {
    return renderError(error);
  }
};

export const createWorkflowAction = async (
  prevState: Record<string, unknown>,
  formData: FormData
): Promise<{ message: string }> => {
  try {
    const user = await getAuthUser();

    // Get form data
    const rawData = Object.fromEntries(formData);
    const file = formData.get("image") as File;

    if (!file || file.size === 0) {
      return { message: "Image file is required" };
    }

    const workflowCreatedAt = getDateTime();

    // Validate the workflow data
    const validatedFields = validateWithZodSchema(workflowSchema, {
      title: rawData.title,
      content: rawData.content,
      category: rawData.category,
      steps: rawData.steps,
      // Include videoUrl in validation
      videoUrl: rawData.videoUrl || "",
    });

    // Validate and process the file
    const validatedFile = validateWithZodSchema(imageSchema, { image: file });
    const fullPath = await uploadImage(validatedFile.image);

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

    // Process steps
    let steps = [];
    try {
      const stepsString = validatedFields.steps;
      if (stepsString) {
        const parsedSteps = JSON.parse(stepsString);
        if (Array.isArray(parsedSteps)) {
          steps = parsedSteps.filter(
            (step) => typeof step === "string" && step.trim() !== ""
          );
        }
      }
    } catch (error) {
      console.error("Error parsing steps:", error);
    }

    // Extract videoUrl from the form data
    const videoUrl = rawData.videoUrl ? rawData.videoUrl.toString() : null;

    // Create the workflow data
    const workflowData = {
      title: validatedFields.title,
      content: validatedFields.content,
      slug: slugString,
      viewCount: 0,
      workflowImage: fullPath,
      category: validatedFields.category,
      authorId: user.id,
      workFlowJson,
      steps,
      videoUrl, // Add the videoUrl field to the database
    };

    await db.workflow.create({
      data: workflowData,
    });
  } catch (error) {
    console.error("Error creating workflow:", error);
    return {
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }

  redirect("/dashboard/wf");
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

export const fetchSingleWorkflow1 = async (slug: string) => {
  const singleWorkflow = await db.workflow.findUnique({
    where: {
      slug,
    },
    include: {
      author: true,
    },
  });

  return singleWorkflow;
};

export const fetchSingleWorkflow = async (slug: string) => {
  try {
    // Use the update operation. It increments viewCount AND returns the updated workflow.
    const workflow = await db.workflow.update({
      where: {
        slug,
      },
      data: {
        viewCount: {
          increment: 1, // Use the increment modifier
        },
      },
      include: {
        author: true, // Still include the author relation
      },
    });

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

    // Get the workflow title for the success message
    const workflow = await db.workflow.findUnique({
      where: { id: workflowId },
      select: {
        title: true,
      },
    });

    // Check if workflow exists (in case it was deleted between permission check and this query)
    if (!workflow) {
      return {
        message: "No workflow found with that id",
        success: false,
      };
    }

    // Delete the workflow from the database
    // This will cascade delete related records based on your schema relationships
    await db.workflow.delete({
      where: { id: workflowId },
    });

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

    // Get recent completions (last 7 days)
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
    const combineWithUserData = (completions: any[]) => {
      return completions
        .map((completion) => {
          const user = users.find((u) => u.clerkId === completion.userId);
          return {
            userId: completion.userId,
            completionCount: completion._count.userId,
            user: user || null,
          };
        })
        .filter((item) => item.user !== null); // Only include items with valid user data
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
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

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
  const user = await getAuthUser();

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
