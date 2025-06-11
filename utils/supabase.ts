// import { createClient } from '@supabase/supabase-js';

// const bucket = process.env.BUCKET_NAME as string

// const url = process.env.SUPABASE_URL as string;
// const key = process.env.SUPABASE_KEY as string;

// const supabase = createClient(url, key);

// export const uploadImage = async (image: File) => {
//   const timestamp = Date.now();
//   const newName = `${timestamp}-${image.name}`;
//   const { data } = await supabase.storage
//     .from(bucket)
//     .upload(newName, image, { cacheControl: '3600' });
//   if (!data) throw new Error('Image upload failed');
//   const imageUrl =supabase.storage.from(bucket).getPublicUrl(newName).data.publicUrl;
//   return imageUrl
// };

import { createClient } from "@supabase/supabase-js";

const bucket = process.env.BUCKET_NAME as string;
const url = process.env.SUPABASE_URL as string;
const key = process.env.SUPABASE_KEY as string;

const supabase = createClient(url, key);

export const uploadImage = async (image: File) => {
  const timestamp = Date.now();

  // Clean the filename: remove spaces, special chars, keep alphanumeric, dots, and hyphens
  const cleanFileName = image.name
    .replace(/[^a-zA-Z0-9.-]/g, "_") // Replace any problematic characters with underscores
    .replace(/_+/g, "_") // Replace multiple consecutive underscores with just one
    .toLowerCase(); // Convert to lowercase for consistency

  // Add timestamp to ensure uniqueness
  const newName = `${timestamp}-${cleanFileName}`;

  const { data } = await supabase.storage
    .from(bucket)
    .upload(newName, image, { cacheControl: "3600" });

  if (!data) throw new Error("Image upload failed");

  const imageUrl = supabase.storage.from(bucket).getPublicUrl(newName)
    .data.publicUrl;
  return imageUrl;
};
