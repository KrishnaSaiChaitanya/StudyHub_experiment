import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  const isLive = process.env.IS_LIVE !== "false";
  const { pathname } = request.nextUrl;

  if (!isLive && pathname !== "/comming-soon") {
    return NextResponse.redirect(new URL("/comming-soon", request.url));
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
   "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|https?:\\/\\/.*).*)"
  ],
};
