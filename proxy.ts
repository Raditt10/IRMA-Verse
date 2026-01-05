import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check for NextAuth session cookies
  // NextAuth uses different cookie names based on secure/insecure context
  const sessionToken = request.cookies.get("authjs.session-token")?.value || 
                       request.cookies.get("__Secure-authjs.session-token")?.value;
  
  const isLoggedIn = !!sessionToken;
  const isAuthPage = pathname.startsWith("/auth") || pathname.startsWith("/register");
  const isDashboard = pathname.startsWith("/dashboard");
  const isHomePage = pathname === "/";
  const isApiRoute = pathname.startsWith("/api");

  // Skip proxy for API routes - let them handle auth themselves
  if (isApiRoute) {
    return NextResponse.next();
  }

  // Redirect to dashboard if logged in and accessing home page
  if (isHomePage && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Redirect to login if accessing dashboard without session
  if (isDashboard && !isLoggedIn) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  // Redirect to dashboard if accessing auth pages while logged in
  if (isAuthPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

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
