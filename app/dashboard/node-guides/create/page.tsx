// app/dashboard/node-guides/create/page.tsx
"use client";

import { createNodeSetupGuideAction } from "@/utils/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, BookOpen, Save } from "lucide-react";
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
    helpLinks: '',
    credentialNameHint: ''
  });

  // Auto-generate guide title when host changes
  useEffect(() => {
    if (formData.hostIdentifier && !formData.guideTitle) {
      const serviceName = formData.hostIdentifier.replace('api.', '').split('.')[0];
      const capitalizedName = serviceName.charAt(0).toUpperCase() + serviceName.slice(1);
      setFormData(prev => ({
        ...prev,
        guideTitle: `How to Connect to ${capitalizedName}`
      }));
    }
  }, [formData.hostIdentifier]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataObj = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataObj.append(key, value);
      });

      const result = await createNodeSetupGuideAction({}, formDataObj);
      
      if (result.success) {
        toast.success(result.message);
        // Redirect to guides dashboard
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
                    <Input
                      id="authType"
                      value={formData.authType}
                      onChange={(e) => handleChange('authType', e.target.value)}
                      placeholder="e.g., httpCustomAuth, apiKey, oauth"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="guideType">Guide Type</Label>
                    <Select value={formData.guideType} onValueChange={(value) => handleChange('guideType', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CREDENTIALS">Credentials Setup</SelectItem>
                        <SelectItem value="PARAMETERS">Parameters Guide</SelectItem>
                        <SelectItem value="WEBHOOK_SETUP">Webhook Setup</SelectItem>
                        <SelectItem value="OAUTH_FLOW">OAuth Flow</SelectItem>
                        <SelectItem value="TROUBLESHOOTING">Troubleshooting</SelectItem>
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
                    rows={6}
                  />
                </div>

                <div>
                  <Label htmlFor="helpLinks">Help Links (JSON Format)</Label>
                  <Textarea
                    id="helpLinks"
                    value={formData.helpLinks}
                    onChange={(e) => handleChange('helpLinks', e.target.value)}
                    placeholder='[{"name": "ElevenLabs API Documentation", "url": "https://docs.elevenlabs.io"}]'
                    rows={4}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Format: Array of objects with "name" and "url" properties
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