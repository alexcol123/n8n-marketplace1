export type actionFunction = (
  prevState: Record<string, unknown>,
  formData: FormData
) => Promise<{ message: string }>;

export type WorkflowCardTypes = {
  id: string;
  title: string;
  content: string;
  workflowImage: string;
  creationImage: string | null; // Changed from undefined to null
  authorId: string;
  author: User;
  category: string;
  slug: string;
  videoUrl?: string | null;
  viewCount: number;
  createdAt: Date;
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
