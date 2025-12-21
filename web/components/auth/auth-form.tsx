"use client";

import Link from "next/link";
import { useFormStatus } from "react-dom";
import type { AuthActionState } from "@/app/auth/actions";
import { useActionState } from "react";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-xl bg-emerald-500 px-4 py-2 font-semibold text-zinc-950 hover:bg-emerald-400 disabled:opacity-60"
    >
      {pending ? "Loading…" : label}
    </button>
  );
}

export function AuthForm(props: {
  mode: "login" | "register";
  title: string;
  action: (
    prevState: AuthActionState,
    formData: FormData
  ) => Promise<AuthActionState>;
  defaultEmail?: string;
  infoMessage?: string;
}) {
  const [state, formAction] = useActionState(props.action, {});

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 shadow">
      <h1 className="text-2xl font-bold">{props.title}</h1>
      <p className="mt-1 text-sm text-zinc-400">
        Money Manager 2.0 – keep it simple, keep it working.
      </p>

      {props.infoMessage ? (
        <div className="mt-4 rounded-xl border border-emerald-700/60 bg-emerald-900/20 px-4 py-3 text-sm text-emerald-200">
          {props.infoMessage}
        </div>
      ) : null}

      {state.error ? (
        <div className="mt-4 rounded-xl border border-red-700/60 bg-red-900/20 px-4 py-3 text-sm text-red-200">
          {state.error}
        </div>
      ) : null}

      <form action={formAction} className="mt-6 space-y-4">
        <div className="space-y-2">
          <label className="text-sm text-zinc-300">Email</label>
          <input
            name="email"
            type="email"
            defaultValue={props.defaultEmail ?? ""}
            required
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 outline-none focus:border-emerald-500"
            placeholder="you@example.com"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-zinc-300">Password</label>
          <input
            name="password"
            type="password"
            required
            minLength={8}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 outline-none focus:border-emerald-500"
            placeholder="••••••••"
          />
          <p className="text-xs text-zinc-500">Min. 8 characters.</p>
        </div>

        <SubmitButton
          label={props.mode === "login" ? "Log in" : "Create account"}
        />

        <div className="text-center text-sm text-zinc-400">
          {props.mode === "login" ? (
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
