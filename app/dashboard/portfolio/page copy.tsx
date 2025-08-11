"use client";

import { useState, useEffect } from "react";
import {
  fetchProfile,
  getUserUnconfiguredSitesAction,
  getAllSitesAction,
} from "@/utils/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Mail,
  Calendar,
  Settings,
  CheckCircle,
  Zap,
  Star,
  TrendingUp,
  Plus,
  Grid3X3,
  Target,
  Rocket,
  Eye,
  EyeOff,
  DollarSign,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

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

interface Site {
  id: string;
  siteName: string;
  name: string;
  description: string;
  siteUrl: string;
  category?: string;
  isPopular?: boolean;
  sortOrder?: number;
  difficulty?: string;
  estimatedTime?: string;
  status?: string;
}

interface UserSiteCredential {
  id: string;
  userId: string;
  availableSiteId: string;
  credentials: any;
  isActive: boolean;
  isConfigured: boolean;
  lastUsed?: Date;
  usageCount: number;
  createdAt: Date;
  updatedAt: Date;
  availableSite: Site;
}

export default function UserPortfolioPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [availableSites, setAvailableSites] = useState<Site[]>([]);
  const [configuredSites, setConfiguredSites] = useState<Site[]>([]);
  const [showBrowse, setShowBrowse] = useState(false);
  const [loading, setLoading] = useState(true);




  // Load all data on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Get profile
      const profileData = await fetchProfile();
      setProfile(profileData as UserProfile);

      // OPTIMIZED: Get user's configured sites in ONE query with FK relations
      const userConfiguredResult = await getUserUnconfiguredSitesAction(
        profileData.clerkId
      );


     

    
      const configured = userConfiguredResult.success
        ? userConfiguredResult.configuredSites.map(
            (cred: UserSiteCredential) => cred.availableSite
          )
        : [];

      setConfiguredSites(configured);

      // Get ALL available sites for browse section
      const sitesResult = await getAllSitesAction();
      const allSites = sitesResult.success ? sitesResult.sites : [];
      setAvailableSites(allSites);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function for initials
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`;
  };

  // Get unconfigured sites efficiently
  const unconfiguredSites = availableSites.filter(
    (site) =>
      !configuredSites.some(
        (configured) => configured.id === site.id // Compare by ID instead of siteName
      )
  );

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Enhanced Header with stats */}
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 rounded-3xl blur-3xl" />

          <Card className="relative border-2 border-primary/20 bg-card/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                {/* Profile Image & Basic Info */}
                <div className="flex flex-col items-center text-center lg:text-left">
                  <Avatar className="w-32 h-32 border-4 border-primary/20 shadow-2xl">
                    <AvatarImage
                      src={profile.profileImage}
                      alt={`${profile.firstName} ${profile.lastName}`}
                    />
                    <AvatarFallback className="text-2xl font-bold bg-primary/10">
                      {getInitials(profile.firstName, profile.lastName)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="mt-6">
                    <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
                      {profile.firstName} {profile.lastName}
                    </h1>
                    <p className="text-xl text-muted-foreground mb-2">
                      @{profile.username}
                    </p>
                    <Badge className="text-sm bg-gradient-to-r from-primary to-primary/80 text-white border-0">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      Automation Specialist
                    </Badge>
                  </div>
                </div>

                {/* Stats & Bio */}
                <div className="flex-1 w-full">
                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-200/20 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-emerald-600 mb-1">
                        {configuredSites.length}
                      </div>
                      <div className="text-sm text-emerald-600/80">
                        Automation Solutions
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-200/20 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600 mb-1">
                        {new Date(profile.createdAt).getFullYear()}
                      </div>
                      <div className="text-sm text-blue-600/80">
                        Established
                      </div>
                    </div>
                  </div>

                  {/* Bio Section */}
                  {profile.bio && (
                    <Card className="bg-gradient-to-r from-primary/5 to-transparent border-primary/20">
                      <CardContent className="p-4">
                        <p className="text-muted-foreground leading-relaxed">
                          {profile.bio}
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  {/* Quick Info */}
                  <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {profile.email}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Joined{" "}
                      {new Date(profile.createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content: Configured Sites */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold flex items-center gap-3">
                <Rocket className="w-8 h-8 text-emerald-500" />
                Automation Solutions
              </h2>
              <p className="text-muted-foreground mt-2">
                {configuredSites.length > 0
                  ? "Professional automation solutions designed to streamline business operations"
                  : "Get started with your first automation solution"}
              </p>
            </div>
            {configuredSites.length > 0 && (
              <Badge
                variant="outline"
                className="text-lg px-4 py-2 border-emerald-200"
              >
                {configuredSites.length} Solution
                {configuredSites.length !== 1 ? "s" : ""} Available
              </Badge>
            )}
          </div>

          {/* Configured Sites Grid */}
          {configuredSites.length === 0 ? (
            <Card className="border-2 border-dashed border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <CardContent className="py-12 text-center">
                <Target className="w-16 h-16 text-primary/50 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold mb-4">
                  Ready to Build Your First Solution? 🚀
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Create your first professional automation solution to showcase
                  your expertise to potential clients.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary/90"
                    onClick={() => setShowBrowse(true)}
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Add New Solution
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/dashboard/workflows">
                      <Eye className="w-4 h-4 mr-2" />
                      Browse Workflows First
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                {configuredSites.map((site) => (
                  <ConfiguredSiteCard key={site.id} site={site} />
                ))}
              </div>

              {/* Add more sites button */}
              <div className="text-center">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90"
                  onClick={() => setShowBrowse(true)}
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add New Solution
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Browse Available Sites - Toggle visibility */}
        {showBrowse && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold flex items-center gap-3">
                  <Grid3X3 className="w-6 h-6 text-primary" />
                  Additional Solutions
                </h3>
                <p className="text-muted-foreground mt-1">
                  Expand your service offerings with these automation solutions
                </p>
              </div>
              <Button variant="outline" onClick={() => setShowBrowse(false)}>
                <EyeOff className="w-4 h-4 mr-2" />
                Hide Additional Solutions
              </Button>
            </div>

            {unconfiguredSites.length === 0 ? (
              <Card className="border-2 border-dashed border-emerald-200 bg-emerald-50/30">
                <CardContent className="py-8 text-center">
                  <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2 text-emerald-700">
                    All Solutions Configured! 🎉
                  </h3>
                  <p className="text-emerald-600">
                    You have a complete suite of automation solutions ready for
                    clients! 💪
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {unconfiguredSites.map((site) => (
                  <UnconfiguredSiteCard key={site.id} site={site} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Motivational Message Section - ALWAYS SHOW */}
        <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 via-background to-primary/5 mb-8">
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <CheckCircle className="w-12 h-12 text-primary" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full animate-pulse"></div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-3xl font-bold mb-3 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                STOP BUILDING. START BILLING! 💰
              </h3>
              <p className="text-xl font-semibold text-primary mb-2">
                Your automation skills = Someone else's $3K/month problem SOLVED
              </p>
            </div>

            <div className="bg-primary/10 rounded-xl p-6 mb-6 border border-primary/20">
              <p className="text-lg text-foreground font-medium leading-relaxed">
                {configuredSites.length > 0
                  ? `You've built ${
                      configuredSites.length
                    } professional automation solution${
                      configuredSites.length !== 1 ? "s" : ""
                    }. That's ${
                      configuredSites.length * 2
                    }+ hours you could save EVERY client. Time to CHARGE for that value! 🚀`
                  : "Your automation knowledge is worth $50-100/hour. Every day you don't freelance is $400+ you're leaving on the table. 📈"}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-6 text-sm">
              <div className="bg-background/50 rounded-lg p-4 border border-primary/10">
                <div className="text-2xl font-bold text-primary">$800</div>
                <div className="text-muted-foreground">First project goal</div>
              </div>
              <div className="bg-background/50 rounded-lg p-4 border border-primary/10">
                <div className="text-2xl font-bold text-primary">8-12</div>
                <div className="text-muted-foreground">Hours to complete</div>
              </div>
              <div className="bg-background/50 rounded-lg p-4 border border-primary/10">
                <div className="text-2xl font-bold text-primary">$75/hr</div>
                <div className="text-muted-foreground">Your starting rate</div>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-lg font-bold text-foreground mb-2">
                🎯 YOUR MISSION (Choose One, Do It TODAY):
              </p>
              <div className="text-left max-w-xl mx-auto space-y-2 text-foreground">
                <p>
                  • Text 3 business owners you know: "I build automation that
                  saves 10+ hours/week"
                </p>
                <p>
                  • Post a workflow demo on LinkedIn with: "This saved my client
                  15 hours monthly"
                </p>
                <p>
                  • Email 5 local restaurants: "I can automate your order
                  management for $600"
                </p>
                <p>
                  • Message 3 real estate agents: "Want automated lead follow-up
                  for $500?"
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-primary/20 to-primary/10 rounded-xl p-4 mb-6 border-l-4 border-primary">
              <p className="text-lg font-bold text-foreground">
                💡 REALITY CHECK: While you're "perfecting" your skills, someone
                else is charging $75/hour for automation you could build in your
                sleep.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-bold text-lg px-8 py-3"
              >
                <DollarSign className="w-6 h-6 mr-2" />
                I'M READY TO MAKE MONEY
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary text-primary hover:bg-primary/10 font-semibold"
              >
                <ExternalLink className="w-5 h-5 mr-2" />
                Share My Portfolio
              </Button>
            </div>

            <p className="text-sm text-muted-foreground mt-4 italic">
              "The best time to start freelancing was yesterday. The second best
              time is RIGHT NOW." 🚀
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Configured Site Card Component
function ConfiguredSiteCard({ site }: { site: Site }) {
  return (
    <Card className="group relative overflow-hidden border-2 border-emerald-200 hover:border-emerald-400 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/20 bg-gradient-to-br from-emerald-50/50 to-transparent h-full flex flex-col">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-emerald-500/5 opacity-100 group-hover:opacity-100 transition-opacity duration-500" />

      {site.isPopular && (
        <div className="absolute top-3 right-3 z-10">
          <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
            <Star className="w-3 h-3 mr-1" />
            Popular
          </Badge>
        </div>
      )}

      <CardHeader className="relative z-10 pb-3 flex-shrink-0">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 flex items-center justify-center border border-emerald-300/40">
              <Zap className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold group-hover:text-emerald-600 transition-colors">
                {site.name}
              </CardTitle>
              {site.category && (
                <Badge
                  variant="outline"
                  className="mt-1 text-xs border-emerald-200"
                >
                  {site.category}
                </Badge>
              )}
            </div>
          </div>

          <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-0 transition-all duration-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Live & Ready
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="relative z-10 pt-0 flex-1 flex flex-col justify-between">
        <CardDescription className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {site.description}
        </CardDescription>

        <div className="flex gap-2">
          <Button
            asChild
            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white transition-all duration-200 group-hover:translate-y-[-1px] group-hover:shadow-lg"
          >
            <a
              href={site.siteUrl}
              className="flex items-center justify-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              View Live Site
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Unconfigured Site Card Component
function UnconfiguredSiteCard({ site }: { site: Site }) {
  return (
    <Card className="group relative overflow-hidden border-2 border-dashed border-muted-foreground/20 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 h-full flex flex-col">
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {site.isPopular && (
        <div className="absolute top-3 right-3 z-10">
          <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
            <Star className="w-3 h-3 mr-1" />
            Popular
          </Badge>
        </div>
      )}

      <CardHeader className="relative z-10 pb-3 flex-shrink-0">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-muted via-muted to-muted/80 flex items-center justify-center border border-muted-foreground/20">
              <Zap className="w-6 h-6 text-muted-foreground" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                {site.name}
              </CardTitle>
              {site.category && (
                <Badge variant="outline" className="mt-1 text-xs">
                  {site.category}
                </Badge>
              )}
            </div>
          </div>

          <Badge
            variant="secondary"
            className="bg-orange-100 text-orange-800 transition-all duration-200"
          >
            <Plus className="w-3 h-3 mr-1" />
            Setup Required
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="relative z-10 pt-0 flex-1 flex flex-col justify-between">
        <CardDescription className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {site.description}
        </CardDescription>

        <div className="flex gap-2">
          <Button
            asChild
            className="flex-1 bg-primary hover:bg-primary/90 transition-all duration-200 group-hover:translate-y-[-1px]"
          >
            <Link
              href={`/dashboard/portfolio/${site.siteName}`}
              className="flex items-center justify-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Configure Now
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
