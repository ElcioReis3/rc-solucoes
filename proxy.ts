import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/constants";

/**
 * First line of defense for /admin/**: redirects to the login page when
 * there's no session cookie at all. This only checks presence, not
 * validity — middleware runs on the Edge runtime and can't call the
 * Firebase Admin SDK. The real cryptographic verification happens in
 * app/admin/layout.tsx on every request (Node runtime), which is what
 * actually protects the data.
 */
export function proxy(request: NextRequest) {
  const isLoginPage = request.nextUrl.pathname === "/admin/login";
  const hasSession = request.cookies.has(SESSION_COOKIE_NAME);

  if (!isLoginPage && !hasSession) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoginPage && hasSession) {
    return NextResponse.redirect(new URL("/admin/products", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
