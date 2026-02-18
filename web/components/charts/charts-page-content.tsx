import { ExpensePieChartCard, type ExpensePieItem } from "@/components/charts/expense-pie-chart-card";
import { PageTitle } from "@/components/primitives/page-title";

type ChartsPageContentProps = {
  expensePieData: ExpensePieItem[];
};

export function ChartsPageContent({ expensePieData }: ChartsPageContentProps) {
  return (
    <div className="space-y-6">
      <PageTitle
        title="Charts"
        description="Verteilung deiner Ausgaben nach Kategorien."
      />

      <ExpensePieChartCard title="Expense Pie Chart" data={expensePieData} />
    </div>
  );
}
