"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PanelRight, ArrowLeft } from "lucide-react";
import { navigation } from "../../../../utils/constants";
import SignOutBtn from "./SignOutBtn";

// We can define this outside the component as it doesn't depend on state
const isClient = typeof window !== 'undefined';

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  
  // Let's determine the default state based on a non-window property if possible,
  // or just default to a consistent state.
  // Forcing a default state on the server is the safest approach.
  const [collapsed, setCollapsed] = useState(false); // Default to expanded on server
  
  // This state is the key to preventing hydration errors.
  const [hasMounted, setHasMounted] = useState(false);

  // This effect runs only once on the client, after the initial render.
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // This effect now ONLY handles resizing and sets a default for mobile
  useEffect(() => {
    if (!isClient) return; // Guard against running on server

    const handleResize = () => {
      // We only care about collapsing on mobile.
      if (window.innerWidth < 768) {
        setCollapsed(true);
      }
    };
    
    handleResize(); // Check on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty dependency array, runs once on mount

  const appName = process.env.NEXT_PUBLIC_APP_NAME;
  
  // A helper to determine if we should be in a "mobile view"
  const isMobileView = hasMounted && window.innerWidth < 768;

  return (
    <div
      className={cn(
        "relative border-r bg-background h-screen flex flex-col",
        // The width is now reliably determined after mounting
        collapsed ? "w-16" : "w-64",
        "transition-width duration-200 ease-in-out",
        className
      )}
    >
      {/* Sidebar header with logo */}
      <div className="flex h-16 items-center justify-between px-4 border-b shrink-0">
        {!collapsed && (
          <Link
            href={"/"}
            className="text-xl font-semibold text-primary truncate"
          >
            {appName}
          </Link>
        )}
        
        {/* Toggle button - Render this button only on non-mobile clients */}
        {hasMounted && !isMobileView && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className={cn("h-8 w-8", collapsed ? "mx-auto" : "ml-auto")}
          >
            <PanelRight
              className={cn("h-4 w-4", collapsed ? "rotate-180" : "")}
            />
            <span className="sr-only">
              {collapsed ? "Expand sidebar" : "Collapse sidebar"}
            </span>
          </Button>
        )}
      </div>

      {/* Navigation menu */}
      <nav className="flex-grow py-4 overflow-y-auto">
        <ul className="grid gap-1 px-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const isBackBtn = item.href === "/";

            return (
              <li key={item.name} className={isBackBtn ? "mb-6" : ""}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md py-2 text-sm transition-colors",
                    isBackBtn
                      ? "bg-gradient-to-r from-primary/10 to-transparent border-l-4 border-primary shadow-sm hover:from-primary/20 hover:to-primary/5 group"
                      : "hover:bg-secondary hover:text-secondary-foreground",
                    isActive && !isBackBtn
                      ? "bg-primary text-primary-foreground font-medium"
                      : isBackBtn
                      ? "text-primary font-medium"
                      : "text-muted-foreground",
                    collapsed ? "justify-center px-2" : "px-3"
                    // Removed the complex conditional here for simplicity
                  )}
                >
                  {isBackBtn ? (
                    <ArrowLeft
                      className={cn(
                        "h-5 w-5 transition-transform",
                        !collapsed && "group-hover:-translate-x-1",
                        "shrink-0" // Add shrink-0 to prevent icon from shrinking
                      )}
                    />
                  ) : (
                    <item.icon
                      className={cn("h-5 w-5", "shrink-0")}
                    />
                  )}
                  {!collapsed && (
                    <span className={isBackBtn ? "font-medium" : ""}>
                      {item.name}
                    </span>
                  )}
                  {collapsed && <span className="sr-only">{item.name}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Sidebar footer */}
      <div className="shrink-0 px-4 py-4 border-t mt-auto">
        <SignOutBtn collapsed={collapsed} />
      </div>
    </div>
  );
}