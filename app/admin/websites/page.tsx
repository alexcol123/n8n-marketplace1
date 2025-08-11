'use client';

import { 
  createSiteAction, 
  getAllSitesWithStatsAction,
  updateSiteAction,
  deleteSiteAction,
  getAllWorkflowsForSiteSelectionAction
} from '@/utils/actions';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Edit, 
  ExternalLink, 
  Plus, 
  Trash2, 
  Users, 
  Eye, 
  TrendingUp,
  Workflow,
  Settings,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface Site {
  id: string;
  siteName: string;
  name: string;
  description: string;
  siteUrl: string;
  category?: string;
  difficulty?: string;
  estimatedTime?: string;
  status: string;
  sortOrder: number;
  viewCount: number;
  completeCount: number;
  requiredCredentials: string[];
  workflowId?: string;
  workflow?: {
    id: string;
    title: string;
    category: string;
    verifiedAndTested: boolean;
  };
  _count?: {
    userCredentials: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

interface Workflow {
  id: string;
  title: string;
  category: string;
  verifiedAndTested: boolean;
  slug: string;
}

export default function AdminWebsitesPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingSite, setEditingSite] = useState<Site | null>(null);
  const [sites, setSites] = useState<Site[]>([]);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    siteName: '',
    name: '',
    description: '',
    siteUrl: '',
    category: '',
    difficulty: 'Beginner',
    estimatedTime: '',
    requiredCredentials: ['webhook'],
    workflowId: '',
    frontendWorkflowJson: '',
    sortOrder: 0
  });

  const credentialOptions = [
    'webhook', 
    'endwebhook', 
    'openai_api_key', 
    'stripe_key', 
    'hedra_api_key',
    'airtable_api_key',
    'notion_api_key',
    'slack_webhook',
    'discord_webhook'
  ];

  const categoryOptions = [
    'AI & ML',
    'E-commerce', 
    'Marketing',
    'Communication',
    'Data Management',
    'Finance',
    'Content Creation',
    'Customer Service'
  ];

  const difficultyOptions = ['Beginner', 'Intermediate', 'Advanced'];

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [sitesResult, workflowsResult] = await Promise.all([
      getAllSitesWithStatsAction(),
      getAllWorkflowsForSiteSelectionAction()
    ]);
    
    if (sitesResult.success) {
      setSites(sitesResult.sites);
    }
    if (workflowsResult.success) {
      setWorkflows(workflowsResult.workflows);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      let result;
      
      if (editingSite) {
        // Update existing site
        result = await updateSiteAction(editingSite.id, formData);
      } else {
        // Create new site
        result = await createSiteAction(formData);
      }
      
      if (result.success) {
        setShowForm(false);
        setEditingSite(null);
        resetForm();
        await loadData();
        alert(editingSite ? 'Site updated successfully!' : 'Site added successfully!');
      } else {
        alert(result.message || 'Error saving site');
      }
    } catch (error) {
      alert('Error saving site');
      console.error(error);
    }
    
    setIsLoading(false);
  };

  const handleEdit = (site: Site) => {
    setEditingSite(site);
    setFormData({
      siteName: site.siteName,
      name: site.name,
      description: site.description,
      siteUrl: site.siteUrl,
      category: site.category || '',
      difficulty: site.difficulty || 'Beginner',
      estimatedTime: site.estimatedTime || '',
      requiredCredentials: site.requiredCredentials,
      workflowId: site.workflowId || '',
      frontendWorkflowJson: '',
      sortOrder: site.sortOrder
    });
    setShowForm(true);
  };

  const handleDelete = async (siteId: string, siteName: string) => {
    if (!confirm(`Are you sure you want to delete "${siteName}"? This will also remove all user configurations for this site.`)) {
      return;
    }

    const result = await deleteSiteAction(siteId);
    if (result.success) {
      await loadData();
      alert('Site deleted successfully');
    } else {
      alert(result.message || 'Error deleting site');
    }
  };

  const resetForm = () => {
    setFormData({
      siteName: '',
      name: '',
      description: '',
      siteUrl: '',
      category: '',
      difficulty: 'Beginner',
      estimatedTime: '',
      requiredCredentials: ['webhook'],
      workflowId: '',
      frontendWorkflowJson: '',
      sortOrder: 0
    });
  };

  const toggleCredential = (cred: string) => {
    setFormData(prev => ({
      ...prev,
      requiredCredentials: prev.requiredCredentials.includes(cred)
        ? prev.requiredCredentials.filter(c => c !== cred)
        : [...prev.requiredCredentials, cred]
    }));
  };

  if (showForm) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-semibold">
              {editingSite ? 'Edit Site' : 'Add New Site'}
            </h1>
            <Button 
              variant="outline"
              onClick={() => {
                setShowForm(false);
                setEditingSite(null);
                resetForm();
              }}
            >
              Cancel
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Site Configuration</CardTitle>
              <CardDescription>
                Configure the automation site details and requirements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Site Name (URL slug)</label>
                  <input
                    value={formData.siteName}
                    onChange={(e) => setFormData(prev => ({...prev, siteName: e.target.value}))}
                    placeholder="chatbot, video-generator, form-builder"
                    className="w-full px-3 py-2 border rounded-lg bg-background"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Used in URL: /dashboard/portfolio/{formData.siteName}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Display Name</label>
                  <input
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
                    placeholder="AI Customer Support Bot"
                    className="w-full px-3 py-2 border rounded-lg bg-background"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
                  placeholder="Build an intelligent chatbot that handles customer inquiries automatically..."
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg bg-background"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Site URL</label>
                <input
                  value={formData.siteUrl}
                  onChange={(e) => setFormData(prev => ({...prev, siteUrl: e.target.value}))}
                  placeholder="/dashboard/portfolio/chatbot"
                  className="w-full px-3 py-2 border rounded-lg bg-background"
                />
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({...prev, category: e.target.value}))}
                    className="w-full px-3 py-2 border rounded-lg bg-background"
                  >
                    <option value="">Select Category</option>
                    {categoryOptions.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData(prev => ({...prev, difficulty: e.target.value}))}
                    className="w-full px-3 py-2 border rounded-lg bg-background"
                  >
                    {difficultyOptions.map(diff => (
                      <option key={diff} value={diff}>{diff}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Estimated Time</label>
                  <input
                    value={formData.estimatedTime}
                    onChange={(e) => setFormData(prev => ({...prev, estimatedTime: e.target.value}))}
                    placeholder="2 hours, 1 day"
                    className="w-full px-3 py-2 border rounded-lg bg-background"
                  />
                </div>
              </div>

              {/* Workflow Connection */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Connected Workflow (Optional)
                </label>
                <select
                  value={formData.workflowId}
                  onChange={(e) => setFormData(prev => ({...prev, workflowId: e.target.value}))}
                  className="w-full px-3 py-2 border rounded-lg bg-background"
                >
                  <option value="">No workflow connected</option>
                  {workflows.map(workflow => (
                    <option key={workflow.id} value={workflow.id}>
                      {workflow.title} ({workflow.category})
                      {workflow.verifiedAndTested ? ' ✅' : ''}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-muted-foreground mt-1">
                  Link this site to a tutorial workflow for educational content
                </p>
              </div>

              {/* Required Credentials */}
              <div>
                <label className="block text-sm font-medium mb-2">Required Credentials</label>
                <div className="flex flex-wrap gap-2">
                  {credentialOptions.map(cred => (
                    <Button
                      key={cred}
                      type="button"
                      size="sm"
                      variant={formData.requiredCredentials.includes(cred) ? "default" : "outline"}
                      onClick={() => toggleCredential(cred)}
                    >
                      {cred}
                    </Button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Selected: {formData.requiredCredentials.join(', ')}
                </p>
              </div>

              {/* Sort Order */}
              <div>
                <label className="block text-sm font-medium mb-2">Sort Order</label>
                <input
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) => setFormData(prev => ({...prev, sortOrder: parseInt(e.target.value) || 0}))}
                  placeholder="0"
                  className="w-full px-3 py-2 border rounded-lg bg-background"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Lower numbers appear first in the list
                </p>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full"
                size="lg"
              >
                {isLoading 
                  ? (editingSite ? 'Updating...' : 'Adding...') 
                  : (editingSite ? 'Update Site' : 'Add Site')
                }
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-semibold">Website Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage automation portfolio sites and their configurations
            </p>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add New Site
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{sites.length}</p>
                  <p className="text-sm text-muted-foreground">Total Sites</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <div>
                  <p className="text-2xl font-bold">
                    {sites.filter(s => s.status === 'ACTIVE').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Active Sites</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">
                    {sites.reduce((sum, site) => sum + (site._count?.userCredentials || 0), 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">User Configs</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">
                    {sites.reduce((sum, site) => sum + site.viewCount, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Views</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sites List */}
        <div className="space-y-4">
          {sites.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Settings className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Sites Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first automation portfolio site to get started
                </p>
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Site
                </Button>
              </CardContent>
            </Card>
          ) : (
            sites.map(site => (
              <Card key={site.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold">{site.name}</h3>
                        
                        <Badge variant={site.status === 'ACTIVE' ? 'default' : 'secondary'}>
                          {site.status}
                        </Badge>

                        {site.category && (
                          <Badge variant="outline">{site.category}</Badge>
                        )}

                        {site.difficulty && (
                          <Badge variant="outline">{site.difficulty}</Badge>
                        )}

                        {site.workflow && (
                          <Badge variant="outline" className="text-blue-600">
                            <Workflow className="w-3 h-3 mr-1" />
                            Connected
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-muted-foreground mb-3">{site.description}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                        <div>
                          <span className="text-muted-foreground">Slug:</span>
                          <br />
                          <code className="bg-muted px-1 rounded">{site.siteName}</code>
                        </div>
                        <div>
                          <span className="text-muted-foreground">URL:</span>
                          <br />
                          <Link
                            href={site.siteUrl} 
                            className="text-primary hover:underline text-sm"
                          >
                            {site.siteUrl}
                          </Link>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Users:</span>
                          <br />
                          <span className="font-medium">{site._count?.userCredentials || 0}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Views:</span>
                          <br />
                          <span className="font-medium">{site.viewCount}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        <span className="text-sm text-muted-foreground mr-2">Required:</span>
                        {site.requiredCredentials.map(cred => (
                          <Badge key={cred} variant="outline" className="text-xs">
                            {cred}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEdit(site)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        asChild
                      >
                        <Link href={site.siteUrl}>
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      </Button>

                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDelete(site.id, site.name)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}