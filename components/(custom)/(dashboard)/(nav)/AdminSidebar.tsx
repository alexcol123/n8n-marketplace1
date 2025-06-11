"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PanelRight, ArrowLeft } from "lucide-react";

import { adminNavigation, navigation } from "../../../../utils/constants";

import SignOutBtn from "./SignOutBtn";
import { Separator } from "@/components/ui/separator";



export function AdminSidebar({ className }: { className?: string }) {



  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle screen resize and set initial state
  useEffect(() => {
    // Check if window is available (client-side only)
    if (typeof window !== "undefined") {
      // Function to detect mobile and manage sidebar state
      const handleResize = () => {
        const mobile = window.innerWidth < 768; // md breakpoint
        setIsMobile(mobile);

        // Auto-collapse on mobile screens but keep sidebar visible
        if (mobile && !collapsed) {
          setCollapsed(true);
        }
      };

      // Set initial state
      handleResize();

      // Add event listener for resize
      window.addEventListener("resize", handleResize);

      // Cleanup
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [collapsed]);

  const appName = process.env.NEXT_PUBLIC_APP_NAME;

  

  return (
    <div
      className={cn(
        "relative border-r bg-background h-screen flex flex-col",
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
        {/* Toggle button - hidden on mobile */}
        {!isMobile && (
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

      {/* Navigation menu - flex-grow to take available space */}
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
                    collapsed ? "justify-center px-2" : "px-3",
                    isBackBtn &&
                      collapsed &&
                      "border-l-4 border-primary bg-primary/10 py-3"
                  )}
                >
                  {isBackBtn ? (
                    <ArrowLeft
                      className={cn(
                        "h-5 w-5 transition-transform",
                        !collapsed && "group-hover:-translate-x-1",
                        collapsed ? "mx-0" : "min-w-5"
                      )}
                    />
                  ) : (
                    <item.icon
                      className={cn("h-5 w-5", collapsed ? "mx-0" : "min-w-5")}
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
          {/* Test==================================================== */}
<Separator className="my-4" />

          {/* Admin Section Container with Background */}
          <div className={cn(
            "relative mx-2 rounded-lg bg-gradient-to-br from-orange-50/50 to-amber-50/30 dark:from-orange-950/20 dark:to-amber-950/10",
            "border border-orange-200/40 dark:border-orange-800/30",
            "shadow-sm",
            collapsed ? "p-2" : "p-3 pb-2"
          )}>
            {/* Admin Section Header */}
            <div className={cn(
              "flex items-center gap-2 mb-3",
              collapsed ? "justify-center" : ""
            )}>
              {!collapsed && (
                <>
                  <div className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                  <h2 className="text-xs font-semibold text-orange-700 dark:text-orange-400 uppercase tracking-wider">
                    Admin
                  </h2>
                  <div className="flex-1 h-px bg-orange-200 dark:bg-orange-800 ml-2" />
                </>
              )}
              {collapsed && (
                <div className="h-2 w-2 rounded-full bg-orange-500" />
              )}
            </div>

          {adminNavigation.map((item) => {
            const isActive = pathname === item.href;
            const isBackBtn = item.href === "/";

            return (
              <li key={item.name} className={isBackBtn ? "mb-6" : "mb-1"}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md py-2 text-sm transition-all duration-200",
                    "relative group",
                    isBackBtn
                      ? "bg-gradient-to-r from-primary/10 to-transparent border-l-4 border-primary shadow-sm hover:from-primary/20 hover:to-primary/5"
                      : "hover:bg-orange-100/60 dark:hover:bg-orange-900/30 hover:shadow-sm",
                    isActive && !isBackBtn
                      ? "bg-orange-500 text-white font-medium shadow-md"
                      : isBackBtn
                      ? "text-primary font-medium"
                      : "text-orange-700 dark:text-orange-300",
                    collapsed ? "justify-center px-2" : "px-3",
                    isBackBtn &&
                      collapsed &&
                      "border-l-4 border-primary bg-primary/10 py-3",
                    // Add subtle admin styling with orange theme
                    !isBackBtn && "border-l-2 border-transparent hover:border-orange-300 dark:hover:border-orange-600",
                    !isBackBtn && isActive && "border-l-2 border-orange-600 dark:border-orange-400"
                  )}
                >
                  {/* Active indicator for admin items */}
                  {!isBackBtn && isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full" />
                  )}
                  
                  {isBackBtn ? (
                    <ArrowLeft
                      className={cn(
                        "h-5 w-5 transition-transform",
                        !collapsed && "group-hover:-translate-x-1",
                        collapsed ? "mx-0" : "min-w-5"
                      )}
                    />
                  ) : (
                    <item.icon
                      className={cn(
                        "h-5 w-5 transition-colors",
                        collapsed ? "mx-0" : "min-w-5",
                        isActive ? "text-white" : "text-orange-600 dark:text-orange-400 group-hover:text-orange-800 dark:group-hover:text-orange-200"
                      )}
                    />
                  )}
                  {!collapsed && (
                    <span className={cn(
                      "transition-colors",
                      isBackBtn ? "font-medium" : "",
                      isActive ? "text-white" : "group-hover:text-orange-800 dark:group-hover:text-orange-200"
                    )}>
                      {item.name}
                    </span>
                  )}
                  {collapsed && <span className="sr-only">{item.name}</span>}
                  
                  {/* Hover indicator */}
                  {!isBackBtn && !collapsed && (
                    <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="h-1 w-1 rounded-full bg-current" />
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
          </div>
 
        </ul>
      </nav>

      {/* Sidebar footer with logout - shrink-0 ensures it stays at bottom */}
      <div className="shrink-0 px-4 py-4 border-t mt-auto">
        <SignOutBtn collapsed={collapsed} />
      </div>
    </div>
  );
}
