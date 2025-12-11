import React from "react";

export default function DashboardHeader() {
  return (
    <header className="flex items-center justify-between border-b border-slate-800 px-4 py-3 md:px-6">
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
          Money Manager
        </span>
        <span className="text-sm text-slate-400 hidden sm:inline">
          Dashboard
        </span>
      </div>
      {/* Placeholder für User Menu */}
      <button
        type="button"
        className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-sm text-slate-200"
      >
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-700 text-xs font-medium">
          AK
        </span>
        <span className="hidden sm:inline">User</span>
        <span className="text-xs text-slate-400">▼</span>
      </button>
    </header>
  );
}
