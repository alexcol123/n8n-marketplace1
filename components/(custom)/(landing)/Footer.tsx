import Link from "next/link";
import {   AlertCircle,  } from "lucide-react";
import { FaGithub, FaXTwitter } from "react-icons/fa6";

import { Button } from "@/components/ui/button";
import { BsYoutube } from "react-icons/bs";

const Footer = () => {
  const appName = process.env.NEXT_PUBLIC_APP_NAME;

  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Left side - Copyright and links */}
          <div className="text-center md:text-left">
            <p className="text-sm text-muted-foreground mb-3">
              © 2025 {appName}. Master automation workflows with hands-on learning.
            </p>
            
            {/* Footer navigation links */}
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm">
              <Link 
                href="/privacy" 
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Privacy Policy
              </Link>
              <Link 
                href="/terms" 
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Terms of Service
              </Link>
              <Link 
                href="/contact" 
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Contact
              </Link>
              <Link 
                href="/report-issue" 
                className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
              >
                <AlertCircle className="h-3 w-3" />
                Report Issue
              </Link>
            </div>
          </div>

          {/* Right side - Social links and Report Issue button */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Social media icons */}
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-muted rounded-md"
                aria-label="YouTube"
              >
                <BsYoutube className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-muted rounded-md"
                aria-label="GitHub"
              >
                <FaGithub className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-muted rounded-md"
                aria-label="Twitter"
              >
                <FaXTwitter className="h-5 w-5" />
              </a>
            </div>

            {/* Prominent Report Issue button */}
            <Button 
              asChild 
              variant="outline" 
              size="sm" 
              className="border-primary/30 text-primary hover:bg-primary/5 hover:border-primary/50"
            >
              <Link href="/report-issue" className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Report Issue
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;