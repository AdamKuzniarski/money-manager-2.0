"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type AuthActionState = {
  formError?: string;
  fieldErrors?: {
    email?: string;
    password?: string;
  };
};

function getApiURL() {
  return process.env.API_URL ?? "http://localhost:4000";
}

function mapValidationMessages(messages: string[]) {
  const fieldErrors: AuthActionState["fieldErrors"] = {};
  for (const msg of messages) {
    const lower = msg.toLocaleLowerCase();
    if (lower.includes("email")) fieldErrors.email = msg;
    if (lower.includes("password")) fieldErrors.password = msg;
  }
  return fieldErrors;
}

async function readJsonSafe(res: Response) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export async function registerAction(
  _prev: AuthActionState,
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
    const payload = await readJsonSafe(res);

    //400: DTO Validation
    if (res.status === 400 && Array.isArray(payload?.message)) {
      return { fieldErrors: mapValidationMessages(payload.message) };
    }

    //409: Duplicate email
    if (res.status === 409) {
      return {
        fieldErrors: { email: payload?.message ?? "Email already registered" },
      };
    }
    return { formError: payload?.message ?? "Registration failed" };
  }

  redirect(`/auth/login?registered=1&email=${encodeURIComponent(email)}`);
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
