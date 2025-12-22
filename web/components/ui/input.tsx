import * as React from "react";
import { cn } from "../../lib/cn";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  hint?: string;
};

export function Input({ label, error, hint, className, ...props }: InputProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm text-zinc-300">{label}</label>
      <input
        className={cn(
          "w-full rounded-xl border bg-zinc-950 px-3 py-2 outline-none transition",
          error
            ? "border-red-500/70 focus:border-red-400"
            : "border-zinc-800 focus:border-emerald-500",
          className
        )}
        {...props}
      />
      {error ? (
        <p className="text-xs text-red-200">{error}</p>
      ) : hint ? (
        <p className="text-xs text-zinc-500">{hint}</p>
      ) : null}
    </div>
  );
}
