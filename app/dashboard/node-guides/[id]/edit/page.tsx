// app/dashboard/node-guides/[id]/edit/page.tsx
"use client";

import { getNodeSetupGuide, updateNodeSetupGuideAction, deleteNodeSetupGuideAction } from "@/utils/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  BookOpen, 
  Save, 
  Plus, 
  Trash2, 
  ExternalLink, 
  AlertTriangle, 
  Key, 
  Video,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";

// Shared types - can be moved to a types file later
interface GuideLink {
  title: string;
  url: string;
}

interface TroubleshootingItem {
  issue: string;
  solution: string;
}

interface GuideData {
  id: string;
  serviceName: string;
  hostIdentifier: string | null;
  title: string;
  description: string | null;
  credentialGuide: string | null;
  credentialVideo: string | null;
  credentialsLinks: GuideLink[] | null;
  setupInstructions: string | null;
  helpLinks: GuideLink[] | null;
  videoLinks: GuideLink[] | null;
  troubleshooting: TroubleshootingItem[] | null;
}

export default function EditNodeGuidePage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [guide, setGuide] = useState<GuideData | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    credentialGuide: '',
    credentialVideo: '',
    setupInstructions: '',
  });

  // Separate state for JSON fields
  const [credentialsLinks, setCredentialsLinks] = useState<GuideLink[]>([{ title: '', url: '' }]);
  const [helpLinks, setHelpLinks] = useState<GuideLink[]>([{ title: '', url: '' }]);
  const [videoLinks, setVideoLinks] = useState<GuideLink[]>([{ title: '', url: '' }]);
  const [troubleshootingItems, setTroubleshootingItems] = useState<TroubleshootingItem[]>([{ issue: '', solution: '' }]);

  // Load guide data
  useEffect(() => {
    async function loadGuide() {
      try {
        const guideData = await getNodeSetupGuide(params.id);
        if (!guideData) {
          notFound();
          return;
        }

        setGuide(guideData);
        
        // Set form data
        setFormData({
          title: guideData.title || '',
          description: guideData.description || '',
          credentialGuide: guideData.credentialGuide || '',
          credentialVideo: guideData.credentialVideo || '',
          setupInstructions: guideData.setupInstructions || '',
        });

        // Set JSON fields
        setCredentialsLinks(
          guideData.credentialsLinks && Array.isArray(guideData.credentialsLinks)
            ? guideData.credentialsLinks
            : [{ title: '', url: '' }]
        );
        
        setHelpLinks(
          guideData.helpLinks && Array.isArray(guideData.helpLinks)
            ? guideData.helpLinks
            : [{ title: '', url: '' }]
        );
        
        setVideoLinks(
          guideData.videoLinks && Array.isArray(guideData.videoLinks)
            ? guideData.videoLinks
            : [{ title: '', url: '' }]
        );
        
        setTroubleshootingItems(
          guideData.troubleshooting && Array.isArray(guideData.troubleshooting)
            ? guideData.troubleshooting
            : [{ issue: '', solution: '' }]
        );
      } catch (error) {
        console.error('Error loading guide:', error);
        toast.error('Failed to load guide');
      } finally {
        setIsLoading(false);
      }
    }

    loadGuide();
  }, [params.id]);

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

      const result = await updateNodeSetupGuideAction(params.id, {}, formDataObj);
      
      if (result.success) {
        toast.success(result.message);
        router.push(`/dashboard/node-guides/${params.id}`);
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

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this guide? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);

    try {
      const result = await deleteNodeSetupGuideAction(params.id);
      
      if (result.success) {
        toast.success(result.message);
        router.push('/dashboard/node-guides');
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Error deleting guide:', error);
      toast.error('Failed to delete guide');
    } finally {
      setIsDeleting(false);
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!guide) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/dashboard/node-guides/${guide.id}`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Guide
              </Link>
            </Button>
          </div>
          
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-emerald-800 dark:text-emerald-200">
              Edit Guide
            </h1>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span className="text-emerald-700 dark:text-emerald-300">
                Update the credential guide for {guide.serviceName}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50/80 to-teal-50/80 dark:from-emerald-950/20 dark:to-teal-950/20 border border-emerald-200/60 dark:border-emerald-800/30 rounded-xl p-6 shadow-sm">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Service Information */}
              <Card className="border-emerald-200 bg-white/50 dark:border-emerald-800/50 dark:bg-emerald-950/10 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-emerald-800 dark:text-emerald-200">
                    <BookOpen className="h-5 w-5" />
                    Service Information
                  </CardTitle>
                  <div className="mt-3 border-l-4 border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 pl-6 py-4 rounded-r-lg">
                    <div className="space-y-2">
                      <div className="text-base">
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium">Service: </span>
                        <span className="font-semibold text-emerald-800 dark:text-emerald-200">{guide.serviceName}</span>
                      </div>
                      {guide.hostIdentifier && (
                        <div className="text-base">
                          <span className="text-emerald-600 dark:text-emerald-400 font-medium">Host: </span>
                          <span className="font-mono text-emerald-700 dark:text-emerald-300">{guide.hostIdentifier}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="title" className="mb-2 block font-medium">Guide Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleChange('title', e.target.value)}
                      placeholder="e.g., How to setup OpenAI credentials"
                      className="bg-white/80 dark:bg-emerald-950/20"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description" className="mb-2 block font-medium">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                      placeholder="Brief description of what this service does..."
                      className="bg-white/80 dark:bg-emerald-950/20"
                      rows={3}
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      What this service does and why it&apos;s useful
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Separator className="bg-emerald-200 dark:bg-emerald-800" />

              {/* Credentials Section */}
              <Card className="border-orange-200 bg-orange-50/50 dark:border-orange-800/50 dark:bg-orange-950/20 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
                    <Key className="h-5 w-5" />
                    Credentials Setup
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="credentialGuide" className="mb-2 block font-medium flex items-center gap-2">
                      <span className="bg-orange-100 dark:bg-orange-900/50 text-orange-800 dark:text-orange-200 text-xs px-2 py-1 rounded-full font-medium">
                        Step-by-step
                      </span>
                      Credential Instructions
                    </Label>
                    <Textarea
                      id="credentialGuide"
                      value={formData.credentialGuide}
                      onChange={(e) => handleChange('credentialGuide', e.target.value)}
                      placeholder="1. Go to https://platform.openai.com/api-keys...
2. Click 'Create new secret key'
3. Copy the key (starts with sk-)
4. In n8n, paste into 'API Key' field
5. Save and test the connection"
                      className="bg-white/80 dark:bg-orange-950/30 font-mono text-sm"
                      rows={10}
                    />
                  </div>

                  <div>
                    <Label htmlFor="credentialVideo" className="mb-2 block font-medium flex items-center gap-2">
                      <Video className="h-4 w-4" />
                      Video Tutorial (Optional)
                    </Label>
                    <Input
                      id="credentialVideo"
                      type="url"
                      value={formData.credentialVideo}
                      onChange={(e) => handleChange('credentialVideo', e.target.value)}
                      placeholder="https://youtube.com/watch?v=..."
                      className="bg-white/80 dark:bg-orange-950/30"
                    />
                  </div>

                  {/* Credentials Links */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <Label className="font-medium flex items-center gap-2">
                        <Key className="h-4 w-4" />
                        Get Your Credentials
                      </Label>
                      <Button type="button" variant="outline" size="sm" onClick={addCredentialsLink}
                        className="border-orange-300 text-orange-700 hover:bg-orange-100 dark:border-orange-700 dark:text-orange-300">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Link
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      {credentialsLinks.map((link, index) => (
                        <div key={index} className="flex gap-3 p-3 bg-white/60 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800/50">
                          <div className="flex-1">
                            <Input
                              placeholder="Link title (e.g., Get API Key)"
                              value={link.title}
                              onChange={(e) => updateCredentialsLink(index, 'title', e.target.value)}
                              className="bg-white/80 dark:bg-orange-950/30"
                            />
                          </div>
                          <div className="flex-1">
                            <Input
                              placeholder="https://..."
                              type="url"
                              value={link.url}
                              onChange={(e) => updateCredentialsLink(index, 'url', e.target.value)}
                              className="bg-white/80 dark:bg-orange-950/30"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeCredentialsLink(index)}
                            disabled={credentialsLinks.length === 1}
                            className="text-orange-600 hover:text-orange-800 hover:bg-orange-100 dark:text-orange-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Setup Instructions */}
              <Card className="border-emerald-200 bg-white/50 dark:border-emerald-800/50 dark:bg-emerald-950/10 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-emerald-800 dark:text-emerald-200">
                    <CheckCircle2 className="h-5 w-5" />
                    After Credentials Setup
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <Label htmlFor="setupInstructions" className="mb-2 block font-medium">Post-Credential Setup Steps</Label>
                    <Textarea
                      id="setupInstructions"
                      value={formData.setupInstructions}
                      onChange={(e) => handleChange('setupInstructions', e.target.value)}
                      placeholder="1. Test your connection in n8n
2. Configure any additional settings...
3. Set up common use cases...
4. Review rate limits and quotas..."
                      className="bg-white/80 dark:bg-emerald-950/20 font-mono text-sm"
                      rows={8}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Additional Resources */}
              <Card className="border-slate-200 bg-white/50 dark:border-slate-800/50 dark:bg-slate-950/10 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                    <BookOpen className="h-5 w-5" />
                    Additional Resources
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Help Links */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <Label className="font-medium flex items-center gap-2">
                        <ExternalLink className="h-4 w-4" />
                        Documentation & Guides
                      </Label>
                      <Button type="button" variant="outline" size="sm" onClick={addHelpLink}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Link
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      {helpLinks.map((link, index) => (
                        <div key={index} className="flex gap-3 p-3 bg-slate-50/60 dark:bg-slate-950/20 rounded-lg border border-slate-200 dark:border-slate-800/50">
                          <div className="flex-1">
                            <Input
                              placeholder="Link title"
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
                  </div>

                  {/* Video Links */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <Label className="font-medium flex items-center gap-2">
                        <Video className="h-4 w-4" />
                        Tutorial Videos
                      </Label>
                      <Button type="button" variant="outline" size="sm" onClick={addVideoLink}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Video
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      {videoLinks.map((link, index) => (
                        <div key={index} className="flex gap-3 p-3 bg-slate-50/60 dark:bg-slate-950/20 rounded-lg border border-slate-200 dark:border-slate-800/50">
                          <div className="flex-1">
                            <Input
                              placeholder="Video title"
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
                  </div>
                </CardContent>
              </Card>

              {/* Troubleshooting */}
              <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-800/50 dark:bg-amber-950/20 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
                      <AlertTriangle className="h-5 w-5" />
                      Common Issues & Solutions
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={addTroubleshootingItem}
                      className="border-amber-300 text-amber-700 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-300">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Issue
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {troubleshootingItems.map((item, index) => (
                      <div key={index} className="p-4 bg-white/60 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800/50">
                        <div className="space-y-3">
                          <div className="flex gap-3">
                            <div className="flex-1">
                              <Label className="mb-2 block text-sm font-medium flex items-center gap-2">
                                <span className="bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 text-xs px-2 py-1 rounded-full font-medium">
                                  Issue
                                </span>
                                Issue Title
                              </Label>
                              <Input
                                placeholder="e.g., 401 Unauthorized Error"
                                value={item.issue}
                                onChange={(e) => updateTroubleshootingItem(index, 'issue', e.target.value)}
                                className="bg-white/80 dark:bg-amber-950/30"
                              />
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeTroubleshootingItem(index)}
                              disabled={troubleshootingItems.length === 1}
                              className="mt-6 text-amber-600 hover:text-amber-800 hover:bg-amber-100 dark:text-amber-400"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div>
                            <Label className="mb-2 block text-sm font-medium">Solution</Label>
                            <Textarea
                              placeholder="Solution steps and explanation..."
                              value={item.solution}
                              onChange={(e) => updateTroubleshootingItem(index, 'solution', e.target.value)}
                              className="bg-white/80 dark:bg-amber-950/30"
                              rows={3}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Separator className="bg-emerald-200 dark:bg-emerald-800" />

              {/* Action Buttons */}
              <div className="flex justify-between pt-4">
                <Button 
                  type="button" 
                  variant="destructive" 
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="bg-red-500 hover:bg-red-600"
                >
                  {isDeleting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Guide
                    </>
                  )}
                </Button>

                <div className="flex gap-4">
                  <Button type="button" variant="outline" asChild>
                    <Link href={`/dashboard/node-guides/${guide.id}`}>Cancel</Link>
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
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
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}