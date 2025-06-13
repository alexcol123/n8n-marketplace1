import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Scale,
  Shield,
  Users,
  AlertTriangle,
  CheckCircle,
  Gavel,
  Globe,
  ArrowLeft,
  Calendar,
  Crown,
  Zap,
  Heart,
  Ban,
  UserCheck,
  Copyright,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";

export default function TermsOfServicePage() {
  const lastUpdated = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const companyName = process.env.COMPANY_NAME || "n8n-marketplace";
  const companyUrl = process.env.COMPANY_URL || "n8n-marketplace.com";
  const companyEmail = process.env.COMPANY_EMAIL || "n8n-marketplace@gmail.com";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" asChild>
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>
          
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Scale className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-4xl font-bold">Terms of Service</h1>
            </div>
            <p className="text-xl text-muted-foreground mb-4">
              The rules and guidelines for using our n8n workflow automation platform.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Badge variant="outline" className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Last Updated: {lastUpdated}
              </Badge>
              <span>Effective Date: {lastUpdated}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Quick Summary */}
          <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
                <FileText className="h-5 w-5" />
                Quick Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="text-blue-800 dark:text-blue-200">
              <p>
                By using our platform, you agree to create quality workflows, respect others' work, 
                follow our community guidelines, and use the service responsibly. We provide the platform 
                and tools, you create amazing automation content. Let's build something great together!
              </p>
            </CardContent>
          </Card>

          {/* Agreement to Terms */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-primary" />
                Agreement to Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Welcome to {companyName}, an independent educational platform for n8n workflow automation ("Service"). 
                By accessing or using our Service, you agree to be bound by these Terms of Service ("Terms").
              </p>
              
              <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800/30">
                <p className="text-blue-800 dark:text-blue-200 text-sm font-medium flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <strong>Important Disclaimer:</strong> {companyUrl} is not affiliated with, endorsed by, or officially connected to n8n.io or n8n GmbH. 
                  We are an independent community platform that provides education, tutorials, workflow sharing, and monetization opportunities for n8n users.
                </p>
              </div>

              <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800/30">
                <p className="text-amber-800 dark:text-amber-200 font-medium">
                  <AlertTriangle className="h-4 w-4 inline mr-2" />
                  If you disagree with any part of these terms, you may not access the Service.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Account Terms */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Account Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Account Creation
                </h3>
                <ul className="space-y-2 ml-6 text-muted-foreground">
                  <li>• You must be at least 13 years old to use this Service</li>
                  <li>• You must provide accurate and complete information when creating your account</li>
                  <li>• You are responsible for maintaining the security of your account and password</li>
                  <li>• You must immediately notify us of any unauthorized use of your account</li>
                  <li>• One person or legal entity may maintain no more than one free account</li>
                </ul>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-blue-500" />
                  Account Responsibilities
                </h3>
                <ul className="space-y-2 ml-6 text-muted-foreground">
                  <li>• You are responsible for all content posted and activity under your account</li>
                  <li>• You must not share your account credentials with others</li>
                  <li>• You must keep your profile information current and accurate</li>
                  <li>• You must comply with all applicable laws and regulations</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Acceptable Use */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                Acceptable Use Policy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* What You Can Do */}
              <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-800/30">
                <h3 className="font-semibold text-green-800 dark:text-green-200 mb-3 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  What You Can Do
                </h3>
                <ul className="space-y-1 text-sm text-green-600 dark:text-green-400">
                  <li>• Create and share automation workflows</li>
                  <li>• Download and use workflows created by others</li>
                  <li>• Participate in community discussions and feedback</li>
                  <li>• Build upon existing workflows with proper attribution</li>
                  <li>• Use the platform for educational and commercial purposes</li>
                  <li>• Share knowledge and help other community members</li>
                </ul>
              </div>

              {/* What You Cannot Do */}
              <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-lg border border-red-200 dark:border-red-800/30">
                <h3 className="font-semibold text-red-800 dark:text-red-200 mb-3 flex items-center gap-2">
                  <Ban className="h-4 w-4" />
                  Prohibited Activities
                </h3>
                <ul className="space-y-1 text-sm text-red-600 dark:text-red-400">
                  <li>• Upload malicious code, viruses, or harmful content</li>
                  <li>• Violate any applicable laws or regulations</li>
                  <li>• Infringe on others' intellectual property rights</li>
                  <li>• Harass, abuse, or harm other users</li>
                  <li>• Spam or send unsolicited content</li>
                  <li>• Attempt to gain unauthorized access to our systems</li>
                  <li>• Use the service for illegal automation activities</li>
                  <li>• Create fake accounts or impersonate others</li>
                  <li>• Scrape or automatically extract data from the platform</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Content and Intellectual Property */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Copyright className="h-5 w-5 text-primary" />
                Content and Intellectual Property
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Crown className="h-4 w-4 text-amber-500" />
                  Your Content
                </h3>
                <ul className="space-y-2 ml-6 text-muted-foreground">
                  <li>• You retain full ownership of all workflows and content you create</li>
                  <li>• By publishing workflows, you grant us a license to display and distribute them</li>
                  <li>• You warrant that you have the right to share all content you upload</li>
                  <li>• You are responsible for ensuring your content doesn't infringe on others' rights</li>
                  <li>• You may delete your content at any time</li>
                </ul>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-blue-500" />
                  Platform Content
                </h3>
                <ul className="space-y-2 ml-6 text-muted-foreground">
                  <li>• Our platform, design, and features are protected by intellectual property laws</li>
                  <li>• You may not copy, modify, or redistribute our platform code</li>
                  <li>• Our name, logos, and branding are our exclusive property</li>
                  <li>• Community-created workflows remain the property of their creators</li>
                </ul>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Users className="h-4 w-4 text-green-500" />
                  Community Guidelines
                </h3>
                <ul className="space-y-2 ml-6 text-muted-foreground">
                  <li>• Give credit when building upon others' workflows</li>
                  <li>• Share knowledge freely and help newcomers</li>
                  <li>• Provide clear documentation for your workflows</li>
                  <li>• Report inappropriate content or behavior</li>
                  <li>• Respect different skill levels and learning journeys</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Platform Rules */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Platform-Specific Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3 text-blue-700 dark:text-blue-400">Workflow Quality Standards</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Workflows must be functional and well-documented</li>
                    <li>• Include clear titles and descriptions</li>
                    <li>• Provide accurate category classifications</li>
                    <li>• Test workflows before publishing</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-3 text-green-700 dark:text-green-400">Gamification Features</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• No artificial manipulation of metrics</li>
                    <li>• Achievements must be earned legitimately</li>
                    <li>• No gaming the leaderboard systems</li>
                    <li>• Respect fair play in community rankings</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-3 text-purple-700 dark:text-purple-400">Learning Features</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Complete workflows honestly</li>
                    <li>• Don't share completion shortcuts</li>
                    <li>• Provide helpful feedback to creators</li>
                    <li>• Use learning features as intended</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-3 text-amber-700 dark:text-amber-400">Future Marketplace</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Additional terms will apply for paid content</li>
                    <li>• Revenue sharing terms will be clearly defined</li>
                    <li>• Quality standards may be enhanced</li>
                    <li>• Early preparation encouraged</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Service Availability */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                Service Availability and Modifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-3">Service Availability</h3>
                <ul className="space-y-2 ml-6 text-muted-foreground">
                  <li>• We strive to maintain 99.9% uptime but cannot guarantee uninterrupted service</li>
                  <li>• We may perform maintenance that temporarily affects availability</li>
                  <li>• We are not liable for downtime beyond our reasonable control</li>
                </ul>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Platform Changes
                </h3>
                <ul className="space-y-2 ml-6 text-muted-foreground">
                  <li>• We may modify, suspend, or discontinue any part of the service</li>
                  <li>• We may update features, add new functionality, or change the interface</li>
                  <li>• Major changes will be communicated to users in advance when possible</li>
                  <li>• Continued use after changes constitutes acceptance of modifications</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Termination */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-primary" />
                Account Termination
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3 text-blue-700 dark:text-blue-400">Your Right to Terminate</h3>
                <ul className="space-y-2 ml-6 text-muted-foreground">
                  <li>• You may close your account at any time</li>
                  <li>• Contact us for account deletion assistance</li>
                  <li>• Your data will be handled according to our Privacy Policy</li>
                </ul>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-3 text-red-700 dark:text-red-400">Our Right to Terminate</h3>
                <p className="text-muted-foreground mb-3">We may suspend or terminate your account if you:</p>
                <ul className="space-y-2 ml-6 text-muted-foreground">
                  <li>• Violate these Terms of Service</li>
                  <li>• Engage in prohibited activities</li>
                  <li>• Upload harmful or illegal content</li>
                  <li>• Abuse other users or our support team</li>
                  <li>• Attempt to circumvent our security measures</li>
                </ul>
              </div>

              <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800/30">
                <p className="text-amber-800 dark:text-amber-200 text-sm">
                  <AlertTriangle className="h-4 w-4 inline mr-2" />
                  We will provide reasonable notice before termination when possible, except in cases of severe violations.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Disclaimers and Liability */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gavel className="h-5 w-5 text-primary" />
                Disclaimers and Liability
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Service Disclaimer</h3>
                <p className="text-muted-foreground text-sm">
                  The service is provided "as is" without warranties of any kind. We do not guarantee that 
                  workflows will be error-free, secure, or suitable for your specific needs. Users are 
                  responsible for testing and validating all workflows before implementation.
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-3">Limitation of Liability</h3>
                <p className="text-muted-foreground text-sm">
                  We shall not be liable for any indirect, incidental, special, consequential, or punitive 
                  damages resulting from your use of the service. Our total liability shall not exceed 
                  the amount you paid us in the 12 months preceding the claim.
                </p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800/30">
                <p className="text-blue-800 dark:text-blue-200 text-sm">
                  <Shield className="h-4 w-4 inline mr-2" />
                  Some jurisdictions do not allow certain limitations, so these may not apply to you.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact and Updates */}
          <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Terms Updates and Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-3">Changes to Terms</h3>
                <p className="text-muted-foreground text-sm mb-3">
                  We may revise these terms from time to time. We will notify users of significant changes 
                  by email or platform notification. Your continued use constitutes acceptance of updated terms.
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-3">Contact Information</h3>
                <p className="text-muted-foreground text-sm mb-3">
                  For questions about these Terms of Service, please contact us:
                </p>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <span>{companyEmail}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-primary" />
                    <span>{companyUrl}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    <span>[Your Business Address]</span>
                  </div>
                </div>
              </div>

              <Separator />
              
              <p className="text-sm text-muted-foreground italic">
                These terms are effective as of {lastUpdated} and govern your use of our n8n workflow 
                automation platform. By using our service, you acknowledge that you have read, understood, 
                and agree to be bound by these terms.
              </p>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}