"use client";

import * as React from "react";
import { cn } from "../../lib/cn";
import { useFormStatus } from "react-dom";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed";

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "bg-emerald-500 text-zinc-950 hover:bg-emerald-400",
  secondary: "bg-zinc-800 text-zinc-100 hover:bg-zinc-700",
  ghost: "bg-transparent text-zinc-100 hover:bg-zinc-800/60",
  danger: "bg-red-500 text-zinc-950 hover:bg-red-400",
};

const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-2.5 text-base",
};

function Spinner() {
  return (
    <span
      className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-950/30 border-t-zinc-950"
      aria-hidden="true"
    />
  );
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  loading,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
      disabled={props.disabled || loading}
    >
      {loading ? <Spinner /> : null}
      {children}
    </button>
  );
}

export function SubmitButton({
  children,
  variant,
  size,
  className,
}: Pick<ButtonProps, "variant" | "size" | "className"> & {
  children: React.ReactNode;
}) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant={variant}
      size={size}
      loading={pending}
      className={className}
    >
      {pending ? "Loading..." : children}
    </Button>
  );
}
