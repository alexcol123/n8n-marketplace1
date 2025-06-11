import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  "/",
  "/leaderboard(.*)",
  "/authors(.*)",
  "/workflow(.*)",
  '/sign-in(.*)'
]);

// Define admin routes that require admin access
const isAdminRoute = createRouteMatcher([
  "/admin(.*)"
]);

export default clerkMiddleware(async (auth, req) => {
  // Get the current user's authentication info
  const { userId } = await auth();
  


  // Check if the current route is an admin route
  if (isAdminRoute(req)) {
    // If user is not authenticated, redirect to sign-in
    if (!userId) {
      return NextResponse.redirect(new URL('/sign-in', req.url));
    }
    
    // Check if the authenticated user is an admin
    const isAdminUser = userId === process.env.ADMIN_USER_ID;
    
    if (!isAdminUser) {
      // Redirect non-admin users to dashboard or home page
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }
  
  // Protect all non-public routes (requires authentication)
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};