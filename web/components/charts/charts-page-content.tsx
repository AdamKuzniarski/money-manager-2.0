import {
  ExpensePieChartCard,
  type ExpensePieItem,
} from "@/components/charts/expense-pie-chart-card";
import { PageTitle } from "@/components/primitives/page-title";

type ChartsPageContentProps = {
  expensePieData: ExpensePieItem[];
};

export function ChartsPageContent({ expensePieData }: ChartsPageContentProps) {
  return (
    <div className="space-y-6">
      <PageTitle
        title="Charts"
        description="Expense distribution by category."
      />

      <ExpensePieChartCard title="Expenses by Category" data={expensePieData} />
    </div>
  );
}
