import * as z from "zod";

import { CategoryType } from "@prisma/client";

export const profileSchema = z.object({
  // firstName: z.string().max(5, { message: 'max length is 5' }),
  firstName: z.string().min(2, {
    message: "first name must be at least 2 characters",
  }),
  lastName: z.string().min(2, {
    message: "last name must be at least 2 characters",
  }),
  username: z
    .string()
    .min(3, { message: "username must be at least 3 characters" })
    .max(20, { message: "username must be at most 20 characters" })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "username can only contain letters, numbers, and underscores",
    }),
  bio: z
    .string()
    .max(500, {
      message: "bio must be a maximun of 500 characters",
    })
    .optional(),
});

export function validateWithZodSchema<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): T {
  const result = schema.safeParse(data);

  if (!result.success) {
    // Get all error messages
    const errors = result.error.errors.map((error) => {
      // Include the path to identify which field failed
      const path = error.path.join(".");
      return `${path ? path + ": " : ""}${error.message}`;
    });

    // Join all error messages
    throw new Error(errors.join(", "));
  }
  return result.data;
}

export const imageSchema = z.object({
  image: validateFile(),
});

function validateFile() {
  const maxUploadSize = 1024 * 1024;
  const acceptedFilesTypes = ["image/"];
  return z
    .instanceof(File)
    .refine((file) => {
      return !file || file.size <= maxUploadSize;
    }, "File size must be less than 1 MB")
    .refine((file) => {
      return (
        !file || acceptedFilesTypes.some((type) => file.type.startsWith(type))
      );
    }, "File must be an image");
}

// =================================

// Define the CategoryType enum to match your schema
// export const CategoryTypeEnum = z.enum([
//   "technologya",
//   "lifestyle",
//   "business",
//   "travel",
// ]);

export const CategoryTypeEnum = z.nativeEnum(CategoryType, {
  errorMap: () => {
    return {
      message: `Category must be one of: ${Object.values(CategoryType).join(
        ", "
      )}`,
    };
  },
});

// Updated schema
export const workflowSchema = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .min(3, {
      message: "Title must be at least 3 characters.",
    })
    .max(100, {
      message: "Title must be less than 100 characters.",
    }),
  content: z.string({ required_error: "Content is required" }).min(100, {
    message: "Content must be at least 100 characters.",
  }),
  category: CategoryTypeEnum,
  steps: z.string().optional().default("[]"),

  videoUrl: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")), // Allow empty string
});
