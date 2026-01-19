import { NextRequest, NextResponse } from "next/server";

// Export `proxy` as required by Next.js proxy entry.
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check for NextAuth session cookies
  // NextAuth uses different cookie names based on secure/insecure context
  const sessionToken = request.cookies.get("authjs.session-token")?.value || 
                       request.cookies.get("__Secure-authjs.session-token")?.value;
  
  const isLoggedIn = !!sessionToken;
  const isAuthPage = pathname.startsWith("/auth") || pathname.startsWith("/register");
  const isOverview = pathname.startsWith("/overview");
  const isHomePage = pathname === "/";
  const isApiRoute = pathname.startsWith("/api");

  // Skip proxy for API routes - let them handle auth themselves
  if (isApiRoute) {
    return NextResponse.next();
  }

  // Redirect to overview if logged in and accessing home page
  if (isHomePage && isLoggedIn) {
    return NextResponse.redirect(new URL("/overview", request.url));
  }

  // Redirect to login if accessing overview without session
  if (isOverview && !isLoggedIn) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  // Do NOT auto-redirect auth pages based on cookie alone.
  // Let the auth page decide post-login where to go to prevent redirect loops
  // caused by mismatched cookie vs server session state.

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files with extensions
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
