import Link from "next/link";
import React from "react";

const navItems = [
  { label: "Overview", href: "/dashboard" },
  { label: "Transactions", href: "/dashboard/transactions" },
  { label: "Stats", href: "/dashboard/stats" },
];

export default function DashboardNav() {
  return (
    <aside className="border-b border-slate-800 md:border-b-0 md:border-r md:w-60">
      <nav className="flex gap-1 overflow-x-auto p-3 md:flex-col md: overflow-visible">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-md px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-slate-50 whitespace-nowrap"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
