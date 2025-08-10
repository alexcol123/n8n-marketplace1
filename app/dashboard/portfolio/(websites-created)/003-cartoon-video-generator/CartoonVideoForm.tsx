"use client";

import React, { useState, ChangeEvent, DragEvent } from "react";
import Image from "next/image";
import {
  Upload,
  User,
  MessageSquare,
  MapPin,
  Palette,
  Star,
  Mail,
  Loader2,
  X,
  AlertCircle,
  CheckCircle,
  Download,
  ExternalLink,
} from "lucide-react";

// shadcn/ui imports
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface FormData {
  facePhoto: File | null;
  spokenTextTopic: string;
  gender: string;
  sceneSetting: string;
  characterStyle: string;
  famousFaceBlend: string;
  email: string;
}

interface ResultData {
  success: boolean;
  message: string;
  data?: any;
  imageGenerated?: string;
  fileUrl?: string;
  downloadLink?: string;
  siteName?: string;
  timestamp?: string;
  needsSetup?: boolean;
  webhookError?: string;
}

// 🔥 UPDATED INTERFACE TO ACCEPT SITE NAME AS PROP
interface CartoonVideoFormProps {
  siteName: string;
}

const CartoonVideoForm: React.FC<CartoonVideoFormProps> = ({ siteName }) => {
  const [formData, setFormData] = useState<FormData>({
    facePhoto: null,
    spokenTextTopic: "",
    gender: "",
    sceneSetting: "",
    characterStyle: "",
    famousFaceBlend: "",
    email: "",
  });

  const [formState, setFormState] = useState<
    "form" | "processing" | "success" | "error"
  >("form");
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [result, setResult] = useState<ResultData | null>(null);

  // 🔥 NOW USES PROP INSTEAD OF HARDCODED VALUE
  const SITE_NAME = siteName;

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        facePhoto: file,
      }));

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          setImagePreview(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      facePhoto: null,
    }));
    setImagePreview(null);
    // Reset file input
    const fileInput = document.getElementById("face-photo") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.includes("image")) {
        setFormData((prev) => ({
          ...prev,
          facePhoto: file,
        }));

        // Create preview URL for dropped file
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          if (e.target?.result) {
            setImagePreview(e.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleSubmit = async () => {
    // Reset states
    setErrorMessage("");
    setResult(null);

    // Basic validation
    if (
      !formData.facePhoto ||
      !formData.spokenTextTopic ||
      !formData.gender ||
      !formData.sceneSetting ||
      !formData.characterStyle ||
      !formData.famousFaceBlend ||
      !formData.email
    ) {
      setErrorMessage("Please fill in all required fields");
      return;
    }

    setFormState("processing");

    try {
      // 🔥 CREATE FORM DATA FOR DYNAMIC API
      const formDataToSend = new FormData();
      formDataToSend.append("Face_Photo", formData.facePhoto);
      formDataToSend.append("Spoken_Text_Topic", formData.spokenTextTopic);
      formDataToSend.append("Gender", formData.gender);
      formDataToSend.append("Scene_Setting", formData.sceneSetting);
      formDataToSend.append("Character_Style", formData.characterStyle);
      formDataToSend.append("Famous_Face_Blend", formData.famousFaceBlend);
      formDataToSend.append("Email", formData.email);

      // 🔥 SEND TO DYNAMIC PORTFOLIO API WITH PASSED SITE NAME
      const response = await fetch(`/api/portfolio/${SITE_NAME}`, {
        method: "POST",
        body: formDataToSend,
      });

      const apiResult = await response.json();

      if (response.ok) {
        setResult({
          success: true,
          message: apiResult.message,
          data: apiResult.data,
          imageGenerated: apiResult.imageGenerated,
          fileUrl: apiResult.fileUrl,
          downloadLink: apiResult.downloadLink,
          siteName: apiResult.siteName,
          timestamp: apiResult.timestamp,
        });
        setFormState("success");
      } else {
        // 🔥 HANDLE DIFFERENT ERROR TYPES
        if (apiResult.needsSetup) {
          setResult({
            success: false,
            message:
              "Please configure your cartoon video generator credentials first.",
            needsSetup: true,
            siteName: SITE_NAME,
          });
        } else if (apiResult.webhookStatus) {
          setResult({
            success: false,
            message: `Your n8n workflow returned an error (Status: ${apiResult.webhookStatus}). Please check your workflow configuration.`,
            webhookError: apiResult.webhookError,
          });
        } else {
          setResult({
            success: false,
            message: apiResult.error || "Something went wrong",
          });
        }
        setFormState("error");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      const errorMsg =
        error instanceof Error
          ? error.message
          : "Failed to submit form. Please check your connection and try again.";
      setResult({
        success: false,
        message: errorMsg,
      });
      setFormState("error");
    }
  };

  const resetForm = () => {
    setFormData({
      facePhoto: null,
      spokenTextTopic: "",
      gender: "",
      sceneSetting: "",
      characterStyle: "",
      famousFaceBlend: "",
      email: "",
    });
    setFormState("form");
    setImagePreview(null);
    setErrorMessage("");
    setResult(null);
  };

  const retrySubmission = () => {
    setFormState("form");
    setErrorMessage("");
    setResult(null);
  };

  if (formState === "processing") {
    return (
      
      <Card className="max-w-md w-full mx-auto">
        <CardContent className="pt-12 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mx-auto mb-6"></div>
          <CardTitle className="text-2xl mb-4">Creating Your Video</CardTitle>
          <CardDescription className="mb-6">
            Your cartoon video is being processed! Our AI is working its magic
            to create something amazing for you.
          </CardDescription>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center justify-center space-x-2 text-purple-600">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm font-medium">Processing...</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (formState === "success") {
    return (
      <Card className="max-w-2xl w-full mx-auto">
        <CardContent className="pt-12 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl mb-4">Success!</CardTitle>

          {/* 🔥 ENHANCED SUCCESS DISPLAY */}
          {result?.imageGenerated && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">
                Generated Preview:
              </h3>
              <div className="relative inline-block">
                <Image
                  src={result.imageGenerated}
                  alt="Generated cartoon"
                  width={300}
                  height={300}
                  className="max-w-full h-auto rounded-lg shadow-lg border-2 border-gray-200"
                  style={{ maxHeight: "300px" }}
                  unoptimized
                />
              </div>
            </div>
          )}

          {/* File Downloads */}
          {result?.fileUrl && (
            <div className="mb-4">
              <p className="text-sm font-medium mb-2">Video File:</p>
              <Button asChild className="mb-2">
                <a
                  href={result.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download Video
                </a>
              </Button>
            </div>
          )}

          {/* Download Link */}
          {result?.downloadLink && (
            <div className="mb-4">
              <p className="text-sm font-medium mb-2">Temporary Download:</p>
              <Button asChild variant="outline">
                <a
                  href={result.downloadLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open Download Link
                </a>
              </Button>
            </div>
          )}

          <CardDescription className="mb-6">
            {result?.imageGenerated
              ? "Your cartoon image has been generated! The full video will be sent to your email."
              : "Check your email for your cartoon video!"}
          </CardDescription>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-green-700">
              📧 Video will be sent to: <strong>{formData.email}</strong>
            </p>
            {result?.siteName && (
              <p className="text-xs text-green-600 mt-1">
                Processed by: {result.siteName} •{" "}
                {result.timestamp
                  ? new Date(result.timestamp).toLocaleString()
                  : "Just now"}
              </p>
            )}
          </div>

          <Button onClick={resetForm} className="w-full">
            Create Another Video
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (formState === "error") {
    return (
      <Card className="max-w-md w-full mx-auto ">
        <CardContent className="pt-12 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl mb-4">
            Oops! Something went wrong
          </CardTitle>
          <CardDescription className="mb-6">
            {result?.message || errorMessage}
          </CardDescription>

          {/* 🔥 SETUP REQUIRED NOTICE */}
          {result?.needsSetup && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700 mb-3">
                <strong>Setup Required:</strong> You need to configure your
                credentials for the cartoon video generator.
              </p>
              <Button size="sm" className="mb-2">
                → Configure Credentials
              </Button>
            </div>
          )}

          {/* 🔥 WORKFLOW ERROR DETAILS */}
          {result?.webhookError && (
            <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-sm text-orange-700 mb-2">
                <strong>Workflow Error:</strong> {result.webhookError}
              </p>
              <p className="text-xs text-orange-600">
                Check your n8n workflow configuration and API credentials.
              </p>
            </div>
          )}

          <div className="space-y-3">
            <Button onClick={retrySubmission} className="w-full">
              Try Again
            </Button>
            <Button onClick={resetForm} variant="outline" className="w-full">
              Start Over
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // 🔥 MAIN FORM (SIMPLIFIED FOR EMBEDDING)
  return (

 <div className="bg-card border rounded-lg p-6 mb-6">
    <div className="space-y-6 ">
      {/* Error Message */}
      {errorMessage && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      {/* File Upload */}
      <div className="space-y-2">

     <h3 className="text-lg font-semibold mb-4">
            🎬 Create Cartoon Video
          </h3>

        <Label className="flex items-center text-sm font-medium">
          <Upload className="h-4 w-4 mr-2" />
          Face Photo *
        </Label>

        {/* Image Preview */}
        {imagePreview && (
          <div className="mb-4 relative inline-block">
            <Image
              src={imagePreview}
              alt="Preview"
              width={96}
              height={96}
              className="object-cover rounded-lg border-2 border-gray-200"
              unoptimized
            />
            <Button
              onClick={removeImage}
              size="sm"
              variant="destructive"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
              type="button"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}

        <div
          className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer ${
            dragActive
              ? "border-purple-400 bg-purple-50"
              : "border-gray-300 hover:border-purple-400"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className="hidden"
            id="face-photo"
          />
          <label htmlFor="face-photo" className="cursor-pointer">
            {formData.facePhoto ? (
              <div>
                <div className="text-green-600 mb-2">✓ File uploaded</div>
                <div className="text-sm text-gray-600">
                  {formData.facePhoto.name}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Click to change image
                </div>
              </div>
            ) : (
              <div>
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">
                  Drop your photo here or{" "}
                  <span className="text-purple-600 font-semibold">browse</span>
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  PNG, JPG, WEBP up to 10MB
                </p>
              </div>
            )}
          </label>
        </div>
      </div>

      {/* Spoken Text Topic */}
      <div className="space-y-2">
        <Label className="flex items-center text-sm font-medium">
          <MessageSquare className="h-4 w-4 mr-2" />
          What should your character talk about? *
        </Label>
        <Textarea
          name="spokenTextTopic"
          value={formData.spokenTextTopic}
          onChange={handleInputChange}
          placeholder="e.g., Explaining quantum physics, sharing a favorite recipe, telling a joke..."
          rows={3}
        />
      </div>

      {/* Gender */}
      <div className="space-y-2">
        <Label className="flex items-center text-sm font-medium">
          <User className="h-4 w-4 mr-2" />
          Gender *
        </Label>
        <Select
          value={formData.gender}
          onValueChange={(value) => handleSelectChange("gender", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Male">Male</SelectItem>
            <SelectItem value="Female">Female</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Scene Setting */}
      <div className="space-y-2">
        <Label className="flex items-center text-sm font-medium">
          <MapPin className="h-4 w-4 mr-2" />
          Scene Setting *
        </Label>
        <Input
          name="sceneSetting"
          value={formData.sceneSetting}
          onChange={handleInputChange}
          placeholder="e.g., coffee shop, office, beach, fantasy world..."
        />
      </div>

      {/* Character Style */}
      <div className="space-y-2">
        <Label className="flex items-center text-sm font-medium">
          <Palette className="h-4 w-4 mr-2" />
          Character Style *
        </Label>
        <Input
          name="characterStyle"
          value={formData.characterStyle}
          onChange={handleInputChange}
          placeholder="e.g., Pixar, Disney, anime, comic book..."
        />
      </div>

      {/* Famous Face Blend */}
      <div className="space-y-2">
        <Label className="flex items-center text-sm font-medium">
          <Star className="h-4 w-4 mr-2" />
          Famous Face Blend *
        </Label>
        <Input
          name="famousFaceBlend"
          value={formData.famousFaceBlend}
          onChange={handleInputChange}
          placeholder="e.g., Ryan Reynolds, Jennifer Lawrence, Morgan Freeman..."
        />
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label className="flex items-center text-sm font-medium">
          <Mail className="h-4 w-4 mr-2" />
          Email Address *
        </Label>
        <Input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="your@email.com"
        />
      </div>

      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        disabled={formState === "processing"}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg py-6"
        size="lg"
      >
        {formState === "processing" ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Creating Video...
          </>
        ) : (
          "Create My Cartoon Video ✨"
        )}
      </Button>

      <div className="text-center text-sm text-muted-foreground">
        Your video will be ready in about 3-5 minutes and sent to your email!
        <br />
        <span className="text-xs">
          🔥 Using site: {SITE_NAME} | API: /api/portfolio/{SITE_NAME}
        </span>
      </div>
    </div>
 </div>


  );
};

export default CartoonVideoForm;
