import { Card } from "@/components/primitives/card";
import { DonutChart } from "@/components/primitives/donut-chart";

export type ExpensePieItem = {
  label: string;
  value: number;
  color: string;
};

type ExpensePieChartCardProps = {
  title: string;
  data: ExpensePieItem[];
};

function formatMoney(n: number) {
  return n.toFixed(2);
}

export function ExpensePieChartCard({ title, data }: ExpensePieChartCardProps) {
  const safeData = data.filter((item) => item.value > 0);
  const total = safeData.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card>
      <h2 className="text-lg font-semibold">{title}</h2>

      <div className="mt-4 grid gap-5 md:grid-cols-[240px_1fr] md:items-center">
        <div className="mx-auto">
          <DonutChart
            slices={safeData.map((item) => ({
              id: item.label,
              value: item.value,
              color: item.color,
            }))}
            totalLabel="Total"
            totalValue={formatMoney(total)}
          />
        </div>

        <ul className="space-y-2">
          {safeData.length === 0 ? (
            <li className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-400">
              Keine Daten vorhanden.
            </li>
          ) : null}

          {safeData.map((item) => {
            const percent = total > 0 ? (item.value / total) * 100 : 0;
            return (
              <li
                key={item.label}
                className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                    aria-hidden
                  />
                  <span className="text-sm text-zinc-200">{item.label}</span>
                </div>
                <div className="text-right text-sm">
                  <div className="font-semibold text-zinc-100">
                    {formatMoney(item.value)}
                  </div>
                  <div className="text-zinc-400">{percent.toFixed(1)}%</div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </Card>
  );
}
