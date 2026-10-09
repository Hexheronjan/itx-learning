import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Route protection and role-based access middleware for NALARA.
 * Protects: /admin, /teacher, /quiz, /future-path, and /student.
 * Redirects unauthenticated requests to /login.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Identify protected paths
  const protectedRoutes = ["/admin", "/teacher", "/quiz", "/future-path", "/student"];
  const isProtected = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://amcmtypzjcbxzzmbxapt.supabase.co";
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_v6LPZVMMxVqvXJCZ472qzw_KpIPaoz6";

  let user: any = null;

  try {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
          cookiesToSet.forEach(({ name, value }: { name: string; value: string }) => request.cookies.set(name, value));
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          cookiesToSet.forEach(({ name, value, options }: { name: string; value: string; options?: any }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    });

    const { data } = await supabase.auth.getUser();
    user = data?.user || null;
  } catch {
    // If SSR client fails (e.g. offline/network issue), fallback to cookie check
  }

  // 2. Cookie / Token detection
  const customAuthToken =
    request.cookies.get("sb-auth-token")?.value ||
    request.cookies.get("sb-access-token")?.value ||
    request.cookies.getAll().find((c) => c.name.toLowerCase().includes("auth-token"))?.value;

  const customRole = request.cookies.get("sb-user-role")?.value;
  const customEmail = request.cookies.get("sb-user-email")?.value;

  const isAuthenticated = !!user || !!customAuthToken;

  // 3. Unauthenticated access redirection to /login
  if (!isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 4. Role detection (prefer Supabase user_metadata, then cookie, then email heuristics)
  const roleFromMetadata = user?.user_metadata?.role;
  const emailToCheck = (user?.email || customEmail || "").toLowerCase();

  const userRole =
    roleFromMetadata ||
    customRole ||
    (emailToCheck.includes("admin")
      ? "admin"
      : emailToCheck.includes("guru") || emailToCheck.includes("brio")
      ? "teacher"
      : "student");

  // 5. Role-based Route Protection
  // Only admin can access /admin
  if (pathname.startsWith("/admin") && userRole !== "admin") {
    if (userRole === "teacher") {
      return NextResponse.redirect(new URL("/teacher", request.url));
    }
    return NextResponse.redirect(new URL("/quiz", request.url));
  }

  // Only teacher & admin can access /teacher
  if (pathname.startsWith("/teacher") && userRole !== "teacher" && userRole !== "admin") {
    return NextResponse.redirect(new URL("/quiz", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/teacher/:path*",
    "/quiz/:path*",
    "/future-path/:path*",
    "/student/:path*",
  ],
};
