'use client';

import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Upload, ImageIcon } from "lucide-react";

function ImageInput() {
  const name = "image";
  const required = true;
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State to hold the selected file data
  const [currentImage, setCurrentImage] = useState<File | null>(null);
  // State to hold the URL for the preview image
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    // Clean up the previous preview URL if it exists
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    // Process the selected image
    if (currentImage !== null) {
      // Check if image size exceeds 1MB
      if (currentImage.size > 1 * 1024 * 1024) {
        toast.error("Image size exceeds 1MB");

        // Reset the state in the component
        setCurrentImage(null);
        // Clear the value in the DOM input element
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        // Create preview URL
        const imageUrl = URL.createObjectURL(currentImage);
        setPreviewUrl(imageUrl);
      }
    } else {
      // If currentImage becomes null, ensure the preview URL is also cleared
      setPreviewUrl(null);
    }

    // Cleanup function for the effect
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentImage]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setCurrentImage(file);
    } else {
      if (currentImage) {
        setCurrentImage(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    }
  };

  return (
    <div className="mb-4 space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={name} className="text-sm font-medium mb-4 flex items-center gap-2">
          <div className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-primary" />
            <span className="capitalize">Image Upload</span>
            {required && <span className="text-destructive ml-1">*</span>}
          </div>
        </Label>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-grow max-w-md w-full">
          <div className="absolute left-2 top-0 bottom-0 flex items-center text-muted-foreground">
            <Upload className="h-4 w-4" />
          </div>
          <Input
            id={name}
            name={name}
            type="file"
            required
            accept="image/*"
            className="pl-8 file:mr-3 file:py-1.5 file:px-3 
                      file:rounded-md file:border-0 
                      file:text-sm file:font-medium 
                      file:bg-primary file:text-primary-foreground
                      hover:file:bg-primary/90
                      flex items-center h-10 cursor-pointer"
            onChange={handleImageChange}
            ref={fileInputRef}
          />
        </div>

        {/* Image preview container */}
        {previewUrl ? (
          <div className="border flex-shrink-0 flex items-center justify-center bg-muted/20 border-primary/30 rounded-md p-1 h-24 w-24 overflow-hidden">
            <Image
              src={previewUrl}
              alt="Preview"
              className="object-cover rounded-md w-full h-full"
              width={96}
              height={96}
            />
          </div>
        ) : (
          <div className="border flex-shrink-0 flex items-center justify-center bg-muted/20 border-primary/30 rounded-md p-4 h-24 w-24">
            <ImageIcon className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
      </div>

      {currentImage && (
        <div className="mt-2 text-xs text-muted-foreground">
          <span className="font-medium">Selected:</span> {currentImage.name} (
          <span className={currentImage.size > 900000 ? "text-amber-500 font-medium" : ""}>
            {(currentImage.size / (1024 * 1024)).toFixed(2)} MB
          </span>)
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Upload an image for your workflow (must be under 1MB in size).
        Supported formats: JPG, PNG, GIF, SVG.
      </p>
    </div>
  );
}

export default ImageInput;