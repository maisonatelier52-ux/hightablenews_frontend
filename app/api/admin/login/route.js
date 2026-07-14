import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/adminSession";

// Server-side URL to the backend (falls back to the public one if a
// separate internal URL isn't configured).
const BACKEND_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace(/\/$/, "");

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const { email, password } = body || {};
  if (!email || !password) {
    return NextResponse.json({ ok: false, error: "Email and password are required." }, { status: 400 });
  }

  let backendRes;
  try {
    backendRes = await fetch(`${BACKEND_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  } catch (err) {
    return NextResponse.json({ ok: false, error: "Could not reach the backend server." }, { status: 502 });
  }

  const payload = await backendRes.json().catch(() => ({}));

  if (!backendRes.ok || !payload.success) {
    return NextResponse.json(
      { ok: false, error: payload.message || "Invalid email or password." },
      { status: backendRes.status || 401 }
    );
  }

  const { token, admin } = payload.data || {};

  const res = NextResponse.json({ ok: true, token, admin });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
