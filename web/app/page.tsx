import DashboardHeader from "@/components/header/dashboard-header";
import DashboardNav from "@/components/navigation/dashboard-nav";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 px-8 py-10 shadow-lg">
        <DashboardHeader />
        <DashboardNav />
        <p className="mt-3 text-sm text-slate-400">
          Simple placeholder for landing page.
        </p>
      </div>
    </main>
  );
}
