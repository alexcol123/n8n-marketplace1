import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@radix-ui/react-separator"
import {  ArrowRight, Users } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const CreatorCard = ({username, profileImage, firstName, lastName, bio}) => {


    //   <CreatorCard
    //       username={workflow.author.username}
    //       profileImage={workflow.author.profileImage}
    //       firstName={workflow.author.firstName}
    //       lastName={workflow.author.lastName}
    //       bio={workflow.author.bio}
    //     />

  return (

        <section className="mb-12">
          <Separator className="my-12 opacity-50" />
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-primary mb-2 flex items-center justify-center gap-2">
              <Users className="h-6 w-6" />
              Meet the Creator
            </h2>
          </div>
          
          <Card className="max-w-2xl mx-auto border-primary/20 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-background to-muted/10">
            <CardContent className="p-8">
              <Link                href={`/authors/${username}`}
                className="flex items-center gap-6 p-4 rounded-xl hover:bg-muted/50 transition-colors group"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-primary/10 rounded-full blur-md group-hover:blur-lg transition-all"></div>
                  <Image
                    width={80}
                    height={80}
                    src={profileImage}
                    alt={`${firstName} ${lastName}`}
                    className="relative rounded-full object-cover border-2 border-background shadow-lg group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1 font-medium">
                    Workflow created by
                  </p>
                  <h3 className="text-xl font-bold text-primary group-hover:text-primary/80 transition-colors mb-2">
                    {firstName} {lastName}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {bio || "Specializes in building automation workflows that save time and increase productivity."}
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              
              <div className="mt-6 pt-6 border-t border-primary/10">
                <Link href={`/authors/${username}`}>
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all">
                    View All Workflows by This Creator
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
  )
}
export default CreatorCard