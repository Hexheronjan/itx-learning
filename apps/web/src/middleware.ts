import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_ROUTES = ["/quiz", "/teacher", "/admin", "/future-path"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Check if route is protected
  const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // Check for Supabase session cookies or search params
  const hasSupabaseCookie = Array.from(req.cookies.getAll()).some(
    (cookie) => cookie.name.includes("sb-") && cookie.name.includes("auth-token")
  );
  const hasUserQuery = req.nextUrl.searchParams.has("user");

  if (!hasSupabaseCookie && !hasUserQuery) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/quiz/:path*", "/teacher/:path*", "/admin/:path*", "/future-path/:path*"],
};
