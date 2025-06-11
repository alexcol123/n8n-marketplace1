export type actionFunction = (
  prevState: Record<string, unknown>,
  formData: FormData
) => Promise<{ message: string }>;

export type WorkflowCardTypes = {
  id: string;
  title: string;
  content: string;
  workflowImage: string;
  authorId: string;
  author: User;
  category: string;
  slug: string;
  viewCount: number
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