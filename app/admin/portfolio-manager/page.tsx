'use client';

import { 
  getAllSitesWithStatsAction,
  updateSiteAction,
  deleteSiteAction
} from '@/utils/actions';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Edit, 
  ExternalLink, 
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
  slug: string;
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
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    status: 'COMING_SOON',
    frontendWorkflowJson: ''
  });

  const statusOptions = ['ACTIVE', 'COMING_SOON', 'BETA', 'DISABLED'];

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const sitesResult = await getAllSitesWithStatsAction();
    
    if (sitesResult.success) {
      setSites(sitesResult.sites as Site[]);
    }
  };

  const handleSubmit = async () => {
    if (!editingSite) return;
    
    setIsLoading(true);
    
    try {
      // Update site status using dedicated API route
      const statusResponse = await fetch('/api/admin/update-site-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          siteId: editingSite.id, 
          status: formData.status 
        })
      });
      
      const statusResult = await statusResponse.json();
      
      if (!statusResult.success) {
        alert(statusResult.error || 'Error updating site status');
        setIsLoading(false);
        return;
      }

      // Update frontend workflow JSON if provided
      if (formData.frontendWorkflowJson?.trim()) {
        const result = await updateSiteAction(editingSite.id, {
          slug: editingSite.slug,
          name: editingSite.name,
          description: editingSite.description,
          siteUrl: editingSite.siteUrl,
          requiredCredentials: editingSite.requiredCredentials,
          category: editingSite.category,
          difficulty: editingSite.difficulty,
          estimatedTime: editingSite.estimatedTime,
          workflowId: editingSite.workflowId,
          frontendWorkflowJson: formData.frontendWorkflowJson
        });
        
        if (!result.success) {
          alert(result.message || 'Error updating workflow template');
          setIsLoading(false);
          return;
        }
      }
      
      // Success
      setShowForm(false);
      setEditingSite(null);
      resetForm();
      await loadData();
      alert('Site updated successfully!');
      
    } catch (error) {
      alert('Error updating site');
      console.error(error);
    }
    
    setIsLoading(false);
  };

  const handleEdit = (site: Site) => {
    setEditingSite(site);
    setFormData({
      status: site.status,
      frontendWorkflowJson: ''
    });
    setShowForm(true);
  };

  const handleDelete = async (siteId: string, slug: string) => {
    if (!confirm(`Are you sure you want to delete "${slug}"? This will also remove all user configurations for this site.`)) {
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
      status: 'COMING_SOON',
      frontendWorkflowJson: ''
    });
  };


  if (showForm) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-semibold">
              Edit Site: {editingSite?.name}
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
                Configure site status and provide optional student template
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Site Status */}
              <div>
                <label className="block text-sm font-medium mb-2">Site Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({...prev, status: e.target.value}))}
                  className="w-full px-3 py-2 border rounded-lg bg-background"
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
                <p className="text-xs text-muted-foreground mt-1">
                  Controls whether users can access this site
                </p>
              </div>

              {/* Required Credentials - Hardcoded */}
              <div>
                <label className="block text-sm font-medium mb-2">Required Credentials</label>
                <div className="flex items-center gap-2">
                  <Badge variant="default">webhook</Badge>
                  <span className="text-sm text-muted-foreground">
                    All sites require a webhook URL to connect to n8n
                  </span>
                </div>
              </div>

              {/* Frontend Workflow JSON */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Student Workflow Template (n8n JSON)
                </label>
                <p className="text-xs text-muted-foreground mb-3">
                  Pre-configured n8n workflow JSON that students can copy and import into their n8n instance. 
                  Include placeholder credentials that students will replace with their own API keys.
                </p>
                <textarea
                  value={formData.frontendWorkflowJson}
                  onChange={(e) => setFormData(prev => ({...prev, frontendWorkflowJson: e.target.value}))}
                  placeholder='{"nodes": [...], "connections": {...}}'
                  rows={8}
                  className="w-full px-3 py-2 border rounded-lg bg-background font-mono text-xs"
                />
                <div className="flex gap-2 mt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      try {
                        if (formData.frontendWorkflowJson) {
                          const formatted = JSON.stringify(
                            JSON.parse(formData.frontendWorkflowJson), 
                            null, 
                            2
                          );
                          setFormData(prev => ({...prev, frontendWorkflowJson: formatted}));
                        }
                      } catch (e) {
                        alert('Invalid JSON format');
                      }
                    }}
                  >
                    Format JSON
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setFormData(prev => ({...prev, frontendWorkflowJson: ''}))}
                  >
                    Clear
                  </Button>
                </div>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full"
                size="lg"
              >
                {isLoading ? 'Updating...' : 'Update Site'}
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
                <p className="text-sm text-muted-foreground">
                  Sites are automatically created when workflows are added.
                </p>
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
                          <code className="bg-muted px-1 rounded">{site.slug}</code>
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
                        onClick={() => handleDelete(site.id, site.slug)}
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