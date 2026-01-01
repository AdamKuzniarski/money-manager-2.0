import { TransactionsSection } from "@/components/transactions/transactions-section";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <TransactionsSection />
    </div>
  );
}
