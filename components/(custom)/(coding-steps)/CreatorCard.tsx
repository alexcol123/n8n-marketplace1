import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

import { ArrowRight, Users, Mail } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface CreatorCardProps {
  username: string;
  profileImage: string;
  firstName: string;
  lastName: string;
  bio?: string;
  email?: string;
}

const CreatorCard = ({
  username, 
  profileImage, 
  firstName, 
  lastName, 
  bio = "No bio available",
  email
}: CreatorCardProps) => {

  return (
    <section className="mb-4 md:mb-12">

      
      {/* Mobile: Primary background card, Desktop: Original card */}
      <Card className="w-full border-primary/20 shadow-sm md:shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-primary/30 to-primary-forground overflow-hidden">
        <CardContent className="p-0 sm:p-6 lg:p-8">
          {/* Mobile: Match desktop styling */}
          <div className="flex sm:hidden flex-col">
            {/* Top row: Image and info */}
            <div className="flex items-center gap-3 p-3 hover:bg-primary-foreground/10 transition-all duration-300">
              {/* Profile Image with desktop-like styling */}
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-foreground/20 to-primary-foreground/10 rounded-full blur-sm transition-all duration-300"></div>
                <Image
                  width={40}
                  height={40}
                  src={profileImage}
                  alt={`${firstName} ${lastName}`}
                  className="relative rounded-full object-cover border-2 border-primary-foreground/30 shadow-md"
                />
              </div>
              
              {/* Content - Match desktop hierarchy */}
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-primary-foreground/70 mb-0.5 font-medium">
                  Workflow created by
                </p>
                <h3 className="font-bold text-primary-foreground truncate">
                  {firstName} {lastName}
                </h3>
              </div>
            </div>
            
            {/* Bottom row: Buttons matching desktop */}
            <div className="flex gap-2 px-3 pb-3 border-t border-primary-foreground/10 pt-2">
              <Link href={`/authors/${username}`} className="flex-1">
                <Button size="sm" className="w-full h-8 text-xs bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-primary-foreground shadow-sm transition-all duration-300 group">
                  <Users className="h-3 w-3 mr-1" />
                  View Workflows
                  <ArrowRight className="ml-1 h-2.5 w-2.5 group-hover:translate-x-0.5 transition-transform duration-300" />
                </Button>
              </Link>
              
              {email && (
                <Link target="_blank" href={`mailto:${email}`} className="flex-1">
                  <Button size="sm" className="w-full h-8 text-xs bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300">
                    <Mail className="h-3 w-3 mr-1" />
                    Hire Me
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Desktop: Original layout with full header */}
          <div className="hidden sm:block">
            {/* Desktop header */}
            <div className="text-center mb-4 border-b border-primary/10 pb-4">
              <h2 className="text-xl font-bold text-primary-forground flex items-center justify-center gap-2">
                <Users className="h-5 w-5" />
                Meet the Creator
              </h2>
            </div>
            
            <Link                
              href={`/authors/${username}`}
              className="flex flex-row items-center gap-6 lg:gap-8 p-4 md:p-6 rounded-xl md:rounded-2xl hover:bg-muted/30 transition-all duration-300 group"
            >
              {/* Profile Image */}
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-full blur-lg group-hover:blur-xl transition-all duration-300"></div>
                <Image
                  width={80}
                  height={80}
                  src={profileImage}
                  alt={`${firstName} ${lastName}`}
                  className="relative lg:w-[100px] lg:h-[100px] rounded-full object-cover border-2 md:border-3 border-background shadow-lg group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              {/* Content */}
              <div className="flex-1 text-left">
                <p className="text-sm text-muted-foreground mb-2 font-medium">
                  Workflow created by
                </p>
                <h3 className="text-2xl font-bold text-primary group-hover:text-primary/80 transition-colors mb-3">
                  {firstName} {lastName}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-base max-w-2xl">
                  {bio || "Specializes in building automation workflows that save time and increase productivity."}
                </p>
              </div>
              
              {/* Arrow indicator */}
              <ArrowRight className="h-6 w-6 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 flex-shrink-0" />
            </Link>
            
            {/* Call to action buttons */}
            <div className="mt-8 pt-6 border-t border-primary/10">
              <div className="flex gap-4 flex-row">
                <Link href={`/authors/${username}`} className="flex-1">
                  <Button className="w-full h-10 text-sm bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-300 group">
                    <Users className="mr-2 h-4 w-4" />
                    View All Workflows
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </Link>
                
                {email && (
                  <Link target="_blank" href={`mailto:${email}`} className="flex-initial">
                    <Button variant="outline" className="w-full h-10 text-sm border-primary/20 hover:bg-primary/5 hover:border-primary/40 transition-all duration-300 group">
                      <Mail className="mr-2 h-4 w-4" />
                      Hire Me
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}

export default CreatorCard