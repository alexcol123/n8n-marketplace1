import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  FileQuestion,
  AlertTriangle
} from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Main 404 Card */}
        <Card className="border-primary/20 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileQuestion className="h-12 w-12 text-primary" />
                </div>
                <div className="absolute -top-2 -right-2">
                  <Badge variant="destructive" className="h-8 w-8 rounded-full p-0 flex items-center justify-center">
                    <AlertTriangle className="h-4 w-4" />
                  </Badge>
                </div>
              </div>
            </div>
            
            <CardTitle className="text-4xl md:text-5xl font-bold mb-2">
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                404
              </span>
            </CardTitle>
            <CardDescription className="text-xl">
              Oops! Page Not Found
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
              The page you&apos;re looking for doesn&apos;t exist. It might have been moved, deleted, or you entered the wrong URL.
            </p>
            
            {/* Action Button */}
            <div className="flex justify-center">
              <Button asChild size="lg">
                <Link href="/" className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  Back to Home
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}