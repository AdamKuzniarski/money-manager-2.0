<<<<<<< Updated upstream
import { ExpensePieChartCard, type ExpensePieItem } from "@/components/charts/expense-pie-chart-card";
=======
import {
  ExpensePieChartCard,
  type ExpensePieItem,
} from "@/components/charts/expense-pie-chart-card";
>>>>>>> Stashed changes
import { PageTitle } from "@/components/primitives/page-title";

type ChartsPageContentProps = {
  expensePieData: ExpensePieItem[];
};

export function ChartsPageContent({ expensePieData }: ChartsPageContentProps) {
  return (
    <div className="space-y-6">
      <PageTitle
        title="Charts"
<<<<<<< Updated upstream
        description="Verteilung deiner Ausgaben nach Kategorien."
      />

      <ExpensePieChartCard title="Expense Pie Chart" data={expensePieData} />
=======
        description="Expense distribution by category."
      />

      <ExpensePieChartCard title="Expenses by Category" data={expensePieData} />
>>>>>>> Stashed changes
    </div>
  );
}
