import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@radix-ui/react-separator"
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
  bio,
  email
}: CreatorCardProps) => {

  return (
    <section className="mb-12">
      <Separator className="my-12 opacity-50" />
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-primary mb-2 flex items-center justify-center gap-2">
          <Users className="h-6 w-6" />
          Meet the Creator
        </h2>
      </div>
      
      {/* Full width card with subtle styling */}
      <Card className="w-full border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-background to-muted/10 overflow-hidden">
        <CardContent className="p-8">
          <Link                
            href={`/authors/${username}`}
            className="flex flex-col sm:flex-row items-center gap-8 p-6 rounded-2xl hover:bg-muted/30 transition-all duration-300 group"
          >
            {/* Profile Image */}
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-full blur-lg group-hover:blur-xl transition-all duration-300"></div>
              <Image
                width={100}
                height={100}
                src={profileImage}
                alt={`${firstName} ${lastName}`}
                className="relative rounded-full object-cover border-3 border-background shadow-lg group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            
            {/* Content */}
            <div className="flex-1 text-center sm:text-left">
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
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href={`/authors/${username}`} className="flex-1">
                <Button className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-300 group">
                  <Users className="mr-2 h-4 w-4" />
                  View All Workflows
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
              
              {email && (
                <Link target="_blank" href={`mailto:${email}`} className="flex-1 sm:flex-initial">
                  <Button variant="outline" className="w-full border-primary/20 hover:bg-primary/5 hover:border-primary/40 transition-all duration-300 group">
                    <Mail className="mr-2 h-4 w-4" />
                    Hire Me
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}

export default CreatorCard