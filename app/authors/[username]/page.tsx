import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Calendar, Eye, FileCode, User } from "lucide-react";
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
        {/* Profile Header - Improved styling */}
        <div className="mb-10">
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-8 rounded-xl border border-primary/20 shadow-sm">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Profile Image - Added subtle glow */}
              <div className="flex-shrink-0 relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-md -z-10"></div>
                <Avatar className="h-32 w-32 border-4 border-background shadow-lg hover:shadow-xl transition-shadow">
                  <AvatarImage
                    src={profile.profileImage}
                    alt={`${profile.firstName} ${profile.lastName}`}
                  />
                  <AvatarFallback className="text-3xl bg-primary text-primary-foreground">
                    {getInitials(profile.firstName, profile.lastName)}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Profile Info - Improved typography */}
              <div className="flex-grow text-center md:text-left">
                <h1 className="text-3xl font-bold mb-2 text-foreground">
                  {profile.firstName} {profile.lastName}
                </h1>
                <p className="text-muted-foreground mb-4 flex items-center justify-center md:justify-start gap-1">
                  <User className="h-4 w-4" />@{profile.username}
                </p>

                {/* User stats - Improved card-like design */}
                <div className="flex flex-wrap justify-center md:justify-start gap-6 mb-4">
                  <div className="flex items-center gap-2 bg-muted/20 p-3 rounded-lg shadow-sm">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <FileCode className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-bold text-xl">
                        {profile.totalWorkflows}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Workflows
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-muted/20 p-3 rounded-lg shadow-sm">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">
                        {formatDistanceToNow(new Date(profile.createdAt), {
                          addSuffix: true,
                        })}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Joined
                      </div>
                    </div>
                  </div>
                </div>

                {/* User bio - Added subtle card-like background */}
                {profile.bio && (
                  <p className="max-w-prose bg-muted/10 p-4 rounded-lg border-l-2 border-primary/30">
                    {profile.bio}
                  </p>
                )}
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
                      src={workflow.workflowImage}
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
