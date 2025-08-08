import { fetchProfile } from "@/utils/actions";
import { getAllSitesAction, getUserCredentialsAction } from "@/utils/actions";

// Add this interface above the component
interface UserProfile {
  id: string;
  clerkId: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  profileImage: string;
  bio: string;
  lastWorkflowId: string;
  lastViewedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

// app/dashboard/portfolio/page.tsx

export default async function UserPortfolioPage() {
  // Get the profile data
  const profile = (await fetchProfile()) as UserProfile;
  
  // Get all available sites from database
  const sitesResult = await getAllSitesAction();
  const availableSites = sitesResult.success ? sitesResult.sites : [];

  return (
    <div className="min-h-screen bg-background text-foreground py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <img 
            src={profile.profileImage} 
            alt={`${profile.firstName} ${profile.lastName}`}
            className="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-border"
          />
          <h1 className="text-4xl font-semibold mb-4">
            {profile.firstName} {profile.lastName}
          </h1>
          <p className="text-xl text-muted-foreground mb-2">@{profile.username}</p>
          <p className="text-muted-foreground">Automation Specialist</p>
          {profile.bio && (
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">{profile.bio}</p>
          )}
        </div>

        {/* Services Grid - REAL DATA FROM DATABASE */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {availableSites.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No sites available yet.</p>
              <p className="text-sm text-muted-foreground mt-2">
                Sites will appear here as they're added by admin.
              </p>
            </div>
          ) : (
            availableSites.map((site) => (
              <SiteCard key={site.id} site={site} />
            ))
          )}
        </div>

        {/* Contact Section */}
        <div className="bg-card border rounded-lg shadow-sm p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">
            Ready to Work Together?
          </h2>
          <p className="text-muted-foreground mb-6">
            Get in touch to discuss your automation needs
          </p>
          <button className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors">
            Contact {profile.firstName}
          </button>
        </div>
      </div>
    </div>
  );
}

// Site Card Component (can be in same file for now)
async function SiteCard({ site }) {
  // Check if user has configured this site
  const userCredsResult = await getUserCredentialsAction(site.siteName);
  const isConfigured = userCredsResult.success && userCredsResult.isConfigured;

  return (
    <div className="bg-card border rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-semibold">
          {site.name}
        </h3>
        <span className={`px-2 py-1 text-xs rounded-lg ${
          isConfigured 
            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
            : 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
        }`}>
          {isConfigured ? '✅ Ready' : '⚙️ Setup Needed'}
        </span>
      </div>
      
      <p className="text-muted-foreground mb-4">
        {site.description}
      </p>
      
      <div className="flex gap-2">
        {isConfigured ? (
          <a 
            href={site.siteUrl}
            className="inline-block bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90 transition-colors"
          >
            View Demo →
          </a>
        ) : (
          <a 
            href={`${site.siteUrl}?setup=true`}
            className="inline-block bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90 transition-colors"
          >
            Configure →
          </a>
        )}
      </div>
    </div>
  );
}