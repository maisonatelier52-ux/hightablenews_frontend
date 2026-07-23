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
    if (!["admin", "superadmin"].includes(payload.role)) return null;
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

  // Fine-grained "can this admin see this specific page" is enforced in
  // AdminShell (nav filtering) + each page, since permissions live in
  // Mongo, not the JWT — the edge here only confirms "this is a signed-in
  // admin at all".
  if (pathname.startsWith("/admin/users") && payload.role !== "superadmin") {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};