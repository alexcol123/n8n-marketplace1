"use client";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "./theme-provider";

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Toaster richColors position="top-center" />
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem={false}
        disableTransitionOnChange
        forcedTheme="dark"
      >
        {children}
      </ThemeProvider>
    </>
  );
}
export default Providers;
