import { cn } from "@/lib/cn";

export function Alert({
  variant = "info",
  children,
}: {
  variant?: "info" | "success" | "error";
  children: React.ReactNode;
}) {
  const styles = {
    info: "border-zinc-700 bg-zinc-900/40 text-zinc-200",
    success: "border-emerald-700/60 bg-emerald-900/20 text-emerald-200",
    error: "border-red-700/60 bg-red-900/20 text-red-200",
  }[variant];

  return (
    <div className={cn("rounded-xl border px-4 py-3 text-sm", styles)}>
      {children}
    </div>
  );
}
