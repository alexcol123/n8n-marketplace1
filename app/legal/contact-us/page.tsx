import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Mail,
  Globe,
  MessageCircle,
  ArrowLeft,
  Users,
  AlertCircle,
  Shield,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

export default function ContactUsPage() {
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
                <MessageCircle className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-4xl font-bold">Contact Us</h1>
            </div>
            <p className="text-xl text-muted-foreground">
              Get in touch with our team for questions about our n8n automation platform.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* About Us */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                About {companyName}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                {companyName} is an independent educational platform dedicated to helping users learn, 
                create, share, and monetize n8n workflow automations. We provide tutorials, a community 
                platform, and tools to help you master automation and prepare for future monetization opportunities.
              </p>
              
              <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800/30">
                <p className="text-blue-800 dark:text-blue-200 text-sm font-medium flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <strong>Important:</strong> {companyUrl} is not affiliated with, endorsed by, or officially connected to n8n.io or n8n GmbH. 
                  We are an independent community platform that provides education and resources for n8n users.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Email */}
            <Card className="hover:shadow-lg transition-all duration-300 group">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Mail className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Email</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Send us your questions or feedback
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`mailto:${companyEmail}`} className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {companyEmail}
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Website */}
            <Card className="hover:shadow-lg transition-all duration-300 group">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Globe className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Website</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Visit our platform and explore workflows
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`https://${companyUrl}`} className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    {companyUrl}
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Report Issue */}
            <Card className="hover:shadow-lg transition-all duration-300 group">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Report Issue</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Found a bug or problem? Let us know
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/report-issue" className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Report Issue
                  </Link>
                </Button>
              </CardContent>
            </Card>

          </div>

          {/* Simple Info */}
          <Card>
            <CardHeader>
              <CardTitle>How We Can Help</CardTitle>
              <CardDescription>
                We're here to support your n8n automation journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2 text-green-700 dark:text-green-400">What We Support</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Platform account issues</li>
                    <li>• Tutorial and learning questions</li>
                    <li>• Workflow sharing help</li>
                    <li>• Community guidelines</li>
                    <li>• Monetization preparation</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-blue-700 dark:text-blue-400">For n8n Software Issues</h4>
                  <p className="text-sm text-muted-foreground">
                    For technical issues with the n8n application itself, installation problems, 
                    or official n8n support, please visit{" "}
                    <Link href="https://n8n.io" className="text-blue-600 hover:underline" target="_blank">
                      n8n.io
                    </Link>{" "}
                    directly.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}