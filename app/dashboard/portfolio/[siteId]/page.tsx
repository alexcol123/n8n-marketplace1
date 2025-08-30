"use client";

import { useState, useEffect } from "react";
import { notFound } from "next/navigation";

interface PortfolioPageProps {
  params: Promise<{
    siteId: string;
  }>;
}


// Dynamic component loading - components are managed by admin panel

// Coming Soon component for sites without forms yet
function ComingSoonTemplate({ site }: { site: any }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-card rounded-lg shadow-2xl border-primary/20 p-8 text-center">
        <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <span className="text-3xl">🚀</span>
        </div>
        
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-4">
          {site.name} - Coming Soon!
        </h1>
        
        <p className="text-lg text-muted-foreground mb-6">
          We&apos;re building something amazing! This frontend is currently under development.
        </p>
        
        <div className="bg-primary/5 rounded-lg p-6 mb-6">
          <h3 className="font-semibold mb-2">What&apos;s Coming</h3>
          <p className="text-sm text-muted-foreground">
            A fully functional frontend connected to your n8n workflow, ready to deploy and monetize.
          </p>
        </div>

        <div className="pt-6 border-t">
          <p className="text-center text-xs text-muted-foreground">
            Frontend ID: <code className="bg-muted px-2 py-1 rounded">{site.siteName}</code>
          </p>
        </div>
      </div>
    </div>
  );
}

interface ComponentMapping {
  siteName: string;
  componentName: string;
  isActive: boolean;
}

export default function DynamicPortfolioPage({ params }: PortfolioPageProps) {
  const [site, setSite] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [componentMapping, setComponentMapping] = useState<ComponentMapping | null>(null);
  const [PortfolioComponent, setPortfolioComponent] = useState<React.ComponentType<any> | null>(null);

  useEffect(() => {
    async function loadSiteAndComponent() {
      try {
        setLoading(true);
        const { siteId } = await params;
        
        // Load site data
        const siteResponse = await fetch(`/api/sites/${siteId}`);
        
        if (!siteResponse.ok) {
          if (siteResponse.status === 404) {
            setError("Site not found");
            return;
          }
          throw new Error('Failed to load site');
        }
        
        const siteData = await siteResponse.json();
        setSite(siteData);
        
        // Load component mapping
        try {
          const mappingResponse = await fetch('/api/admin/component-mappings');
          if (mappingResponse.ok) {
            const mappings: ComponentMapping[] = await mappingResponse.json();
            const mapping = mappings.find(m => m.siteName === siteId && m.isActive);
            
            if (mapping) {
              setComponentMapping(mapping);
              
              // Dynamically import the component
              try {
                const componentModule = await import(`@/components/portfolio-templates/${mapping.componentName}`);
                setPortfolioComponent(() => componentModule.default);
              } catch {
                console.warn(`Component ${mapping.componentName} not found, will show coming soon template`);
                setPortfolioComponent(null);
              }
            }
          }
        } catch (mappingError) {
          console.warn('Failed to load component mapping:', mappingError);
        }
        
      } catch (err) {
        console.error('Error loading site:', err);
        setError(err instanceof Error ? err.message : 'Failed to load site');
      } finally {
        setLoading(false);
      }
    }

    loadSiteAndComponent();
  }, [params]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !site) {
    return notFound();
  }

  // If no component exists yet, show coming soon
  if (!PortfolioComponent) {
    return <ComingSoonTemplate site={site} />;
  }

  // Render the actual portfolio component
  return (
    <PortfolioComponent 
      siteName={site.siteName}
      // Pass any additional props the component needs
    />
  );
}