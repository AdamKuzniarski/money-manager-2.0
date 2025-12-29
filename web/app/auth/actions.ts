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

function getApiUrl() {
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

  const res = await fetch(`${getApiUrl()}/auth/register`, {
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

export async function loginAction(
  _prev: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const res = await fetch(`${getApiUrl()}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const payload = await readJsonSafe(res);

  if (!res.ok) {
    if (res.status === 400 && Array.isArray(payload?.message)) {
      return { fieldErrors: mapValidationMessages(payload.message) };
    }

    //401: Invalid credentials
    if (res.status === 401) {
      return { formError: payload?.message ?? "Invalid email or password" };
    }
    return { formError: payload?.message ?? "Login failed" };
  }

  const token = String(payload.accessToken ?? "");
  if (!token) return { formError: "No token received from API" };

  const cookieStore = await cookies();

  cookieStore.set("mm_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  /* (await cookies()).set("mm_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  }); */

  redirect("/dashboard");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("mm_token");
  redirect("/auth/login?logout=1");
}
