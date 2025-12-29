"use client";

import Link from "next/link";
import * as React from "react";
import type { AuthActionState } from "@/app/auth/actions";
import { Alert } from "../ui/alert";
import { Input } from "../ui/input";
import { SubmitButton } from "../ui/button";

type AuthFormProps = {
  mode: "login" | "register";
  title: string;
  action: (
    prev: AuthActionState,
    formData: FormData
  ) => Promise<AuthActionState>;
  defaultEmail?: string;
  infoMessage?: string;
};

export function AuthForm({
  mode,
  title,
  action,
  defaultEmail = "",
  infoMessage,
}: AuthFormProps) {
  const [state, formAction] = React.useActionState(action, {});

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 shadow">
      <h1 className="">{title}</h1>
      <p className="mt-1 text-sm text-zinc-400"> Money Manager 2.0 - Auth</p>

      {infoMessage ? (
        <div className="mt-4">
          <Alert variant="success">{infoMessage}</Alert>
        </div>
      ) : null}

      <form action={formAction} className="mt-6 space-y-4">
        <Input
          label="Email"
          name="email"
          type="email"
          defaultValue={defaultEmail ?? ""}
          placeholder="you@example.com"
          required
          error={state.fieldErrors?.email}
        />

        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="••••••••"
          required
          minLength={8}
          hint="Min. 8 characters."
          error={state.fieldErrors?.password}
        />

        <SubmitButton className="w-full" variant="primary" size="lg">
          {mode === "login" ? "Log in" : "Create account"}
        </SubmitButton>
        <div className="text-center text-sm text-zinc-400">
          {mode === "login" ? (
            <>
              No account?{" "}
              <Link
                className="text-emerald-400 hover:underline"
                href="/auth/register"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              Already registered?{" "}
              <Link
                className="text-emerald-400 hover:underline"
                href="/auth/login"
              >
                Log in
              </Link>
            </>
          )}
        </div>
      </form>
    </div>
  );
}
