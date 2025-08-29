export type actionFunction = (
  prevState: Record<string, unknown>,
  formData: FormData
) => Promise<{ message: string }>;

export type WorkflowCardTypes = {
  id: string;
  title: string;
  workflowImage: string;
  creationImage: string | null; // Changed from undefined to null
  authorId: string;
  author: User;
  slug: string;
  videoUrl?: string | null;
  viewCount: number;
  createdAt: Date;
  // Teaching guide summary for cards
  WorkflowTeachingGuide?: {
    whatYoullBuildSummary?: string | null;
  } | null;
};

export type User = {
  id: string;
  clerkId: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  profileImage: string;
  createdAt: Date;
  updatedAt: Date;
  workflows?: WorkflowCardTypes[] | null;
};

// Type for user data from your profile query
export type UserProfileData = {
  clerkId: string;
  firstName: string;
  lastName: string;
  username: string;
  profileImage: string;
};

// Type for the combined result
export type CompletionWithUserData = {
  userId: string;
  completionCount: number;
  user: UserProfileData;
};

export type CompletionCountData = {
  userId: string;
  _count: {
    userId: number;
  };
};




export type WorkflowStepLike = {
  id: string;
  name?: string; // Make optional since Prisma WorkflowStep doesn't have this
  type?: string; // Make optional since Prisma WorkflowStep doesn't have this
  nodeType?: string; // This is what Prisma WorkflowStep actually has
  parameters?: unknown; // Use unknown to match JsonValue
  credentials?: unknown;

  typeVersion?: number;
  position?: unknown; // Use unknown to match JsonValue
  [key: string]: unknown; // Allow additional properties
};
export type ServiceInfo = {
 serviceName: string;
 hostIdentifier: string | null;
 nodeType: string;
};