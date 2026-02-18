import { ChartsPageContent } from "@/components/charts/charts-page-content";
import type { ExpensePieItem } from "@/components/charts/expense-pie-chart-card";
import type { Transaction } from "@/lib/transactions";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const API_URL =
  process.env.API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:4000";

const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME ?? "mm_token";
<<<<<<< Updated upstream
=======
const MAX_SLICES = 8;
>>>>>>> Stashed changes

const COLORS = [
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#3b82f6",
  "#a855f7",
  "#14b8a6",
  "#f97316",
  "#22c55e",
<<<<<<< Updated upstream
=======
  "#94a3b8",
>>>>>>> Stashed changes
];

function toNumber(amount: string) {
  const n = Number(amount);
  return Number.isFinite(n) ? n : 0;
}

<<<<<<< Updated upstream
=======
function buildExpensePieData(txs: Transaction[]): ExpensePieItem[] {
  const byCategory = new Map<string, number>();

  for (const tx of txs) {
    if (tx.type !== "EXPENSE") continue;
    const category = tx.category?.trim() || "Uncategorized";
    byCategory.set(category, (byCategory.get(category) ?? 0) + toNumber(tx.amount));
  }

  const sorted = [...byCategory.entries()].sort((a, b) => b[1] - a[1]);

  if (sorted.length <= MAX_SLICES) {
    return sorted.map(([label, value], idx) => ({
      label,
      value,
      color: COLORS[idx % COLORS.length],
    }));
  }

  const visible = sorted.slice(0, MAX_SLICES - 1);
  const restTotal = sorted.slice(MAX_SLICES - 1).reduce((sum, [, v]) => sum + v, 0);

  return [
    ...visible.map(([label, value], idx) => ({
      label,
      value,
      color: COLORS[idx % COLORS.length],
    })),
    {
      label: "Others",
      value: restTotal,
      color: COLORS[MAX_SLICES % COLORS.length],
    },
  ];
}

>>>>>>> Stashed changes
export default async function ChartsPage() {
  const store = await cookies();
  const token = store.get(AUTH_COOKIE_NAME)?.value;
  if (!token) redirect("/auth/login");

  const res = await fetch(`${API_URL}/transactions`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

<<<<<<< Updated upstream
  if (!res.ok) redirect("/auth/login");

  const txs = (await res.json()) as Transaction[];

  const expenses = txs.filter((t) => t.type === "EXPENSE");
  const byCategory = new Map<string, number>();

  for (const tx of expenses) {
    const category = tx.category?.trim() || "Uncategorized";
    byCategory.set(category, (byCategory.get(category) ?? 0) + toNumber(tx.amount));
  }

  const pieData: ExpensePieItem[] = [...byCategory.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([label, value], idx) => ({
      label,
      value,
      color: COLORS[idx % COLORS.length],
    }));

  return <ChartsPageContent expensePieData={pieData} />;
=======
  if (res.status === 401 || res.status === 403) {
    redirect("/auth/login");
  }
  if (!res.ok) {
    throw new Error("Failed to fetch transactions");
  }

  const txs = (await res.json()) as Transaction[];
  const expensePieData = buildExpensePieData(txs);

  return <ChartsPageContent expensePieData={expensePieData} />;
>>>>>>> Stashed changes
}
