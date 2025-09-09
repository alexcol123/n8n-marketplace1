"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { adminNavigation, navigation } from "../../../../utils/constants";
import SignOutBtn from "./SignOutBtn";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function AdminSidebar({ className }: { className?: string }) {
  const pathname = usePathname();

  // Default to a consistent state on the server to prevent mismatch
  const [collapsed, setCollapsed] = useState(false);

  // This state is the key to preventing hydration errors.
  const [hasMounted, setHasMounted] = useState(false);

  // This effect runs only once on the client, after the initial render.
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // This effect handles resizing and is now safely client-side only
  useEffect(() => {
    if (!hasMounted) return; // Guard against running on the server

    const handleResize = () => {
      // Auto-collapse on mobile screens
      if (window.innerWidth < 768) {
        setCollapsed(true);
      }
    };

    handleResize(); // Check on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [hasMounted]); // Re-run only when hasMounted changes

  const appName = process.env.NEXT_PUBLIC_APP_NAME;

  // A helper to determine if we should be in a "mobile view"
  // This is safe because it only runs when `hasMounted` is true.
  const isMobileView = hasMounted && window.innerWidth < 768;

  return (
    <TooltipProvider delayDuration={300}>
      <div
        className={cn(
          "relative border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 h-screen flex flex-col",
          collapsed ? "w-[72px]" : "w-64",
          "transition-all duration-300 ease-in-out",
          "shadow-sm",
          className
        )}
      >
      {/* Sidebar header with logo */}
      <div className="flex h-16 items-center justify-between px-4 border-b shrink-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent">
        <Link
          href={"/"}
          className={cn(
            "font-bold truncate transition-all duration-300",
            collapsed ? "text-2xl text-primary" : "text-xl",
            !collapsed && "text-foreground hover:text-primary"
          )}
        >
          {collapsed ? appName?.charAt(0) || "A" : appName}
        </Link>

        {/* Toggle button - This entire block is now safely rendered only on the client */}
        {hasMounted && !isMobileView && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "h-9 w-9 rounded-lg transition-all duration-200",
              "hover:bg-primary/10 hover:text-primary",
              "group relative",
              collapsed && "ml-auto"
            )}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <div className="relative">
              {collapsed ? (
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              ) : (
                <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
              )}
            </div>
          </Button>
        )}
      </div>

      {/* Navigation menu - flex-grow to take available space */}
      <nav className="flex-grow py-4 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/10 hover:scrollbar-thumb-primary/20">
        <ul className="grid gap-1.5 px-3">
          {/* Normal Navigation Mapping */}
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const isBackBtn = item.href === "/";
            const navItem = (
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg py-2.5 text-sm transition-all duration-200 relative group",
                  isBackBtn
                    ? "bg-gradient-to-r from-primary/10 to-transparent border-l-4 border-primary shadow-sm hover:from-primary/20 hover:to-primary/5 hover:shadow-md"
                    : "hover:bg-accent hover:text-accent-foreground hover:scale-[1.02]",
                  isActive && !isBackBtn
                    ? "bg-primary text-primary-foreground font-medium shadow-md scale-[1.02]"
                    : isBackBtn
                    ? "text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground",
                  collapsed ? "justify-center px-3" : "px-3",
                  !isBackBtn && "before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-8 before:w-1 before:rounded-r-full before:bg-primary before:opacity-0 before:transition-opacity",
                  isActive && !isBackBtn && "before:opacity-100"
                )}
              >
                {isBackBtn ? (
                  <ArrowLeft
                    className={cn(
                      "h-5 w-5 transition-transform shrink-0",
                      !collapsed && "group-hover:-translate-x-1"
                    )}
                  />
                ) : (
                  <item.icon className={cn(
                    "h-5 w-5 shrink-0 transition-transform",
                    "group-hover:scale-110",
                    isActive && "drop-shadow-sm"
                  )} />
                )}
                {!collapsed && (
                  <span className={cn(
                    "transition-all duration-200",
                    isBackBtn ? "font-medium" : "",
                    "group-hover:translate-x-0.5"
                  )}>
                    {item.name}
                  </span>
                )}
                {!collapsed && isActive && !isBackBtn && (
                  <div className="ml-auto">
                    <div className="h-2 w-2 rounded-full bg-primary-foreground animate-pulse" />
                  </div>
                )}
              </Link>
            );

            return (
              <li key={item.name} className={isBackBtn ? "mb-6" : ""}>
                {collapsed ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      {navItem}
                    </TooltipTrigger>
                    <TooltipContent side="right" className="font-medium">
                      {item.name}
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  navItem
                )}
              </li>
            );
          })}

          <Separator className="my-4 mx-3" />

          {/* Admin Section Container */}
          <div
            className={cn(
              "relative mx-2 rounded-xl bg-gradient-to-br from-orange-50/60 to-amber-50/40 dark:from-orange-950/30 dark:to-amber-950/20",
              "border border-orange-200/50 dark:border-orange-800/40",
              "shadow-sm hover:shadow-md transition-shadow duration-300",
              "backdrop-blur-sm",
              collapsed ? "p-2" : "p-3 pb-2"
            )}
          >
            {/* Admin Section Header */}
            <div
              className={cn(
                "flex items-center gap-2 mb-3",
                collapsed ? "justify-center" : ""
              )}
            >
              {!collapsed && (
                <>
                  <div className="h-2 w-2 rounded-full bg-gradient-to-r from-orange-400 to-amber-500 animate-pulse" />
                  <h2 className="text-xs font-bold text-orange-700 dark:text-orange-400 uppercase tracking-wider">
                    Admin Zone
                  </h2>
                  <div className="flex-1 h-px bg-gradient-to-r from-orange-200 to-transparent dark:from-orange-800 dark:to-transparent ml-2" />
                </>
              )}
              {collapsed && (
                <Tooltip>
                  <TooltipTrigger>
                    <div className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-orange-400 to-amber-500 animate-pulse shadow-sm" />
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    Admin Zone
                  </TooltipContent>
                </Tooltip>
              )}
            </div>

            {/* Admin Navigation Mapping */}
            {adminNavigation.map((item) => {
              const isActive = pathname === item.href;
              const adminNavItem = (
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg py-2 text-sm transition-all duration-200 relative group overflow-hidden",
                    "hover:bg-orange-100/70 dark:hover:bg-orange-900/40 hover:shadow-sm hover:scale-[1.02]",
                    isActive
                      ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium shadow-lg scale-[1.02]"
                      : "text-orange-700 dark:text-orange-300",
                    collapsed ? "justify-center px-2" : "px-3",
                    "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:-translate-x-full before:transition-transform hover:before:translate-x-full before:duration-700"
                  )}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full animate-pulse" />
                  )}
                  <item.icon
                    className={cn(
                      "h-5 w-5 transition-all duration-200 shrink-0 relative z-10",
                      "group-hover:scale-110 group-hover:rotate-3",
                      isActive
                        ? "text-white drop-shadow-md"
                        : "text-orange-600 dark:text-orange-400 group-hover:text-orange-800 dark:group-hover:text-orange-200"
                    )}
                  />
                  {!collapsed && (
                    <span
                      className={cn(
                        "transition-all duration-200 relative z-10",
                        "group-hover:translate-x-0.5",
                        isActive
                          ? "text-white drop-shadow-sm"
                          : "group-hover:text-orange-800 dark:group-hover:text-orange-200"
                      )}
                    >
                      {item.name}
                    </span>
                  )}
                  {!collapsed && isActive && (
                    <div className="ml-auto relative z-10">
                      <div className="h-2 w-2 rounded-full bg-white/80 animate-pulse" />
                    </div>
                  )}
                  {!collapsed && !isActive && (
                    <ChevronRight className="ml-auto h-3 w-3 opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:translate-x-1" />
                  )}
                </Link>
              );

              return (
                <li key={item.name} className="list-none mb-1.5">
                  {collapsed ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        {adminNavItem}
                      </TooltipTrigger>
                      <TooltipContent side="right" className="font-medium bg-gradient-to-r from-orange-500 to-amber-500 text-white border-0">
                        {item.name}
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    adminNavItem
                  )}
                </li>
              );
            })}
          </div>
        </ul>
      </nav>

      {/* Sidebar footer with logout */}
      <div className="shrink-0 px-4 py-4 border-t mt-auto bg-gradient-to-t from-background/80 to-transparent backdrop-blur-sm">
        <SignOutBtn collapsed={collapsed} />
      </div>
    </div>
    </TooltipProvider>
  );
}
