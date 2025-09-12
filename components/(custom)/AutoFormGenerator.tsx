"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Types
interface WorkflowJson {
  nodes?: N8nNode[];
  connections?: Record<string, unknown>;
  name?: string;
}

interface N8nNode {
  id: string;
  name: string;
  type: string;
  parameters?: {
    formTitle?: string;
    formDescription?: string;
    formFields?: {
      values: FormField[];
    };
    [key: string]: unknown;
  };
  position?: [number, number];
}

interface FormData {
  formTitle: string;
  formDescription?: string;
  formFields: FormField[];
}

interface FormField {
  fieldLabel: string;
  fieldType: string;
  multipleFiles?: boolean;
  acceptFileTypes?: string;
  requiredField?: boolean;
  placeholder?: string;
  fieldOptions?: {
    values: { option: string }[];
  };
}

interface AutoFormGeneratorProps {
  workflowJson: WorkflowJson;
  slug: string; // Portfolio site slug (e.g., "00001-chatbot")
  onSubmit?: (data: Record<string, unknown>) => Promise<void>;
  webhookUrl?: string;
  showWebhookInput?: boolean;
}

export default function AutoFormGenerator({
  workflowJson,
  slug,
  onSubmit,
  webhookUrl: initialWebhookUrl = "",
  showWebhookInput = true,
}: AutoFormGeneratorProps) {
  const [extractedFormData, setExtractedFormData] = useState<FormData | null>(null);
  const [webhookUrl, setWebhookUrl] = useState(initialWebhookUrl);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{
    success: boolean;
    message: string;
    data?: unknown;
  } | null>(null);

  // Extract trigger nodes from workflow
  const extractTriggerNodes = (workflow: WorkflowJson): N8nNode[] => {
    if (!workflow?.nodes) return [];
    
    return workflow.nodes.filter((node) =>
      node.type === "n8n-nodes-base.formTrigger" ||
      node.type === "@n8n/n8n-nodes-langchain.chatTrigger"
    );
  };

  // Extract form data from trigger nodes
  const extractFormDataFromNodes = (nodes: N8nNode[]): FormData | null => {
    try {
      if (!Array.isArray(nodes) || nodes.length === 0) {
        return null;
      }

      const firstNode = nodes[0];
      if (!firstNode?.parameters) {
        return null;
      }

      const { formTitle, formDescription, formFields } = firstNode.parameters;

      if (!formTitle || !formFields?.values) {
        return null;
      }

      return {
        formTitle,
        formDescription: formDescription || "",
        formFields: formFields.values,
      };
    } catch (error) {
      console.error("Error extracting form data:", error);
      return null;
    }
  };

  // Initialize form data when workflow changes
  useEffect(() => {
    if (workflowJson) {
      const triggerNodes = extractTriggerNodes(workflowJson);
      const formData = extractFormDataFromNodes(triggerNodes);
      setExtractedFormData(formData);
    }
  }, [workflowJson]);

  // Generate dynamic Zod schema for form validation
  const generateFormSchema = (formFields: FormField[]) => {
    const schemaFields: Record<string, z.ZodTypeAny> = {};

    formFields.forEach((field) => {
      const fieldName = field.fieldLabel.toLowerCase().replace(/\s+/g, "_");

      switch (field.fieldType) {
        case "email":
          if (field.requiredField) {
            schemaFields[fieldName] = z
              .string()
              .email("Please enter a valid email")
              .min(1, `${field.fieldLabel} is required`);
          } else {
            schemaFields[fieldName] = z
              .string()
              .email("Please enter a valid email")
              .optional();
          }
          break;

        case "file":
          const acceptedTypes = field.acceptFileTypes
            ? field.acceptFileTypes
                .split(",")
                .map((type) => type.trim().toLowerCase())
            : [];

          const validateFileType = (val: unknown) => {
            if (!val || acceptedTypes.length === 0) return true;

            const files = field.multipleFiles
              ? Array.from(val as FileList)
              : [val as File];
            return files.every((file: File) => {
              const extension = file.name.split(".").pop()?.toLowerCase();

              if (acceptedTypes.includes(extension || "")) return true;

              if (extension === "jpg" && acceptedTypes.includes("jpeg"))
                return true;
              if (extension === "jpeg" && acceptedTypes.includes("jpg"))
                return true;

              const mimeType = file.type.toLowerCase();
              if (
                acceptedTypes.includes("jpeg") &&
                (mimeType === "image/jpeg" || mimeType === "image/jpg")
              )
                return true;
              if (acceptedTypes.includes("png") && mimeType === "image/png")
                return true;
              if (acceptedTypes.includes("webp") && mimeType === "image/webp")
                return true;
              if (acceptedTypes.includes("gif") && mimeType === "image/gif")
                return true;

              return false;
            });
          };

          if (field.requiredField) {
            schemaFields[fieldName] = z
              .any()
              .refine(
                (val) =>
                  val != null && (field.multipleFiles ? val.length > 0 : val),
                `${field.fieldLabel} is required`
              )
              .refine(validateFileType, {
                message: `Please upload only ${acceptedTypes.join(", ")} files`,
              });
          } else {
            schemaFields[fieldName] = z
              .any()
              .optional()
              .refine(validateFileType, {
                message: `Please upload only ${acceptedTypes.join(", ")} files`,
              });
          }
          break;

        case "textarea":
          if (field.requiredField) {
            schemaFields[fieldName] = z
              .string()
              .min(1, `${field.fieldLabel} is required`);
          } else {
            schemaFields[fieldName] = z.string().optional();
          }
          break;

        case "dropdown":
          if (field.requiredField) {
            schemaFields[fieldName] = z
              .string()
              .min(1, `${field.fieldLabel} is required`);
          } else {
            schemaFields[fieldName] = z.string().optional();
          }
          break;

        default:
          if (field.requiredField) {
            schemaFields[fieldName] = z
              .string()
              .min(1, `${field.fieldLabel} is required`);
          } else {
            schemaFields[fieldName] = z.string().optional();
          }
      }
    });

    return z.object(schemaFields);
  };

  // Initialize form
  const formSchema = extractedFormData
    ? generateFormSchema(extractedFormData.formFields)
    : z.object({});

  type DynamicFormValues = Record<string, string | File | FileList | undefined>;

  const form = useForm<DynamicFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: extractedFormData
      ? extractedFormData.formFields.reduce((acc, field) => {
          const fieldName = field.fieldLabel.toLowerCase().replace(/\s+/g, "_");
          return { ...acc, [fieldName]: "" };
        }, {} as DynamicFormValues)
      : {},
  });

  // Reset form when extracted form data changes
  useEffect(() => {
    if (extractedFormData) {
      const defaultValues = extractedFormData.formFields.reduce((acc, field) => {
        const fieldName = field.fieldLabel.toLowerCase().replace(/\s+/g, "_");
        return { ...acc, [fieldName]: "" };
      }, {} as DynamicFormValues);
      form.reset(defaultValues);
    }
  }, [extractedFormData, form]);

  // Default form submission handler - always uses universal API
  const defaultSubmitHandler = async (data: Record<string, unknown>) => {
    if (showWebhookInput && !webhookUrl) {
      setSubmissionResult({
        success: false,
        message: "Please enter a webhook URL before submitting the form",
      });
      return;
    }

    try {
      const formData = new FormData();
      
      // Add webhook URL to form data so API can forward to it
      if (webhookUrl) {
        formData.append("webhookUrl", webhookUrl);
      }

      // Process form fields
      Object.entries(data).forEach(([key, value]) => {
        if (value) {
          if (value instanceof File) {
            formData.append(key, value);
          } else if (value instanceof FileList) {
            Array.from(value).forEach((file) => {
              formData.append(key, file);
            });
          } else {
            formData.append(key, value as string);
          }
        }
      });

      // ALWAYS call universal API route (never direct webhook)
      const response = await fetch(`/api/portfolio/${slug}`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmissionResult({
          success: true,
          message: result.message || "Form submitted successfully! Check your email for results in about 3 minutes.",
          data: result.data,
        });
        form.reset();
      } else {
        // Handle different error scenarios from API
        if (result.needsSetup) {
          setSubmissionResult({
            success: false,
            message: "Please configure your credentials first. Go to the credentials section to set up your workflow.",
          });
        } else {
          setSubmissionResult({
            success: false,
            message: result.error || "Error submitting form. Please try again.",
          });
        }
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmissionResult({
        success: false,
        message: "Network error. Please check your connection and try again.",
      });
    }
  };

  // Handle form submission
  const handleFormSubmit = async (data: Record<string, unknown>) => {
    setIsSubmitting(true);
    setSubmissionResult(null);

    try {
      if (onSubmit) {
        await onSubmit(data);
        setSubmissionResult({
          success: true,
          message: "Form submitted successfully!",
        });
        form.reset();
      } else {
        await defaultSubmitHandler(data);
      }
    } catch {
      setSubmissionResult({
        success: false,
        message: "An error occurred while submitting the form.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render different field types
  const renderFormField = (field: FormField) => {
    const fieldName = field.fieldLabel.toLowerCase().replace(/\s+/g, "_");

    switch (field.fieldType) {
      case "file":
        const acceptAttribute = field.acceptFileTypes
          ? field.acceptFileTypes
              .split(",")
              .map((type) => {
                const trimmedType = type.trim().toLowerCase();
                if (trimmedType === "jpeg" || trimmedType === "jpg")
                  return ".jpeg,.jpg,image/jpeg";
                if (trimmedType === "png") return ".png,image/png";
                if (trimmedType === "webp") return ".webp,image/webp";
                if (trimmedType === "gif") return ".gif,image/gif";
                if (trimmedType === "pdf") return ".pdf,application/pdf";
                return `.${trimmedType}`;
              })
              .join(",")
          : "";

        return (
          <FormField
            key={fieldName}
            control={form.control}
            name={fieldName as any}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>
                  {field.fieldLabel}
                  {field.requiredField && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept={acceptAttribute}
                    multiple={field.multipleFiles}
                    onChange={(e) => {
                      const files = e.target.files;
                      (formField as { onChange: (value: FileList | File | null) => void }).onChange(
                        field.multipleFiles ? files : (files?.[0] || null)
                      );
                    }}
                  />
                </FormControl>
                {field.acceptFileTypes && (
                  <p className="text-xs text-gray-500 mt-1">
                    Accepted formats: {field.acceptFileTypes}
                  </p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case "textarea":
        return (
          <FormField
            key={fieldName}
            control={form.control}
            name={fieldName as any}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>
                  {field.fieldLabel}
                  {field.requiredField && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={field.placeholder}
                    {...(formField as { onChange: (value: string) => void; value?: string })}
                    value={(formField as { value?: string }).value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case "dropdown":
        return (
          <FormField
            key={fieldName}
            control={form.control}
            name={fieldName as any}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>
                  {field.fieldLabel}
                  {field.requiredField && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </FormLabel>
                <Select
                  onValueChange={(formField as { onChange: (value: string) => void }).onChange}
                  defaultValue={(formField as { value?: string }).value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {field.fieldOptions?.values.map((option, index) => (
                      <SelectItem key={index} value={option.option}>
                        {option.option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case "email":
        return (
          <FormField
            key={fieldName}
            control={form.control}
            name={fieldName as any}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>
                  {field.fieldLabel}
                  {field.requiredField && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder={field.placeholder}
                    {...(formField as { onChange: (value: string) => void; value?: string })}
                    value={(formField as { value?: string }).value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      default:
        return (
          <FormField
            key={fieldName}
            control={form.control}
            name={fieldName as any}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>
                  {field.fieldLabel}
                  {field.requiredField && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder={field.placeholder}
                    {...(formField as { onChange: (value: string) => void; value?: string })}
                    value={(formField as { value?: string }).value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
    }
  };

  // If no workflow JSON provided
  if (!workflowJson) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Auto Form Generator</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 text-center py-4">
            No workflow JSON provided
          </p>
        </CardContent>
      </Card>
    );
  }

  // If no form data extracted
  if (!extractedFormData) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Auto Form Generator</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 text-center py-4">
            No form trigger found in workflow
            <br />
            <span className="text-sm text-gray-500">
              Supported triggers: n8n-nodes-base.formTrigger,
              @n8n/n8n-nodes-langchain.chatTrigger
            </span>
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{extractedFormData.formTitle}</CardTitle>
        {extractedFormData.formDescription && (
          <p className="text-sm text-gray-600 whitespace-pre-wrap">
            {extractedFormData.formDescription}
          </p>
        )}
      </CardHeader>
      <CardContent>
        {/* Webhook URL Input */}
        {showWebhookInput && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <label className="block text-sm font-medium text-blue-900 mb-2">
              Webhook URL
            </label>
            <Input
              type="url"
              placeholder="https://your-instance.n8n.cloud/webhook/..."
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="w-full"
            />
            <p className="text-xs text-blue-700 mt-1">
              Enter the webhook URL to submit the form data
            </p>
          </div>
        )}

        {/* Success/Error Messages */}
        {submissionResult && (
          <div
            className={`mb-4 p-4 rounded-md ${
              submissionResult.success
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            <p className="font-medium">{submissionResult.message}</p>
          </div>
        )}

        {/* Dynamic Form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="space-y-6"
          >
            {extractedFormData.formFields.map(renderFormField)}

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || (showWebhookInput && !webhookUrl)}
            >
              {isSubmitting ? "Submitting..." : "Submit Form"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}