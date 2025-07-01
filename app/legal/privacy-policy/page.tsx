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
  Shield,
  Lock,
  Eye,
  Users,
  Database,
  Mail,
  Globe,
  FileText,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Calendar,
} from "lucide-react";
import Link from "next/link";

export default function PrivacyPolicyPage() {
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
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-4xl font-bold">Privacy Policy</h1>
            </div>
            <p className="text-xl text-muted-foreground mb-4">
              Your privacy matters to us. Here&apos;s how we protect and use your information.
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
          
          {/* Quick Overview */}
          <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
                <Eye className="h-5 w-5" />
                Quick Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="text-blue-800 dark:text-blue-200">
              <p>
                We collect only the information necessary to provide our workflow automation platform. 
                We never sell your data, and you control what&apos;s public or private. Your workflows help 
                build a community of automation experts while keeping your personal information secure.
              </p>
            </CardContent>
          </Card>

          {/* Who We Are */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Who We Are
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                We are {companyName}, an independent educational platform focused on n8n workflow automation. 
                We help users learn, create, share, and monetize their n8n workflow creations through our community-driven platform.
              </p>
              <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800/30">
                <p className="text-amber-800 dark:text-amber-200 text-sm font-medium flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  <strong>Important:</strong> {companyUrl} is not affiliated with, endorsed by, or officially connected to n8n.io or n8n GmbH. 
                  We are an independent community platform that provides education, tutorials, and workflow sharing services for n8n users.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Information We Collect */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Account Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Account Information
                </h3>
                <p className="text-muted-foreground mb-3">When you create an account, we collect:</p>
                <ul className="space-y-2 ml-6">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span><strong>Name</strong> (first and last name)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span><strong>Email address</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span><strong>Username</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span><strong>Profile picture</strong> (if you choose to upload one)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span><strong>Bio</strong> (optional)</span>
                  </li>
                </ul>
              </div>

              <Separator />

              {/* Platform Activity */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                  Platform Activity
                </h3>
                <p className="text-muted-foreground mb-3">To provide our services, we track:</p>
                <ul className="space-y-2 ml-6">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span><strong>Workflows you create</strong> (title, content, category, images, JSON data)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span><strong>Workflows you download</strong> (date and time of downloads)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span><strong>Workflows you complete</strong> (completion tracking for learning progress)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span><strong>Views</strong> on your workflows</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span><strong>Usage statistics</strong> (streaks, achievements, level progression)</span>
                  </li>
                </ul>
              </div>

              <Separator />

              {/* Automatically Collected */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-amber-500" />
                  Automatically Collected Information
                </h3>
                <ul className="space-y-2 ml-6">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                    <span>IP address</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                    <span>Browser type and version</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                    <span>Device information</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                    <span>Pages visited and time spent</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* How We Use Your Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <h3 className="font-semibold text-green-700 dark:text-green-400">Provide Core Services</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Create and manage your account</li>
                    <li>• Enable workflow sharing</li>
                    <li>• Track learning progress</li>
                    <li>• Display leaderboards</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold text-blue-700 dark:text-blue-400">Improve Experience</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Generate usage analytics</li>
                    <li>• Customize your dashboard</li>
                    <li>• Send relevant notifications</li>
                    <li>• Troubleshoot issues</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold text-purple-700 dark:text-purple-400">Community Features</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Display public profiles</li>
                    <li>• Show your workflows</li>
                    <li>• Enable leaderboards</li>
                    <li>• Facilitate knowledge sharing</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Information Sharing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                Information Sharing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Public Information */}
              <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-800/30">
                <h3 className="font-semibold text-green-800 dark:text-green-200 mb-3 flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Public Information
                </h3>
                <p className="text-green-700 dark:text-green-300 text-sm mb-3">
                  The following information is <strong>publicly visible</strong> to all users:
                </p>
                <ul className="space-y-1 text-sm text-green-600 dark:text-green-400">
                  <li>• Your name and username</li>
                  <li>• Your profile picture and bio</li>
                  <li>• Workflows you publish (title, description, category, view count)</li>
                  <li>• Your creator statistics (total workflows, community rank)</li>
                  <li>• Achievement badges and level status</li>
                </ul>
              </div>

              {/* Private Information */}
              <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800/30">
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-3 flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  What We Keep Private
                </h3>
                <ul className="space-y-1 text-sm text-blue-600 dark:text-blue-400">
                  <li>• Your email address</li>
                  <li>• Your private workflow drafts</li>
                  <li>• Detailed analytics about your usage patterns</li>
                  <li>• Personal completion history (only you can see which workflows you&apos;ve completed)</li>
                </ul>
              </div>

              {/* No Selling Guarantee */}
              <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800/30">
                <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-2 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Our Promise
                </h3>
                <p className="text-amber-700 dark:text-amber-300 text-sm font-medium">
                  We <strong>never sell</strong> your personal information to advertisers or third parties.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Data Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Data Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">We protect your information through:</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-800 dark:text-green-200">Encrypted Transmission</p>
                    <p className="text-sm text-green-600 dark:text-green-400">HTTPS/SSL encryption for all data</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-800 dark:text-blue-200">Secure Storage</p>
                    <p className="text-sm text-blue-600 dark:text-blue-400">Database with access controls</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-purple-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-purple-800 dark:text-purple-200">Regular Audits</p>
                    <p className="text-sm text-purple-600 dark:text-purple-400">Security updates and monitoring</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-amber-800 dark:text-amber-200">Limited Access</p>
                    <p className="text-sm text-amber-600 dark:text-amber-400">Only authorized personnel</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Your Rights and Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Access and Management</h3>
                <p className="text-muted-foreground mb-3">You can:</p>
                <ul className="space-y-2 ml-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span><strong>View and edit</strong> your profile information</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span><strong>Download</strong> your workflow data</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span><strong>Delete</strong> workflows you&apos;ve created</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span><strong>Control</strong> your public profile visibility</span>
                  </li>
                </ul>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-3">Account Deletion</h3>
                <p className="text-muted-foreground mb-3">
                  You may delete your account at any time by contacting us. When you delete your account:
                </p>
                <ul className="space-y-2 ml-6">
                  <li className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    <span>Your personal information is removed from our systems</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    <span>Your public workflows may remain available (anonymized) to preserve community value</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    <span>Your completion records and downloads history are deleted</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Contact Section */}
          <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                Contact Us
              </CardTitle>
              <CardDescription>
                If you have questions about this privacy policy or your data, please contact us:
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  <span className="text-sm">{companyEmail}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-primary" />
                  <span className="text-sm">{companyUrl}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <span className="text-sm">[Your Business Address]</span>
                </div>
              </div>
              
              <Separator />
              
              <p className="text-sm text-muted-foreground italic">
                This privacy policy is designed to be transparent about our data practices while protecting 
                both user privacy and community value. We&apos;re committed to responsible data stewardship and 
                continuous improvement of our privacy practices.
              </p>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}