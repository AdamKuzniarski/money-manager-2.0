import Link from "next/link";
import { cn } from "@/lib/cn";

type NavPillLinkProps = {
  href: string;
  label: string;
  active?: boolean;
};

export function NavPillLink({ href, label, active = false }: NavPillLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-xl border px-3 py-2 text-sm font-medium whitespace-nowrap transition",
        active
          ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-300"
          : "border-zinc-800 text-zinc-300 hover:bg-zinc-900 hover:text-zinc-100"
      )}
    >
      {label}
    </Link>
  );
}
