// app/dashboard/node-guides/create/page.tsx
"use client";

import { createNodeSetupGuideAction } from "@/utils/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, BookOpen, Save, Plus, Trash2, ExternalLink, AlertCircle, Key, Video } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function CreateNodeGuidePage() {
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Pre-populate from URL params if available
  const [formData, setFormData] = useState({
    serviceName: searchParams.get('serviceName') || '',
    hostIdentifier: searchParams.get('hostIdentifier') || '',
    nodeType: searchParams.get('nodeType') || '',
    title: '',
    description: '',
    // NEW: Credential fields
    credentialGuide: '',
    credentialVideo: '',
    // General setup
    setupInstructions: '',
  });

  // Separate state for JSON fields (easier to manage)
  const [credentialsLinks, setCredentialsLinks] = useState([{ title: '', url: '' }]);
  const [helpLinks, setHelpLinks] = useState([{ title: '', url: '' }]);
  const [videoLinks, setVideoLinks] = useState([{ title: '', url: '' }]);
  const [troubleshootingItems, setTroubleshootingItems] = useState([{ issue: '', solution: '' }]);

  // Auto-generate guide title based on service name
  useEffect(() => {
    if (formData.serviceName && (!formData.title || formData.title.startsWith('How to setup'))) {
      const serviceName = formData.serviceName
        .replace(/-/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
      
      const newTitle = `How to setup ${serviceName} credentials`;
      setFormData(prev => ({
        ...prev,
        title: newTitle
      }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.serviceName]);

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

      const result = await createNodeSetupGuideAction({}, formDataObj);
      
      if (result.success) {
        toast.success(result.message);
        window.location.href = '/dashboard/node-guides';
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Error creating guide:', error);
      toast.error('Failed to create guide');
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
              <Link href="/dashboard/node-guides">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
          </div>
          <h1 className="text-3xl font-bold mb-2">Create Credential Guide</h1>
          <p className="text-muted-foreground">
            Create a comprehensive credential setup guide for {formData.serviceName || 'this service'}
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
                      <span className="text-blue-600 dark:text-blue-400 font-medium">Creating guide for: </span>
                      <span className="font-semibold text-blue-800 dark:text-blue-200">{formData.serviceName || 'Unknown Service'}</span>
                    </div>
                    {formData.hostIdentifier && (
                      <div className="text-base">
                        <span className="text-blue-600 dark:text-blue-400 font-medium">Host: </span>
                        <span className="font-mono text-blue-700 dark:text-blue-300">{formData.hostIdentifier}</span>
                      </div>
                    )}
                    <div className="text-base">
                      <span className="text-blue-600 dark:text-blue-400 font-medium">Node Type: </span>
                      <span className="font-mono text-sm text-blue-700 dark:text-blue-300">{formData.nodeType || 'Unknown'}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
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
                    placeholder="Brief description of what this service does..."
                    rows={3}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    What this service does and why it&apos;s useful
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Credentials Section */}
            <Card className="border-blue-500/20 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Credentials Setup
                </CardTitle>
                <div className="mt-3 border-l-4 border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 pl-6 py-4">
                  <p className="text-base text-blue-600 dark:text-blue-400">
                    The main credential setup instructions for this service
                  </p>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="credentialGuide" className="mb-2 block">Step-by-step Credential Instructions</Label>
                  <Textarea
                    id="credentialGuide"
                    value={formData.credentialGuide}
                    onChange={(e) => handleChange('credentialGuide', e.target.value)}
                    placeholder="1. Go to https://platform.openai.com/api-keys
2. Click 'Create new secret key'
3. Copy the key (starts with sk-)
4. In n8n, paste into 'API Key' field
5. Save and test the connection"
                    rows={10}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Write clear, step-by-step instructions for getting and setting up credentials
                  </p>
                </div>

                <div>
                  <Label htmlFor="credentialVideo" className="mb-2 block">Credential Setup Video (Optional)</Label>
                  <Input
                    id="credentialVideo"
                    type="url"
                    value={formData.credentialVideo}
                    onChange={(e) => handleChange('credentialVideo', e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Link to a video showing the credential setup process
                  </p>
                </div>

                {/* Credentials Links */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Label className="mb-2 block">Credential-Related Links</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addCredentialsLink}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Link
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {credentialsLinks.map((link, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex-1">
                          <Input
                            placeholder="Link title (e.g., Get API Key)"
                            value={link.title}
                            onChange={(e) => updateCredentialsLink(index, 'title', e.target.value)}
                          />
                        </div>
                        <div className="flex-1">
                          <Input
                            placeholder="https://..."
                            type="url"
                            value={link.url}
                            onChange={(e) => updateCredentialsLink(index, 'url', e.target.value)}
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
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Links to credential signup pages, API key management, etc.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* General Setup Instructions */}
            <Card>
              <CardHeader>
                <CardTitle>General Setup Instructions</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Additional setup steps after credentials are configured
                </p>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="setupInstructions" className="mb-2 block">Post-Credential Setup Steps</Label>
                  <Textarea
                    id="setupInstructions"
                    value={formData.setupInstructions}
                    onChange={(e) => handleChange('setupInstructions', e.target.value)}
                    placeholder="1. Test your connection in n8n
2. Configure any additional settings...
3. Set up common use cases...
4. Review rate limits and quotas..."
                    rows={8}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Instructions for using the service after credentials are set up
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Help Links */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ExternalLink className="h-5 w-5" />
                    General Help Links
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={addHelpLink}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Link
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {helpLinks.map((link, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex-1">
                        <Input
                          placeholder="Link title (e.g., Official Documentation)"
                          value={link.title}
                          onChange={(e) => updateHelpLink(index, 'title', e.target.value)}
                        />
                      </div>
                      <div className="flex-1">
                        <Input
                          placeholder="https://..."
                          type="url"
                          value={link.url}
                          onChange={(e) => updateHelpLink(index, 'url', e.target.value)}
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
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  General documentation, tutorials, and helpful resources
                </p>
              </CardContent>
            </Card>

            {/* Video Links */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Video className="h-5 w-5" />
                    Additional Video Tutorials
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={addVideoLink}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Video
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {videoLinks.map((link, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex-1">
                        <Input
                          placeholder="Video title (e.g., Advanced Usage)"
                          value={link.title}
                          onChange={(e) => updateVideoLink(index, 'title', e.target.value)}
                        />
                      </div>
                      <div className="flex-1">
                        <Input
                          placeholder="https://youtube.com/..."
                          type="url"
                          value={link.url}
                          onChange={(e) => updateVideoLink(index, 'url', e.target.value)}
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
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Additional tutorial videos beyond the main credential setup
                </p>
              </CardContent>
            </Card>

            {/* Troubleshooting */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    Troubleshooting
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={addTroubleshootingItem}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Issue
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {troubleshootingItems.map((item, index) => (
                    <div key={index} className="space-y-2">
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
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Common credential and setup issues with solutions
                </p>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" asChild>
                <Link href="/dashboard/node-guides">Cancel</Link>
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Creating Guide...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Create Guide
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