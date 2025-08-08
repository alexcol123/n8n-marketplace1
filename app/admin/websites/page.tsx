'use client';

import { createSiteAction, getAllSitesAction } from '@/utils/actions';
import Link from 'next/link';
import { useState, useEffect } from 'react';



export default function AdminWebsitesPage() {
  const [showForm, setShowForm] = useState(false);
  const [sites, setSites] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    siteName: '',
    name: '',
    description: '',
    siteUrl: '',
    requiredCredentials: ['webhook']
  });

  const credentialOptions = ['webhook', 'endwebhook', 'openai_api_key', 'stripe_key', 'hedra_api_key'];

  // Load sites on component mount
  useEffect(() => {
    loadSites();
  }, []);

  const loadSites = async () => {
    const result = await getAllSitesAction();
    if (result.success) {
      setSites(result.sites);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    
    const result = await createSiteAction(formData);
    
    if (result.success) {
      setShowForm(false);
      setFormData({
        siteName: '',
        name: '',
        description: '',
        siteUrl: '',
        requiredCredentials: ['webhook']
      });
      // Reload sites
      await loadSites();
      alert('Site added successfully!');
    } else {
      alert(result.message);
    }
    
    setIsLoading(false);
  };

  const toggleCredential = (cred) => {
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
            <h1 className="text-3xl font-semibold">Add New Site</h1>
            <button 
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border rounded-lg hover:bg-muted"
            >
              Cancel
            </button>
          </div>

          <div className="bg-card border rounded-lg p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Site Name (URL)</label>
                <input
                  value={formData.siteName}
                  onChange={(e) => setFormData(prev => ({...prev, siteName: e.target.value}))}
                  placeholder="chatbot, video-generator, form-builder"
                  className="w-full px-3 py-2 border rounded-lg bg-background"
                />
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
                placeholder="Build an intelligent chatbot that handles customer inquiries..."
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

            <div>
              <label className="block text-sm font-medium mb-2">Required Credentials</label>
              <div className="flex flex-wrap gap-2">
                {credentialOptions.map(cred => (
                  <button
                    key={cred}
                    onClick={() => toggleCredential(cred)}
                    className={`px-3 py-1 rounded-lg border text-sm ${
                      formData.requiredCredentials.includes(cred)
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-background hover:bg-muted'
                    }`}
                  >
                    {cred}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:bg-primary/90 disabled:opacity-50"
            >
              {isLoading ? 'Adding...' : 'Add Site'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold">Website Management</h1>
          <button 
            onClick={() => setShowForm(true)}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            Add New Site
          </button>
        </div>

        <div className="grid gap-4">
          {sites.map(site => (
            <div key={site.id} className="bg-card border rounded-lg p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold">{site.name}</h3>
                    <span className={`px-2 py-1 text-xs rounded-lg ${
                      site.status === 'ACTIVE' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                    }`}>
                      {site.status}
                    </span>
                  </div>
                  
                  <p className="text-muted-foreground mb-3">{site.description}</p>
                  
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>📁 {site.siteName}</span>
                    <Link
                      href={site.siteUrl} 
                      className="text-primary hover:text-primary/80 underline cursor-pointer"
                    >
                      🔗 {site.siteUrl}
                    </Link>
                  </div>
                  
                  <div className="mt-2">
                    <span className="text-sm text-muted-foreground">Required: </span>
                    {site.requiredCredentials.map(cred => (
                      <span key={cred} className="inline-block bg-muted px-2 py-1 rounded text-xs mr-1">
                        {cred}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button className="px-3 py-1 border rounded hover:bg-muted text-sm">
                    Edit
                  </button>
                  <Link 
                    href={site.siteUrl}
                    className="px-3 py-1 border rounded hover:bg-muted text-sm bg-background inline-block"
                  >
                    View Site
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}