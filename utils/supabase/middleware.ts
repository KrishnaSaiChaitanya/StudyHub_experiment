import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
  // This `try/catch` block is only here for the interactive tutorial.
  // Feel free to remove once you have Supabase connected.
  try {
    // Create an unmodified response
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value),
            );
            response = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options),
            );
          },
        },
      },
    );

    // This will refresh session if expired - required for Server Components
    // https://supabase.com/docs/guides/auth/server-side/nextjs
    const { data: { user }, error } = await supabase.auth.getUser();

    // Admin email list from environment variable
    const adminEmails = (process.env.ADMIN_EMAILS || "")
      .split(",")
      .map(email => email.trim().toLowerCase())
      .filter(email => email.length > 0);

    const isUserAdmin = user?.email && adminEmails.includes(user.email.toLowerCase());
    console.log("isUserAdmin", isUserAdmin, user?.email);

    // Protected routes
    const protectedPaths = ["/protected", "/study", "/practice", "/faculty", "/community", "/dashboard", "/admin"]
    const isProtectedPath = protectedPaths.some(path => request.nextUrl.pathname.startsWith(path));

    // 1. If hitting a protected path and NOT logged in, redirect to sign-in
    if (isProtectedPath && error) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    // 2. If hitting /admin path and NOT an admin, redirect to dashboard
    if (request.nextUrl.pathname.startsWith("/admin") && !isUserAdmin) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // 3. If on homepage (/) and logged in, redirect based on role
    if (request.nextUrl.pathname === "/" && !error && user) {
      if (isUserAdmin) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return response;

  } catch (e) {
    // If you are here, a Supabase client could not be created!
    // This is likely because you have not set up environment variables.
    // Check out http://localhost:3000 for Next Steps.
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};
