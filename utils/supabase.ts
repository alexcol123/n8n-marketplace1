

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


export const deleteImage = async (imageUrl: string) => {
  console.log('deleteImage called with URL:', imageUrl);
  try {
    // Extract the filename from the URL (since your upload doesn't use folders)
    const url = new URL(imageUrl);
    const pathSegments = url.pathname.split('/');
    const fileName = pathSegments[pathSegments.length - 1];
    
    console.log('Extracted filename:', fileName);
    console.log('Bucket name:', bucket);

    // First, let's list all files in the bucket to see the structure
    const { data: listData, error: listError } = await supabase.storage
      .from(bucket)
      .list('', {
        limit: 1000,
        offset: 0
      });

    if (listError) {
      console.error('Error listing bucket contents:', listError);
    } else {
      console.log('All files in bucket:', listData?.map(file => file.name));
      
      // Check if our file exists
      const fileExists = listData?.some(file => file.name === fileName);
      console.log(`File "${fileName}" exists in bucket:`, fileExists);
      
      // Also check for partial matches (in case the filename is slightly different)
      const similarFiles = listData?.filter(file => 
        file.name.includes(fileName.split('-')[0]) || // timestamp part
        file.name.includes(fileName.split('-').slice(1).join('-')) // filename part
      );
      console.log('Similar files found:', similarFiles?.map(f => f.name));
    }

    // Attempt to delete the file using just the filename
    console.log('Attempting to delete file:', fileName);
    const { data, error } = await supabase.storage
      .from(bucket)
      .remove([fileName]);

    console.log('Delete response - data:', data);
    console.log('Delete response - error:', error);

    if (error) {
      throw new Error(`Failed to delete image: ${error.message}`);
    }

    // Check if any files were actually deleted
    if (!data || data.length === 0) {
      throw new Error(`File not found in bucket: ${fileName}. Check the console logs for available files.`);
    }

    console.log('Image deleted successfully:', data);

    return {
      success: true,
      message: "Image deleted successfully",
      data
    };
  } catch (error) {
    console.error("Error deleting image:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error occurred",
      data: null
    };
  }
};

// Alternative function that tries to delete with different path variations
export const deleteImageWithFallbacks = async (imageUrl: string) => {
  console.log('deleteImageWithFallbacks called with URL:', imageUrl);
  
  const url = new URL(imageUrl);
  const pathSegments = url.pathname.split('/');
  const fileName = pathSegments[pathSegments.length - 1];
  
  // Try different path variations
  const pathsToTry = [
    fileName,                           // Direct filename: "1750267234634-filename.jpg"
    `public/${fileName}`,              // In public folder
    `uploads/${fileName}`,             // In uploads folder
    `images/${fileName}`,              // In images folder
    url.pathname.split('/storage/v1/object/public/')[1]?.split('/').slice(1).join('/') // Full path without bucket
  ].filter(Boolean);

  console.log('Paths to try:', pathsToTry);

  for (const path of pathsToTry) {
    try {
      console.log(`Trying to delete with path: "${path}"`);
      
      const { data, error } = await supabase.storage
        .from(bucket)
        .remove([path]);

      console.log(`Attempt with path "${path}" - data:`, data, 'error:', error);

      if (!error && data && data.length > 0) {
        console.log(`Successfully deleted with path: "${path}"`);
        return {
          success: true,
          message: `Image deleted successfully using path: ${path}`,
          data
        };
      }
    } catch (error) {
      console.log(`Failed to delete with path "${path}":`, error);
      continue;
    }
  }

  return {
    success: false,
    message: `File not found. Tried paths: ${pathsToTry.join(', ')}`,
    data: null
  };
};

// Function to check your bucket structure
export const debugBucketStructure = async () => {
  try {
    console.log('=== DEBUGGING BUCKET STRUCTURE ===');
    console.log('Bucket name:', bucket);
    
    // List all files in root
    const { data: rootFiles, error: rootError } = await supabase.storage
      .from(bucket)
      .list('', { limit: 50 });
    
    if (rootError) {
      console.error('Error listing root files:', rootError);
    } else {
      console.log('Files in root:', rootFiles?.map(file => ({
        name: file.name,
        size: file.metadata?.size,
        contentType: file.metadata?.mimetype
      })));
    }

    // Check common folder structures
    const foldersToCheck = ['public', 'uploads', 'images', 'files'];
    
    for (const folder of foldersToCheck) {
      const { data: folderFiles, error: folderError } = await supabase.storage
        .from(bucket)
        .list(folder, { limit: 10 });
      
      if (!folderError && folderFiles && folderFiles.length > 0) {
        console.log(`Files in ${folder}/:`, folderFiles.map(f => f.name));
      }
    }
    
    console.log('=== END BUCKET DEBUG ===');
  } catch (error) {
    console.error('Error debugging bucket structure:', error);
  }
};