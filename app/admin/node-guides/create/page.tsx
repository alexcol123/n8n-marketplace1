// app/dashboard/node-guides/create/page.tsx
"use client";

import { createNodeSetupGuideAction } from "@/utils/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, BookOpen, Save, Plus, Trash2, ExternalLink, AlertCircle, Key, Video, CheckCircle2 } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="bg-gradient-to-br from-emerald-50/80 to-teal-50/80 dark:from-emerald-950/20 dark:to-teal-950/20 border border-emerald-200/60 dark:border-emerald-800/30 rounded-xl p-6 shadow-sm mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="outline" size="sm" className="border-emerald-300 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-700 dark:text-emerald-300 dark:hover:bg-emerald-900/20" asChild>
              <Link href="/dashboard/node-guides">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-200 dark:border-emerald-700">
              {formData.hostIdentifier ? "HTTP API" : "Direct Node"}
            </Badge>
          </div>
          
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-emerald-800 dark:text-emerald-200 leading-tight">
              Create Credential Guide
            </h1>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span className="text-emerald-700 dark:text-emerald-300 font-medium">
                Creating guide for {formData.serviceName || 'this service'}
              </span>
            </div>
          </div>

          <Separator className="bg-emerald-200 dark:bg-emerald-800 my-4" />

          {/* Service Info Display */}
          <div className="space-y-2">
            <div className="text-base">
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">Service: </span>
              <span className="font-semibold text-emerald-800 dark:text-emerald-200">{formData.serviceName || 'Unknown Service'}</span>
            </div>
            {formData.hostIdentifier && (
              <div className="text-base">
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">Host: </span>
                <span className="font-mono text-emerald-700 dark:text-emerald-300">{formData.hostIdentifier}</span>
              </div>
            )}
            <div className="text-base">
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">Node Type: </span>
              <span className="font-mono text-sm text-emerald-700 dark:text-emerald-300">{formData.nodeType || 'Unknown'}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-8">
            {/* Service Information */}
            <Card className="border-slate-200 bg-white/50 dark:border-slate-800/50 dark:bg-slate-950/10 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                  <BookOpen className="h-5 w-5" />
                  Service Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="title" className="mb-2 block text-slate-700 dark:text-slate-300 font-medium">Guide Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="e.g., How to setup OpenAI credentials"
                    className="border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-950/20"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="mb-2 block text-slate-700 dark:text-slate-300 font-medium">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Brief description of what this service does..."
                    className="border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-950/20"
                    rows={3}
                  />
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    What this service does and why it&apos;s useful
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Credentials Section */}
            <Card className="border-orange-200 bg-orange-50/50 dark:border-orange-800/50 dark:bg-orange-950/20 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
                  <Key className="h-5 w-5" />
                  Credentials Setup
                </CardTitle>
                <div className="text-sm text-orange-700 dark:text-orange-300 mt-2">
                  The main credential setup instructions for this service
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="credentialGuide" className="mb-2 block text-orange-800 dark:text-orange-200 font-medium">
                    Step-by-step Credential Instructions
                  </Label>
                  <Textarea
                    id="credentialGuide"
                    value={formData.credentialGuide}
                    onChange={(e) => handleChange('credentialGuide', e.target.value)}
                    placeholder="1. Go to https://platform.openai.com/api-keys&#10;2. Click 'Create new secret key'&#10;3. Copy the key (starts with sk-)&#10;4. In n8n, paste into 'API Key' field&#10;5. Save and test the connection"
                    className="border-orange-300 dark:border-orange-700 bg-white/80 dark:bg-orange-950/30 font-mono"
                    rows={10}
                  />
                  <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">
                    Write clear, step-by-step instructions for getting and setting up credentials
                  </p>
                </div>

                <div>
                  <Label htmlFor="credentialVideo" className="mb-2 block text-orange-800 dark:text-orange-200 font-medium">
                    Credential Setup Video (Optional)
                  </Label>
                  <Input
                    id="credentialVideo"
                    type="url"
                    value={formData.credentialVideo}
                    onChange={(e) => handleChange('credentialVideo', e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                    className="border-orange-300 dark:border-orange-700 bg-white/80 dark:bg-orange-950/30"
                  />
                  <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">
                    Link to a video showing the credential setup process
                  </p>
                </div>

                {/* Credentials Links */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Label className="text-orange-800 dark:text-orange-200 font-medium">Credential-Related Links</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addCredentialsLink} className="border-orange-300 text-orange-700 hover:bg-orange-100 dark:border-orange-700 dark:text-orange-300 dark:hover:bg-orange-900/20">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Link
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {credentialsLinks.map((link, index) => (
                      <div key={index} className="flex gap-4 p-3 bg-white/60 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800/50 rounded-lg">
                        <div className="flex-1">
                          <Input
                            placeholder="Link title (e.g., Get API Key)"
                            value={link.title}
                            onChange={(e) => updateCredentialsLink(index, 'title', e.target.value)}
                            className="border-orange-300 dark:border-orange-700 bg-white/80 dark:bg-orange-950/30"
                          />
                        </div>
                        <div className="flex-1">
                          <Input
                            placeholder="https://..."
                            type="url"
                            value={link.url}
                            onChange={(e) => updateCredentialsLink(index, 'url', e.target.value)}
                            className="border-orange-300 dark:border-orange-700 bg-white/80 dark:bg-orange-950/30"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCredentialsLink(index)}
                          disabled={credentialsLinks.length === 1}
                          className="text-orange-600 hover:text-orange-700 hover:bg-orange-100 dark:text-orange-400 dark:hover:text-orange-300 dark:hover:bg-orange-900/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-orange-600 dark:text-orange-400 mt-2">
                    Links to credential signup pages, API key management, etc.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* General Setup Instructions */}
            <Card className="border-emerald-200 bg-white/50 dark:border-emerald-800/50 dark:bg-emerald-950/10 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-emerald-800 dark:text-emerald-200">
                  <CheckCircle2 className="h-5 w-5" />
                  After Credentials Setup
                </CardTitle>
                <p className="text-sm text-emerald-700 dark:text-emerald-300 mt-2">
                  Additional setup steps after credentials are configured
                </p>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="setupInstructions" className="mb-2 block text-emerald-800 dark:text-emerald-200 font-medium">Post-Credential Setup Steps</Label>
                  <Textarea
                    id="setupInstructions"
                    value={formData.setupInstructions}
                    onChange={(e) => handleChange('setupInstructions', e.target.value)}
                    placeholder="1. Test your connection in n8n&#10;2. Configure any additional settings...&#10;3. Set up common use cases...&#10;4. Review rate limits and quotas..."
                    className="border-emerald-300 dark:border-emerald-700 bg-white/80 dark:bg-emerald-950/20 font-mono"
                    rows={8}
                  />
                  <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-1">
                    Instructions for using the service after credentials are set up
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Help Links */}
            <Card className="border-slate-200 bg-white/50 dark:border-slate-800/50 dark:bg-slate-950/10 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                    <ExternalLink className="h-5 w-5" />
                    General Help Links
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={addHelpLink} className="border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900/20">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Link
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {helpLinks.map((link, index) => (
                    <div key={index} className="flex gap-4 p-3 bg-white/60 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800/50 rounded-lg">
                      <div className="flex-1">
                        <Input
                          placeholder="Link title (e.g., Official Documentation)"
                          value={link.title}
                          onChange={(e) => updateHelpLink(index, 'title', e.target.value)}
                          className="border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-950/30 text-slate-900 dark:text-slate-100"
                        />
                      </div>
                      <div className="flex-1">
                        <Input
                          placeholder="https://..."
                          type="url"
                          value={link.url}
                          onChange={(e) => updateHelpLink(index, 'url', e.target.value)}
                          className="border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-950/30 text-slate-900 dark:text-slate-100"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeHelpLink(index)}
                        disabled={helpLinks.length === 1}
                        className="text-slate-600 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-300 dark:hover:bg-slate-900/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                  General documentation, tutorials, and helpful resources
                </p>
              </CardContent>
            </Card>

            {/* Video Links */}
            <Card className="border-slate-200 bg-white/50 dark:border-slate-800/50 dark:bg-slate-950/10 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                    <Video className="h-5 w-5" />
                    Additional Video Tutorials
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={addVideoLink} className="border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900/20">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Video
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {videoLinks.map((link, index) => (
                    <div key={index} className="flex gap-4 p-3 bg-white/60 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800/50 rounded-lg">
                      <div className="flex-1">
                        <Input
                          placeholder="Video title (e.g., Advanced Usage)"
                          value={link.title}
                          onChange={(e) => updateVideoLink(index, 'title', e.target.value)}
                          className="border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-950/30 text-slate-900 dark:text-slate-100"
                        />
                      </div>
                      <div className="flex-1">
                        <Input
                          placeholder="https://youtube.com/..."
                          type="url"
                          value={link.url}
                          onChange={(e) => updateVideoLink(index, 'url', e.target.value)}
                          className="border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-950/30 text-slate-900 dark:text-slate-100"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeVideoLink(index)}
                        disabled={videoLinks.length === 1}
                        className="text-slate-600 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-300 dark:hover:bg-slate-900/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                  Additional tutorial videos beyond the main credential setup
                </p>
              </CardContent>
            </Card>

            {/* Troubleshooting */}
            <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-800/50 dark:bg-amber-950/20 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
                    <AlertCircle className="h-5 w-5" />
                    Common Issues & Solutions
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={addTroubleshootingItem} className="border-amber-300 text-amber-700 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-300 dark:hover:bg-amber-900/20">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Issue
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {troubleshootingItems.map((item, index) => (
                    <div key={index} className="border border-amber-200 dark:border-amber-800/50 rounded-lg p-4 bg-white/60 dark:bg-amber-950/20">
                      <div className="space-y-3">
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <Label className="text-amber-800 dark:text-amber-200 font-medium mb-2 flex items-center gap-2">
                              <span className="bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 text-xs px-2 py-1 rounded-full font-medium">
                                Issue
                              </span>
                              Title
                            </Label>
                            <Input
                              placeholder="Issue title (e.g., 401 Unauthorized Error)"
                              value={item.issue}
                              onChange={(e) => updateTroubleshootingItem(index, 'issue', e.target.value)}
                              className="border-amber-300 dark:border-amber-700 bg-white/80 dark:bg-amber-950/30"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeTroubleshootingItem(index)}
                            disabled={troubleshootingItems.length === 1}
                            className="text-amber-600 hover:text-amber-700 hover:bg-amber-100 dark:text-amber-400 dark:hover:text-amber-300 dark:hover:bg-amber-900/20 self-end"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div>
                          <Label className="text-amber-800 dark:text-amber-200 font-medium mb-2 block">Solution</Label>
                          <Textarea
                            placeholder="Solution steps and explanation..."
                            value={item.solution}
                            onChange={(e) => updateTroubleshootingItem(index, 'solution', e.target.value)}
                            className="border-amber-300 dark:border-amber-700 bg-white/80 dark:bg-amber-950/30"
                            rows={3}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-amber-600 dark:text-amber-400 mt-4">
                  Common credential and setup issues with solutions
                </p>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end gap-4 pt-4">
              <Button type="button" variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900/20" asChild>
                <Link href="/dashboard/node-guides">Cancel</Link>
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-800">
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