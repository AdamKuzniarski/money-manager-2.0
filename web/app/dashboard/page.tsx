import React from "react";

export default function DashboardPage() {
  return (
    <section className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
          Overview
        </h1>
        <p>This is the placeholder dashboard for Money Manager 2.0.</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-sm font-medium text-slate-300">Monthly Summary</p>
          <p className="mt-2 text-xs text-slate-500">
            Placeholder content - real data coming soon...
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <p className="text-sm font-medium text-slate-300">
          Recent Transactions
        </p>
        <p className="mt-2 text-xs text-slate-500">
          Placeholder content - will list latest activity
        </p>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <p className="text-sm font-medium text-slate-300">Spending Stats</p>
        <p className="mt-2 text-xs text-slate-500">
          Placeholder charts and insights
        </p>
      </div>
    </section>
  );
}
