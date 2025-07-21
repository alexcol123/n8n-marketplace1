// components/(custom)/(node-guides)/EditNodeGuideForm.tsx
"use client";

import { updateNodeSetupGuideAction,  } from "@/utils/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, BookOpen, Save, Plus, Trash2, Key, Video, AlertCircle, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { toast } from "sonner";

// import NodeImageUpload from "@/components/(custom)/(node-guides)/NodeImageUpload"; // For debugging

interface EditNodeGuideFormProps {
  guide: {
    id: string;
    serviceName: string;
    hostIdentifier?: string;
    title: string;
    description?: string;
    credentialGuide?: string;
    credentialVideo?: string;
    credentialsLinks?: Array<{ title: string; url: string }>;
    setupInstructions?: string;
    helpLinks?: Array<{ title: string; url: string }>;
    videoLinks?: Array<{ title: string; url: string }>;
    troubleshooting?: Array<{ issue: string; solution: string }>;
    nodeImage?: string;
  };
}

export default function EditNodeGuideForm({ guide }: EditNodeGuideFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize form data with existing guide data
  const [formData, setFormData] = useState({
    title: guide.title || '',
    description: guide.description || '',
    credentialGuide: guide.credentialGuide || '',
    credentialVideo: guide.credentialVideo || '',
    setupInstructions: guide.setupInstructions || '',
  });

  // Initialize JSON fields with existing data or defaults
  const [credentialsLinks, setCredentialsLinks] = useState(
    guide.credentialsLinks && guide.credentialsLinks.length > 0 
      ? guide.credentialsLinks 
      : [{ title: '', url: '' }]
  );
  
  const [helpLinks, setHelpLinks] = useState(
    guide.helpLinks && guide.helpLinks.length > 0 
      ? guide.helpLinks 
      : [{ title: '', url: '' }]
  );
  
  const [videoLinks, setVideoLinks] = useState(
    guide.videoLinks && guide.videoLinks.length > 0 
      ? guide.videoLinks 
      : [{ title: '', url: '' }]
  );
  
  const [troubleshootingItems, setTroubleshootingItems] = useState(
    guide.troubleshooting && guide.troubleshooting.length > 0 
      ? guide.troubleshooting 
      : [{ issue: '', solution: '' }]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataObj = new FormData();
      
      // Add basic form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value) {
          formDataObj.append(key, value);
        }
      });

      // Add JSON fields only if they have content
      const validCredentialsLinks = credentialsLinks.filter(link => link.title.trim() || link.url.trim());
      if (validCredentialsLinks.length > 0) {
        formDataObj.append('credentialsLinks', JSON.stringify(validCredentialsLinks));
      }

      const validHelpLinks = helpLinks.filter(link => link.title.trim() || link.url.trim());
      if (validHelpLinks.length > 0) {
        formDataObj.append('helpLinks', JSON.stringify(validHelpLinks));
      }

      const validVideoLinks = videoLinks.filter(link => link.title.trim() || link.url.trim());
      if (validVideoLinks.length > 0) {
        formDataObj.append('videoLinks', JSON.stringify(validVideoLinks));
      }

      const validTroubleshooting = troubleshootingItems.filter(item => item.issue.trim() || item.solution.trim());
      if (validTroubleshooting.length > 0) {
        formDataObj.append('troubleshooting', JSON.stringify(validTroubleshooting));
      }

      // Call the update action with guide ID
      const result = await updateNodeSetupGuideAction(guide.id, {}, formDataObj);
      
      if (result.success) {
        toast.success(result.message);
        // Redirect back to the guides list
        window.location.href = '/admin/node-guides';
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Error updating guide:', error);
      toast.error('Failed to update guide');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Credentials Links functions
  const addCredentialsLink = () => {
    setCredentialsLinks(prev => [...prev, { title: '', url: '' }]);
  };

  const removeCredentialsLink = (index: number) => {
    setCredentialsLinks(prev => prev.filter((_, i) => i !== index));
  };

  const updateCredentialsLink = (index: number, field: 'title' | 'url', value: string) => {
    setCredentialsLinks(prev => prev.map((link, i) => 
      i === index ? { ...link, [field]: value } : link
    ));
  };

  // Help Links functions
  const addHelpLink = () => {
    setHelpLinks(prev => [...prev, { title: '', url: '' }]);
  };

  const removeHelpLink = (index: number) => {
    setHelpLinks(prev => prev.filter((_, i) => i !== index));
  };

  const updateHelpLink = (index: number, field: 'title' | 'url', value: string) => {
    setHelpLinks(prev => prev.map((link, i) => 
      i === index ? { ...link, [field]: value } : link
    ));
  };

  // Video Links functions
  const addVideoLink = () => {
    setVideoLinks(prev => [...prev, { title: '', url: '' }]);
  };

  const removeVideoLink = (index: number) => {
    setVideoLinks(prev => prev.filter((_, i) => i !== index));
  };

  const updateVideoLink = (index: number, field: 'title' | 'url', value: string) => {
    setVideoLinks(prev => prev.map((link, i) => 
      i === index ? { ...link, [field]: value } : link
    ));
  };

  // Troubleshooting functions
  const addTroubleshootingItem = () => {
    setTroubleshootingItems(prev => [...prev, { issue: '', solution: '' }]);
  };

  const removeTroubleshootingItem = (index: number) => {
    setTroubleshootingItems(prev => prev.filter((_, i) => i !== index));
  };

  const updateTroubleshootingItem = (index: number, field: 'issue' | 'solution', value: string) => {
    setTroubleshootingItems(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/node-guides">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
          </div>
          <h1 className="text-3xl font-bold mb-2">Edit Node Setup Guide</h1>
          <p className="text-muted-foreground">
            Update the setup guide for {guide.serviceName}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-8">
            {/* Service Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Service Information
                </CardTitle>
                <div className="mt-3 border-l-4 border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 pl-6 py-4">
                  <div className="space-y-2">
                    <div className="text-base">
                      <span className="text-blue-600 dark:text-blue-400 font-medium">Service: </span>
                      <span className="font-semibold text-blue-800 dark:text-blue-200">{guide.serviceName}</span>
                    </div>
                    {guide.hostIdentifier && (
                      <div className="text-base">
                        <span className="text-blue-600 dark:text-blue-400 font-medium">Host: </span>
                        <span className="font-mono text-blue-700 dark:text-blue-300">{guide.hostIdentifier}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                <div>
                  <Label htmlFor="title" className="mb-2 block">Guide Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="e.g., How to setup OpenAI credentials"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="mb-2 block">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Brief description of this credential setup guide"
                    rows={3}
                  />
                </div>Change('title', e.target.value)}
                    placeholder="e.g., How to setup OpenAI credentials"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="mb-2 block">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Brief description of this credential setup guide"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Node Image */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Node Image
                </CardTitle>
              </CardHeader>
              <CardContent>
     
              </CardContent>
            </Card>

            {/* Credential Setup */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Credential Setup
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="credentialGuide" className="mb-2 block">Credential Setup Guide</Label>
                  <Textarea
                    id="credentialGuide"
                    value={formData.credentialGuide}
                    onChange={(e) => handleChange('credentialGuide', e.target.value)}
                    placeholder="Step-by-step instructions for obtaining and setting up credentials..."
                    rows={8}
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Detailed instructions on how to get API keys, tokens, or other credentials
                  </p>
                </div>

                <div>
                  <Label htmlFor="credentialVideo" className="mb-2 block">Credential Setup Video (YouTube URL)</Label>
                  <Input
                    id="credentialVideo"
                    value={formData.credentialVideo}
                    onChange={(e) => handleChange('credentialVideo', e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    type="url"
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    YouTube video showing the credential setup process
                  </p>
                </div>

                {/* Credentials Links */}
                <div>
                  <Label className="mb-2 block">Useful Credential Links</Label>
                  <div className="space-y-4">
                    {credentialsLinks.map((link, index) => (
                      <div key={index} className="space-y-2 p-4 border rounded-lg">
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <Input
                              placeholder="Link title (e.g., API Dashboard)"
                              value={link.title}
                              onChange={(e) => updateCredentialsLink(index, 'title', e.target.value)}
                            />
                          </div>
                          <div className="flex-1">
                            <Input
                              placeholder="URL"
                              value={link.url}
                              onChange={(e) => updateCredentialsLink(index, 'url', e.target.value)}
                              type="url"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeCredentialsLink(index)}
                            disabled={credentialsLinks.length === 1}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addCredentialsLink}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Credentials Link
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Links to API dashboards, developer portals, etc.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* General Setup Instructions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Setup Instructions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="setupInstructions" className="mb-2 block">General Setup Instructions</Label>
                  <Textarea
                    id="setupInstructions"
                    value={formData.setupInstructions}
                    onChange={(e) => handleChange('setupInstructions', e.target.value)}
                    placeholder="Additional setup instructions, configuration tips, etc..."
                    rows={6}
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Any additional setup steps beyond credentials
                  </p>
                </div>

                {/* Help Links */}
                <div>
                  <Label className="mb-2 block">Help & Documentation Links</Label>
                  <div className="space-y-4">
                    {helpLinks.map((link, index) => (
                      <div key={index} className="space-y-2 p-4 border rounded-lg">
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <Input
                              placeholder="Link title (e.g., API Documentation)"
                              value={link.title}
                              onChange={(e) => updateHelpLink(index, 'title', e.target.value)}
                            />
                          </div>
                          <div className="flex-1">
                            <Input
                              placeholder="URL"
                              value={link.url}
                              onChange={(e) => updateHelpLink(index, 'url', e.target.value)}
                              type="url"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeHelpLink(index)}
                            disabled={helpLinks.length === 1}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addHelpLink}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Help Link
                    </Button>
                  </div>
                </div>

                {/* Video Links */}
                <div>
                  <Label className="mb-2 block flex items-center gap-2">
                    <Video className="h-4 w-4" />
                    Tutorial Videos
                  </Label>
                  <div className="space-y-4">
                    {videoLinks.map((link, index) => (
                      <div key={index} className="space-y-2 p-4 border rounded-lg">
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <Input
                              placeholder="Video title (e.g., Setup Tutorial)"
                              value={link.title}
                              onChange={(e) => updateVideoLink(index, 'title', e.target.value)}
                            />
                          </div>
                          <div className="flex-1">
                            <Input
                              placeholder="YouTube URL"
                              value={link.url}
                              onChange={(e) => updateVideoLink(index, 'url', e.target.value)}
                              type="url"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeVideoLink(index)}
                            disabled={videoLinks.length === 1}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addVideoLink}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Video Link
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Troubleshooting */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Troubleshooting
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Label className="mb-2 block">Common Issues & Solutions</Label>
                <div className="space-y-4">
                  {troubleshootingItems.map((item, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-2">
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <Input
                            placeholder="Issue title (e.g., 401 Unauthorized Error)"
                            value={item.issue}
                            onChange={(e) => updateTroubleshootingItem(index, 'issue', e.target.value)}
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeTroubleshootingItem(index)}
                          disabled={troubleshootingItems.length === 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <Textarea
                        placeholder="Solution steps and explanation..."
                        value={item.solution}
                        onChange={(e) => updateTroubleshootingItem(index, 'solution', e.target.value)}
                        rows={3}
                      />
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addTroubleshootingItem}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Troubleshooting Item
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Common credential and setup issues with solutions
                </p>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/node-guides">Cancel</Link>
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Updating Guide...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Update Guide
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}