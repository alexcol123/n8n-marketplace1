import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Calendar, Eye, FileCode, User, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import Footer from "@/components/(custom)/(landing)/Footer";

import { getUserProfileWithWorkflows } from "@/utils/actions";
import { ReturnToWorkflowsBtn } from "@/components/(custom)/(dashboard)/Form/Buttons";
import EmptyList from "@/components/(custom)/EmptyList";

// Dynamic metadata based on the page params

export default async function AuthorProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params; // Await the promise to access 'username'
  const profile = await getUserProfileWithWorkflows(username);

  // If user not found, show 404 page
  if (!profile) {
    return (
      <EmptyList
        heading={"Author not found"}
        message={"Return to workflows"}
        btnText={"Return"}
        btnLink={"/"}
      />
    );
  }

  // Get user's initials for avatar fallback
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="p-4">
        <ReturnToWorkflowsBtn />
      </div>

      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Profile Header - Alternative compact styling with attention border */}
        <div className="mb-10">
          <div className="relative overflow-hidden bg-card p-6 rounded-2xl border-2 border-primary/30 shadow-xl hover:shadow-2xl hover:border-primary/50 transition-all duration-300">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/8 to-primary/3 opacity-60"></div>
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-primary/15 via-primary/8 to-transparent rounded-full blur-3xl"></div>
            {/* Accent border glow */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 via-transparent to-primary/20 opacity-30 blur-sm -z-10"></div>
            
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                {/* Profile Image Section */}
                <div className="flex-shrink-0 relative">
                  <div className="absolute inset-0 bg-primary/25 rounded-full blur-md opacity-50 scale-115 animate-pulse"></div>
                  <Avatar className="h-28 w-28 border-4 border-background shadow-2xl ring-4 ring-primary/20 transition-all duration-300 hover:scale-105 hover:ring-primary/40">
                    <AvatarImage
                      src={profile.profileImage}
                      alt={`${profile.firstName} ${profile.lastName}`}
                      className="object-cover"
                    />
                    <AvatarFallback className="text-2xl bg-primary text-primary-foreground font-bold">
                      {getInitials(profile.firstName, profile.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  {/* Enhanced status indicator */}
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 border-3 border-background rounded-full shadow-xl flex items-center justify-center ring-2 ring-emerald-200">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </div>
                </div>

                {/* Main Content */}
                <div className="flex-grow text-center md:text-left space-y-4">
                  {/* Header Info */}
                  <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2 drop-shadow-sm">
                      {profile.firstName} {profile.lastName}
                    </h1>
                    <div className="flex items-center justify-center md:justify-start gap-2">
                      <Badge variant="secondary" className="text-xs font-medium border border-primary/30 bg-primary/10">
                        <User className="h-3 w-3 mr-1" />
                        @{profile.username}
                      </Badge>
                    </div>
                  </div>

                  {/* Bio */}
                  {profile.bio && (
                    <div className="bg-muted/60 p-4 rounded-xl border-l-4 border-primary shadow-sm">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {profile.bio}
                      </p>
                    </div>
                  )}

                  {/* Stats Row */}
                  <div className="flex flex-wrap justify-center md:justify-start gap-8">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary drop-shadow-sm">{profile.totalWorkflows}</div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Workflows</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-foreground drop-shadow-sm">
                        {formatDistanceToNow(new Date(profile.createdAt), {
                          addSuffix: true,
                        })}
                      </div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Member</div>
                    </div>
                  </div>

                  {/* Contact CTA - Enhanced attention */}
                  {profile.email && (
                    <div className="relative">
                      {/* Glowing background effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-xl blur-sm animate-pulse"></div>
                      <div className="relative flex flex-col sm:flex-row items-center gap-4 p-5 bg-gradient-to-r from-primary/15 via-primary/10 to-primary/15 rounded-xl border-2 border-primary/40 shadow-xl hover:border-primary/60 hover:shadow-2xl transition-all duration-300">
                        {/* Accent dot */}
                        <div className="absolute top-3 right-3 w-3 h-3 bg-emerald-400 rounded-full animate-ping"></div>
                        <div className="absolute top-3 right-3 w-3 h-3 bg-emerald-500 rounded-full"></div>
                        
                        <div className="flex-grow text-center sm:text-left">
                          <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                            <p className="text-base font-bold text-foreground">
                              Available for Hire
                            </p>
                          </div>
                          <p className="text-sm text-muted-foreground font-medium">
                            Ready to build custom automation solutions for your business
                          </p>
                        </div>
                        <Link target="_blank" href={`mailto:${profile.email}`}>
                          <Button size="lg" className="bg-gradient-to-r from-primary via-primary to-primary/90 hover:from-primary/90 hover:via-primary/80 hover:to-primary/70 text-primary-foreground font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-primary-foreground/20">
                            <Mail className="mr-2 h-5 w-5 animate-bounce" />
                            Hire Me Now
                            <span className="ml-2 text-lg">💼</span>
                          </Button>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Workflows heading - Improved alignment and spacing */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <User className="h-6 w-6 text-primary" />
            {profile.firstName}&apos;s Workflows
          </h2>

          <div className="text-sm text-muted-foreground bg-muted/20 px-3 py-1 rounded-full">
            Showing {profile.workflows.length} workflow
            {profile.workflows.length !== 1 && "s"}
          </div>
        </div>

        {/* No workflows message - Improved appearance */}
        {profile.workflows.length === 0 && (
          <div className="bg-muted/20 border border-dashed rounded-lg p-12 text-center">
            <div className="flex justify-center mb-4 bg-primary/5 p-6 rounded-full w-24 h-24 mx-auto">
              <FileCode className="h-12 w-12 text-primary/70" />
            </div>
            <h3 className="text-xl font-medium mb-2">No Workflows Yet</h3>
            <p className="text-muted-foreground mb-4 max-w-md mx-auto">
              {profile.firstName} hasn&apos;t published any workflows yet. Check
              back later!
            </p>
          </div>
        )}

        {/* Workflows grid - Enhanced card styling */}
        {profile.workflows.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profile.workflows.map((workflow) => (
              <Card
                key={workflow.id}
                className="overflow-hidden hover:shadow-md transition-shadow border-primary/10 group"
              >
                {/* Fixed image container to prevent gradient peek on hover */}
                <div className="relative h-48 overflow-hidden">
                  {/* Overflow hidden here to contain image scaling */}
                  <div className="absolute inset-0 overflow-hidden">
                    <Image
                      src={workflow.creationImage !== null ? workflow.creationImage : workflow.workflowImage}
                      alt={workflow.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Separate overlay gradient that doesn't scale */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-60 pointer-events-none"></div>

                  {/* Category badge - Improved visibility */}
                  <Badge className="absolute top-3 right-3 bg-primary/90 shadow-sm z-10">
                    {workflow.category}
                  </Badge>
                </div>

                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    {/* Workflow title - Improved hover interaction */}
                    <Link
                      href={`/workflow/${workflow.slug}`}
                      className="flex-grow"
                    >
                      <h3 className="text-lg font-bold line-clamp-2 group-hover:text-primary transition-colors">
                        {workflow.title}
                      </h3>
                    </Link>

                    {/* View count moved next to title */}
                    <div className="flex items-center gap-1 text-muted-foreground text-sm bg-muted/20 px-2 py-1 rounded-md flex-shrink-0">
                      <Eye className="h-3.5 w-3.5" />
                      <span>{workflow.viewCount || 0}</span>
                    </div>
                  </div>

                  {/* Date and downloads in one row */}
                  <div className="flex items-center justify-between mt-4">
                    {/* Created date */}
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5 mr-1.5" />
                      {formatDistanceToNow(new Date(workflow.createdAt), {
                        addSuffix: true,
                      })}
                    </div>

                    {/* Downloads count if available */}
                    {workflow._count?.downloads !== undefined && (
                      <div className="flex items-center gap-1 text-muted-foreground text-xs">
                        <span>{workflow._count.downloads} downloads</span>
                      </div>
                    )}
                  </div>

                  {/* View button */}
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="w-full mt-4 group-hover:bg-primary/10 group-hover:text-primary transition-colors"
                  >
                    <Link href={`/workflow/${workflow.slug}`}>
                      View Workflow
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}