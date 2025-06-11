

// app/dashboard/components/Header.tsx
import React from "react";
import {  Menu } from "lucide-react";
import { Button } from "@/components/ui/button";



import { ModeToggle } from "../../(landing)/DarkModeButton";
import UserBtn from "./UserBtn";

export function Header() {


  return (
    <header className="bg-background border-b sticky top-0 z-10">
      <div className=" flex items-center justify-end  h-16 px-4">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden hover:bg-secondary/10"
        >
          <Menu className="h-5 w-5 text-muted-foreground" />
          <span className="sr-only">Toggle menu</span>
        </Button>


        {/* Right side items */}
        <div className="flex gap-1.5">
          {/* Notifications */}

          <ModeToggle />

          {/* User profile */}
          <div className="flex items-center ">
            <span className="text-sm font-medium hidden md:inline-block text-foreground">
            
   
              <UserBtn />
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
