"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type AuthActionState = {
  error?: string;
};

function getApiURL() {
  return process.env.API_URL ?? "http://localhost:4000";
}

function normalizeApiError(payload: unknown): string {
  if (!payload) return "Unknown error";

  if (typeof payload === "string") return payload;

  if (typeof payload === "object") {
    const maybeMessage = (payload as Record<string, unknown>).message;
    if (Array.isArray(maybeMessage)) {
      const parts = maybeMessage.filter(
        (item): item is string => typeof item === "string"
      );
      if (parts.length) return parts.join(", ");
    }
    if (typeof maybeMessage === "string") return maybeMessage;
  }

  return "Request failed";
}

export async function registerAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const res = await fetch(`${getApiURL()}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    let payload: unknown = null;
    try {
      payload = await res.json();
    } catch {}
    return { error: normalizeApiError(payload) };
  }
  //UX - direkt tu login page +email prefilled
  redirect(`/auth/login?registered=1&email=${encodeURIComponent(email)}`);
}

export async function loginAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const res = await fetch(`${getApiURL()}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  let payload: unknown = null;
  try {
    payload = await res.json();
  } catch {}

  if (!res.ok) {
    return { error: normalizeApiError(payload) || "Login failed" };
  }

  const token = String(
    typeof payload === "object" && payload !== null
      ? (payload as Record<string, unknown>).accessToken ?? ""
      : ""
  );
  if (!token) return { error: "No token received from API" };

  // JWT in httpOnly Cookie speicherung
  const cookieStore = await cookies();
  cookieStore.set("mm_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  redirect("/dashboard");
}
