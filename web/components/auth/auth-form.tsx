"use client";

import Link from "next/link";
import { useFormState } from "react-dom";
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

export function AuthForm(props: AuthFormProps) {
  const [state, formAction] = useFormState(props.action, {});

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 shadow">
      <h1 className="">{props.title}</h1>
      <p className="mt-1 text-sm text-zinc-400"> Money Manager 2.0 - Auth</p>

      {props.infoMessage ? (
        <div className="mt-4">
          <Alert variant="success">{props.infoMessage}</Alert>
        </div>
      ) : null}

      <form action={formAction} className="mt-6 space-y-4">
        <Input
          label="Email"
          name="email"
          type="email"
          defaultValue={props.defaultEmail ?? ""}
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
      </form>
    </div>
  );
}
