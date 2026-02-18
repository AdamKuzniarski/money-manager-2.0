"use client";

import { NavPillLink } from "@/components/primitives/nav-pill-link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/stats", label: "Stats" },
  { href: "/dashboard/charts", label: "Charts" },
];

function isActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === href;
  return pathname.startsWith(href);
}

export function DashboardMenu() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-zinc-800 bg-zinc-950/60">
      <div className="mx-auto flex max-w-5xl gap-2 overflow-x-auto px-4 py-3">
<<<<<<< Updated upstream
        {items.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <NavPillLink
              key={item.href}
              href={item.href}
              label={item.label}
              active={active}
            />
          );
        })}
=======
        {items.map((item) => (
          <NavPillLink
            key={item.href}
            href={item.href}
            label={item.label}
            active={isActive(pathname, item.href)}
          />
        ))}
>>>>>>> Stashed changes
      </div>
    </nav>
  );
}
