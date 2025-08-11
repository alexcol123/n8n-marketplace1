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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Card className="border-2 border-dashed border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardContent className="py-12 text-center">
          <Target className="w-16 h-16 text-primary/50 mx-auto mb-6" />
          <h3 className="text-2xl font-semibold mb-4">
            Ready to Build Your First Solution? 🚀
          </h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Create your first professional automation solution to showcase your
            expertise to potential clients.
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
    </div>
  );
}
