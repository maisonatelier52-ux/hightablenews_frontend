import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { SESSION_COOKIE } from "@/lib/adminSession";

// Verifies the backend-issued JWT directly on the Edge runtime (using the
// same JWT_SECRET as the backend's .env) so /admin/** is gated without an
// extra network round-trip on every navigation. The real authorization
// check still happens server-side on every API call via adminVerify —
// this middleware only decides whether to show the admin UI at all.
async function verifyAdminToken(token) {
  if (!token) return null;
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    if (payload.role !== "admin") return null;
    return payload;
  } catch {
    return null;
  }
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // The login page (and its own API route) must stay reachable while logged out.
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const payload = await verifyAdminToken(token);

  if (!payload) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
