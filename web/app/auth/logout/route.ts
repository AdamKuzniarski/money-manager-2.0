import { NextResponse } from "next/server";

const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME ?? "mm_token";

export async function POST() {
  const res = NextResponse.redirect(
    new URL("/auth/login", "http://localhost:3000")
  );

  // Cookie entfernen - maxAge=0
  res.cookies.set(AUTH_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return res;
}
