"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Edit3, 
  Trash2, 
  AlertCircle, 
  Monitor,
  Code,
  ExternalLink,
  Wrench,
  Eye,
  CheckCircle,
  Clock,
  BarChart3,
  Workflow,
  MessageSquare
} from "lucide-react";
import Link from "next/link";
import FormBuilder, { FormConfig } from "@/components/(custom)/(admin)/FormBuilder";
import SimpleChatBuilder, { SimpleChatConfig } from "@/components/(custom)/(admin)/SimpleChatBuilder";
import { generateComponentCode } from "@/components/(custom)/(admin)/ComponentGenerator";
import { generateSimpleChatComponentCode } from "@/components/(custom)/(admin)/SimpleChatComponentGenerator";

interface PortfolioSite {
  id: string;
  siteName: string;
  name: string;
  status: 'ACTIVE' | 'COMING_SOON' | 'BETA' | 'DISABLED';
  description: string;
  siteUrl: string;
  hasComponent: boolean;
  componentName?: string;
  createdAt: string;
  workflow?: {
    title: string;
    needsFrontend?: boolean;
    frontendCompleted?: boolean;
    WorkflowTeachingGuide?: {
      title: string;
    };
  };
}

interface ComponentMapping {
  siteName: string;
  componentName: string;
  isActive: boolean;
}

export default function PortfolioManagerPage() {
  const [sites, setSites] = useState<PortfolioSite[]>([]);
  const [components, setComponents] = useState<ComponentMapping[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingComponent, setEditingComponent] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [buildingForm, setBuildingForm] = useState<string | null>(null);
  const [buildingChat, setBuildingChat] = useState<string | null>(null);
  const [showStats, setShowStats] = useState(true);

  // Generate component name based on site name
  const generateComponentName = (siteName: string) => {
    const cleanName = siteName
      .split('-')
      .map(word => {
        // Remove leading numbers and ensure first char is letter
        const cleanWord = word.replace(/^[0-9]+/, '');
        return cleanWord.charAt(0).toUpperCase() + cleanWord.slice(1);
      })
      .filter(word => word) // Remove empty words
      .join('');
    
    // Ensure the component name starts with a letter
    const finalName = cleanName || 'Custom';
    return finalName + 'Form';
  };

  // Generate chat component name based on site name
  const generateChatComponentName = (siteName: string) => {
    const cleanName = siteName
      .split('-')
      .map(word => {
        const cleanWord = word.replace(/^[0-9]+/, '');
        return cleanWord.charAt(0).toUpperCase() + cleanWord.slice(1);
      })
      .filter(word => word)
      .join('');
    
    const finalName = cleanName || 'Custom';
    return finalName + 'Chat';
  };

  useEffect(() => {
    loadSites();
    loadComponentMappings();
  }, []);

  const loadSites = async () => {
    try {
      const response = await fetch('/api/admin/portfolio-sites');
      if (response.ok) {
        const data = await response.json();
        setSites(data);
      }
    } catch (error) {
      console.error('Error loading sites:', error);
    }
  };

  const loadComponentMappings = async () => {
    try {
      const response = await fetch('/api/admin/component-mappings');
      if (response.ok) {
        const data = await response.json();
        setComponents(data);
      }
    } catch (error) {
      console.error('Error loading component mappings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateComponentMapping = async (siteName: string, componentName: string) => {
    try {
      const response = await fetch('/api/admin/component-mappings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteName, componentName })
      });

      if (response.ok) {
        setMessage({ type: 'success', text: `Component mapping updated for ${siteName}` });
        loadComponentMappings();
        setEditingComponent(null);
      } else {
        throw new Error('Failed to update mapping');
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to update component mapping' });
    }
  };

  const handleFormBuilderSave = async (siteName: string, config: FormConfig) => {
    try {
      // Generate the component code with valid name
      const { componentCode, validComponentName } = generateComponentCode(config, '', siteName);
      
      // Save the component file
      const response = await fetch('/api/admin/save-component', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          siteName, 
          componentName: validComponentName, 
          componentCode,
          formConfig: config 
        })
      });

      if (response.ok) {
        // Update the component mapping
        await updateComponentMapping(siteName, validComponentName);
        setBuildingForm(null);
        setMessage({ type: 'success', text: `Form component ${validComponentName} generated and saved for ${siteName}!` });
      } else {
        throw new Error('Failed to save component');
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to generate form component' });
    }
  };

  const handleChatBuilderSave = async (siteName: string, config: SimpleChatConfig) => {
    try {
      // Generate the chat component code with valid name
      const { componentCode, validComponentName } = generateSimpleChatComponentCode(config, siteName);
      
      // Save the component file
      const response = await fetch('/api/admin/save-component', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          siteName, 
          componentName: validComponentName, 
          componentCode,
          chatConfig: config 
        })
      });

      if (response.ok) {
        // Update the component mapping
        await updateComponentMapping(siteName, validComponentName);
        setBuildingChat(null);
        setMessage({ type: 'success', text: `Chat component ${validComponentName} generated and saved for ${siteName}!` });
      } else {
        throw new Error('Failed to save component');
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to generate chat component' });
    }
  };

  const removeComponentMapping = async (siteName: string) => {
    try {
      const response = await fetch(`/api/admin/component-mappings?siteName=${siteName}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setMessage({ type: 'success', text: `Component mapping removed for ${siteName}` });
        loadComponentMappings();
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to remove component mapping' });
    }
  };

  const updateSiteStatus = async (siteId: string, status: string) => {
    try {
      const response = await fetch('/api/admin/update-site-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteId, status })
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Site status updated successfully' });
        loadSites();
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to update site status' });
    }
  };

  const getSiteComponent = (siteName: string) => {
    return components.find(c => c.siteName === siteName);
  };

  // Calculate stats for overview
  const stats = {
    total: sites.length,
    active: sites.filter(s => s.status === 'ACTIVE').length,
    comingSoon: sites.filter(s => s.status === 'COMING_SOON').length,
    beta: sites.filter(s => s.status === 'BETA').length,
    withComponents: sites.filter(s => getSiteComponent(s.siteName)).length,
    withTutorials: sites.filter(s => s.workflow).length
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto mb-4"></div>
            <p>Loading portfolio sites...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Portfolio Manager</h1>
            <p className="text-muted-foreground">
              Complete portfolio site management with form builder and analytics
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setShowStats(!showStats)}
            className="gap-2"
          >
            <BarChart3 className="h-4 w-4" />
            {showStats ? 'Hide Stats' : 'Show Stats'}
          </Button>
        </div>
      </div>

      {/* Portfolio Stats Overview */}
      {showStats && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50 border-blue-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">{stats.total}</div>
              <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">Total Sites</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50 border-green-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-700 dark:text-green-300">{stats.active}</div>
              <div className="text-xs text-green-600 dark:text-green-400 font-medium">Active</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/50 dark:to-amber-900/50 border-amber-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">{stats.comingSoon}</div>
              <div className="text-xs text-amber-600 dark:text-amber-400 font-medium">Coming Soon</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50 border-purple-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">{stats.beta}</div>
              <div className="text-xs text-purple-600 dark:text-purple-400 font-medium">Beta</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950/50 dark:to-indigo-900/50 border-indigo-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">{stats.withComponents}</div>
              <div className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">With Forms</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/50 border-orange-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">{stats.withTutorials}</div>
              <div className="text-xs text-orange-600 dark:text-orange-400 font-medium">With Tutorials</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Success/Error Message */}
      {message && (
        <Alert className={`mb-6 ${message.type === 'error' ? 'border-red-500' : 'border-green-500'}`}>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className={message.type === 'error' ? 'text-red-700' : 'text-green-700'}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      {/* Sites Management */}
      <div className="space-y-6">
        {sites.map((site) => {
          const component = getSiteComponent(site.siteName);
          const isEditing = editingComponent === site.siteName;
          
          return (
            <Card key={site.id} className="relative">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">
                        {site.workflow?.WorkflowTeachingGuide?.title || site.name}
                      </h3>
                      
                      {/* Status Badge */}
                      <Badge variant={
                        site.status === 'ACTIVE' ? 'default' :
                        site.status === 'BETA' ? 'secondary' :
                        'outline'
                      }>
                        {site.status === 'COMING_SOON' ? 'Coming Soon' : site.status}
                      </Badge>

                      {/* Component Status */}
                      {component ? (
                        <Badge variant="default" className="bg-green-600">
                          <Code className="h-3 w-3 mr-1" />
                          {component.componentName}
                        </Badge>
                      ) : (
                        <Badge variant="outline">
                          No Component
                        </Badge>
                      )}
                    </div>
                    
                    <div className="space-y-1 mb-2">
                      <p className="text-sm text-muted-foreground">
                        Site: <code className="bg-muted px-1 rounded">{site.siteName}</code> • 
                        Created: {new Date(site.createdAt).toLocaleDateString()}
                      </p>
                      {site.workflow && (
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            <Workflow className="h-3 w-3 mr-1" />
                            Connected Tutorial
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {site.workflow.WorkflowTeachingGuide?.title || site.workflow.title}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      {site.description}
                    </p>

                    {/* Frontend Status Indicator */}
                    {site.workflow && (
                      <div className="mt-2 flex items-center gap-2">
                        <Badge variant={site.workflow.frontendCompleted ? 'default' : 'outline'} className="text-xs">
                          {site.workflow.frontendCompleted ? (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Frontend Built
                            </>
                          ) : site.workflow.needsFrontend ? (
                            <>
                              <Clock className="h-3 w-3 mr-1" />
                              Needs Frontend
                            </>
                          ) : (
                            <>
                              <Eye className="h-3 w-3 mr-1" />
                              No Frontend Required
                            </>
                          )}
                        </Badge>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Link href={site.siteUrl} target="_blank">
                      <Button size="sm" variant="outline">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        View
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Component Management */}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium mb-1">Component Mapping</h4>
                      <p className="text-xs text-muted-foreground">
                        Auto-generate site-specific component: {generateComponentName(site.siteName)}
                      </p>
                    </div>

                    {!isEditing && buildingForm !== site.siteName && buildingChat !== site.siteName ? (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setBuildingForm(site.siteName)}
                        >
                          <Wrench className="h-3 w-3 mr-1" />
                          {component ? 'Edit Form' : 'Build Form'}
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setBuildingChat(site.siteName)}
                        >
                          <MessageSquare className="h-3 w-3 mr-1" />
                          Build Chat
                        </Button>
                        
                        {component && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeComponentMapping(site.siteName)}
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Remove
                          </Button>
                        )}

                        {/* Status Toggle */}
                        <Select
                          value={site.status}
                          onValueChange={(value) => updateSiteStatus(site.id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="COMING_SOON">Coming Soon</SelectItem>
                            <SelectItem value="ACTIVE">Active</SelectItem>
                            <SelectItem value="BETA">Beta</SelectItem>
                            <SelectItem value="DISABLED">Disabled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    ) : buildingForm === site.siteName ? (
                      <div className="mt-4">
                        <FormBuilder
                          siteName={site.siteName}
                          workflowTitle={site.workflow?.WorkflowTeachingGuide?.title || site.name}
                          onSave={(config) => handleFormBuilderSave(site.siteName, config)}
                          onCancel={() => setBuildingForm(null)}
                        />
                      </div>
                    ) : buildingChat === site.siteName ? (
                      <div className="mt-4">
                        <SimpleChatBuilder
                          siteName={site.siteName}
                          workflowTitle={site.workflow?.WorkflowTeachingGuide?.title || site.name}
                          onSave={(config) => handleChatBuilderSave(site.siteName, config)}
                          onCancel={() => setBuildingChat(null)}
                        />
                      </div>
                    ) : null}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {sites.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Monitor className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">No portfolio sites found</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Instructions */}
      <Card className="mt-8 bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800">
        <CardContent className="p-6">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            💡 How to Use This Manager
          </h3>
          <div className="text-sm text-blue-700 dark:text-blue-300 space-y-2">
            <p><strong>1. Add Component:</strong> Each site gets its own unique component auto-generated from the site name</p>
            <p><strong>2. Component Names:</strong> Site names like &quot;never-run-out-of-stock&quot; become &quot;NeverRunOutOfStockForm&quot;</p>
            <p><strong>3. Change Status:</strong> Set to &quot;Active&quot; when component is ready, &quot;Coming Soon&quot; for placeholder</p>
            <p><strong>4. Safe Updates:</strong> No code editing required - everything updates automatically</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}