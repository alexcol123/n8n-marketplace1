"use client";
import { SignInButton, SignUpButton, SignedOut, SignedIn } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./DarkModeButton";
import NavSearch from "./NavSearch";
import {
  LayoutDashboard,
  LogIn,
  UserPlus,
  Search,
  Menu,
  X,
  Home,
  PlusCircle,
  ChevronUp,
  Trophy, // Added Trophy icon for leaderboard
} from "lucide-react";
import { useState, useEffect } from "react";

const Navbar = () => {
  const appName = process.env.NEXT_PUBLIC_APP_NAME;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isMobileMenuOpen && !target.closest('nav')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  return (
    <nav className={`border-b border-border sticky top-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-card/95 backdrop-blur-md shadow-sm' : 'bg-card/80 backdrop-blur-sm'
    }`}>
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              href={"/"}
              className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70 whitespace-nowrap"
            >
              {appName}
            </Link>
          </div>

          {/* Search bar - Centered on large screens (visible on md and larger) */}
          <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center max-w-lg mx-auto">
            <div className="relative w-full max-w-md">
              <NavSearch />
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Search bar for medium screens only */}
            <div className="relative lg:hidden">
              <NavSearch />
            </div>
            
            {/* Leaderboard link - Added for desktop */}
            <Button variant="ghost" asChild className="flex items-center gap-2 text-primary">
              <Link href="/leaderboard">
                <Trophy className="h-4 w-4" />
                <span>Leaderboard</span>
              </Link>
            </Button>

      
            
            
            <ModeToggle />

            <SignedOut>
              <SignInButton>
                <Button variant="outline" className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  <span>Sign In</span>
                </Button>
              </SignInButton>

              <SignUpButton>
                <Button variant="default" className="flex items-center gap-2 relative overflow-hidden group">
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary/30 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <UserPlus className="h-4 w-4" />
                  <span className="relative">Sign Up</span>
                </Button>
              </SignUpButton>
            </SignedOut>

            <SignedIn>
              <Button variant="default" asChild className="relative overflow-hidden group">
                <Link href="/dashboard" className="flex items-center gap-2">
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary/30 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <LayoutDashboard className="h-4 w-4" />
                  <span className="relative">Dashboard</span>
                </Link>
              </Button>
            </SignedIn>
          </div>

          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(true)}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </Button>

            <ModeToggle />

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              className={`text-primary border border-primary hover:text-foreground transition-colors ${
                isMobileMenuOpen ? 'bg-primary/10' : ''
              }`}
              aria-expanded={isMobileMenuOpen}
              aria-label="Menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu with animation */}
      <div 
        className={`md:hidden bg-background/95 backdrop-blur-sm border-b border-border overflow-hidden transition-all duration-300 ${
          isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 py-3 space-y-4">
          <div className="mb-3">
            <NavSearch />
          </div>

          {/* Leaderboard link - Added for mobile */}
          <Link
            href="/leaderboard"
            className="flex items-center justify-between p-2.5 rounded-md bg-primary/5 hover:bg-primary/10 text-sm transition-colors border border-primary/10"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-primary" />
              <span>Leaderboard</span>
            </div>
          </Link>

          <SignedOut>
            <div className="grid grid-cols-2 gap-2">
              <SignInButton>
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Sign In</span>
                </Button>
              </SignInButton>

              <SignUpButton>
                <Button
                  variant="default"
                  className="w-full flex items-center justify-center gap-2"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Sign Up</span>
                </Button>
              </SignUpButton>
            </div>
          </SignedOut>

          <SignedIn>
            <div className="space-y-3">
              <div className="bg-primary/5 rounded-lg p-3 border border-primary/10">
                <div className="space-y-3">
                  {/* Dashboard Home Link */}
                  <Link 
                    href="/dashboard"
                    className="flex items-center justify-between p-2.5 rounded-md hover:bg-primary/10 text-sm transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="flex items-center gap-2 border p-1 px-4 rounded-lg">
                      <Home className="h-4 w-4 text-primary/70" />
                      <span>Go to Dashboard </span>
                    </div>
                  </Link>
                  
                  {/* Create New Workflow Button */}
                  <Button 
                    asChild 
                    variant="default" 
                    size="sm" 
                    className="w-full group"
                  >
                    <Link 
                      href="/dashboard/wf/create" 
                      className="flex items-center justify-center gap-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <PlusCircle className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
                      <span>Create New Workflow</span>
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </SignedIn>
        </div>
      </div>

      {/* Back to top button - appears when scrolled */}
      {scrolled && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed -bottom-12 right-4 h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:bg-primary/90 transition-all duration-300 animate-fade-in"
          aria-label="Back to top"
        >
          <ChevronUp className="h-5 w-5" />
        </button>
      )}
    </nav>
  );
};

export default Navbar;