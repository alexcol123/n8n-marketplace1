// app/dashboard/node-guides/create/page.tsx
"use client";

import { createNodeSetupGuideAction } from "@/utils/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, BookOpen, Save, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function CreateNodeGuidePage() {
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Pre-populate from URL params if available
  const [formData, setFormData] = useState({
    nodeType: searchParams.get('nodeType') || '',
    hostIdentifier: searchParams.get('hostIdentifier') || '',
    authType: searchParams.get('authType') || '',
    guideType: 'CREDENTIALS',
    guideTitle: '',
    guideVideoUrl: '',
    helpText: '',
    credentialNameHint: ''
  });

  // Separate state for help links (easier to manage)
  const [helpLinks, setHelpLinks] = useState([{ name: '', url: '' }]);

  // Auto-generate guide title based on guide type and host
  useEffect(() => {
    if (formData.hostIdentifier && (!formData.guideTitle || formData.guideTitle.startsWith('How to'))) {
      const serviceName = formData.hostIdentifier.replace('api.', '').split('.')[0];
      const capitalizedName = serviceName.charAt(0).toUpperCase() + serviceName.slice(1);
      
      let titlePrefix = '';
      switch (formData.guideType) {
        case 'CREDENTIALS':
          titlePrefix = 'How to Connect to';
          break;
        case 'TROUBLESHOOTING':
          titlePrefix = 'Troubleshooting';
          break;
        case 'PARAMETERS':
          titlePrefix = 'Understanding';
          break;
        case 'WEBHOOK_SETUP':
          titlePrefix = 'Setting up Webhooks for';
          break;
        default:
          titlePrefix = 'How to Connect to';
      }
      
      setFormData(prev => ({
        ...prev,
        guideTitle: `${titlePrefix} ${capitalizedName}`
      }));
    }
  }, [formData.hostIdentifier, formData.guideType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataObj = new FormData();
      
      // Add basic form data
      Object.entries(formData).forEach(([key, value]) => {
        formDataObj.append(key, value);
      });

      // Convert help links to JSON
      const validHelpLinks = helpLinks.filter(link => link.name.trim() && link.url.trim());
      if (validHelpLinks.length > 0) {
        formDataObj.append('helpLinks', JSON.stringify(validHelpLinks));
      }

      const result = await createNodeSetupGuideAction({}, formDataObj);
      
      if (result.success) {
        toast.success(result.message);
        window.location.href = '/dashboard/node-guides';
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to create setup guide');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addHelpLink = () => {
    setHelpLinks(prev => [...prev, { name: '', url: '' }]);
  };

  const removeHelpLink = (index: number) => {
    setHelpLinks(prev => prev.filter((_, i) => i !== index));
  };

  const updateHelpLink = (index: number, field: 'name' | 'url', value: string) => {
    setHelpLinks(prev => prev.map((link, i) => 
      i === index ? { ...link, [field]: value } : link
    ));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/node-guides">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Guides
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Create Setup Guide</h1>
            <p className="text-muted-foreground">
              Create a helpful setup guide for this API integration
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6">
            {/* API Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  API Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nodeType">Node Type</Label>
                    <Input
                      id="nodeType"
                      value={formData.nodeType}
                      onChange={(e) => handleChange('nodeType', e.target.value)}
                      placeholder="e.g., n8n-nodes-base.httpRequest"
                      required
                      className="font-mono text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="hostIdentifier">Host/Service</Label>
                    <Input
                      id="hostIdentifier"
                      value={formData.hostIdentifier}
                      onChange={(e) => handleChange('hostIdentifier', e.target.value)}
                      placeholder="e.g., api.elevenlabs.io"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="authType">Authentication Type</Label>
                    <Select value={formData.authType} onValueChange={(value) => handleChange('authType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select auth type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="apiKey">API Key</SelectItem>
                        <SelectItem value="httpHeaderAuth">HTTP Header Auth</SelectItem>
                        <SelectItem value="oauth">OAuth</SelectItem>
                        <SelectItem value="httpBasicAuth">Basic Auth</SelectItem>
                        <SelectItem value="httpCustomAuth">Custom Auth</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="guideType">Guide Type</Label>
                    <Select value={formData.guideType} onValueChange={(value) => handleChange('guideType', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CREDENTIALS">🔐 Credentials Setup</SelectItem>
                        <SelectItem value="PARAMETERS">⚙️ Parameters Guide</SelectItem>
                        <SelectItem value="WEBHOOK_SETUP">🔗 Webhook Setup</SelectItem>
                        <SelectItem value="TROUBLESHOOTING">🔧 Troubleshooting</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Guide Content */}
            <Card>
              <CardHeader>
                <CardTitle>Guide Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="guideTitle">Guide Title</Label>
                  <Input
                    id="guideTitle"
                    value={formData.guideTitle}
                    onChange={(e) => handleChange('guideTitle', e.target.value)}
                    placeholder="e.g., How to Connect to ElevenLabs"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="credentialNameHint">Credential Name Hint</Label>
                  <Input
                    id="credentialNameHint"
                    value={formData.credentialNameHint}
                    onChange={(e) => handleChange('credentialNameHint', e.target.value)}
                    placeholder="e.g., ElevenLabs API Key"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Suggested name for the credential in n8n
                  </p>
                </div>

                <div>
                  <Label htmlFor="guideVideoUrl">Tutorial Video URL (Optional)</Label>
                  <Input
                    id="guideVideoUrl"
                    type="url"
                    value={formData.guideVideoUrl}
                    onChange={(e) => handleChange('guideVideoUrl', e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>

                <div>
                  <Label htmlFor="helpText">Setup Instructions</Label>
                  <Textarea
                    id="helpText"
                    value={formData.helpText}
                    onChange={(e) => handleChange('helpText', e.target.value)}
                    placeholder="Step-by-step instructions for setting up this integration..."
                    rows={8}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Write clear, step-by-step instructions. Use numbered lists for best readability.
                  </p>
                </div>

                {/* Improved Help Links Section */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Label>Help Links</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addHelpLink}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Link
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {helpLinks.map((link, index) => (
                      <div key={index} className="flex gap-2 items-end">
                        <div className="flex-1">
                          <Input
                            placeholder="Link name (e.g., Official Documentation)"
                            value={link.name}
                            onChange={(e) => updateHelpLink(index, 'name', e.target.value)}
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
                        {helpLinks.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeHelpLink(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Add helpful documentation links, API references, or tutorial resources.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" asChild>
                <Link href="/dashboard/node-guides">Cancel</Link>
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>Creating...</>
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