import React from "react";
import DashboardHeader from "../header/dashboard-header";
import DashboardNav from "../navigation/dashboard-nav";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
      <DashboardHeader />
      <div className="flex flex-1 flex-col md:flex-row">
        <DashboardNav />
        <main className="flex-1 p-4 md:o-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
