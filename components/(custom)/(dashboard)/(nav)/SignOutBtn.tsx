"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { SignOutButton } from "@clerk/nextjs";
import { LogOut } from "lucide-react";

const SignOutBtn = ({ collapsed }: { collapsed: boolean }) => {
  return (
    <SignOutButton redirectUrl="/">
      <Button
        variant="outline" // Using outline for a different style
        onClick={() => {
          toast.success("Logged out successfully");
        }}
        className={cn(
          "w-full flex items-center gap-3 text-sm text-destructive hover:bg-destructive/10", // Using destructive for logout
          collapsed && "justify-center px-0"
        )}
      >
        <LogOut className="h-5 w-5 text-destructive" />
        {!collapsed && <span>Logout</span>}
        {collapsed && <span className="sr-only">Logout</span>}
      </Button>
    </SignOutButton>
  );
};
export default SignOutBtn;
