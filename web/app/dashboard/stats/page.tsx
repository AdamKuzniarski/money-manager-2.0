import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Transaction } from "@/lib/transactions";

const API_URL =
  process.env.API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:4000";

const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME ?? "mm_token";

function toNumber(amount: string) {
  const n = Number(amount);
  return Number.isFinite(n) ? n : 0;
}

function formatMoney(n: number) {
  return n.toFixed(2);
}

export default async function StatsPage() {
  const store = await cookies();
  const token = store.get(AUTH_COOKIE_NAME)?.value;
  if (!token) redirect("/auth/login");

  const res = await fetch(`${API_URL}/transactions`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!res.ok) redirect("/auth/login");

  const txs = (await res.json()) as Transaction[];

  const income = txs
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + toNumber(t.amount), 0);

  const expense = txs
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + toNumber(t.amount), 0);

  const balance = income - expense;

  // Top categories (EXPENSE)
  const byCategory = new Map<string, number>();
  for (const t of txs) {
    if (t.type !== "EXPENSE") continue;
    const key = t.category || "Uncategorized";
    byCategory.set(key, (byCategory.get(key) ?? 0) + toNumber(t.amount));
  }

  const topCategories = [...byCategory.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Stats</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Simple overview based on your transactions.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4">
          <p className="text-sm text-zinc-400">Income</p>
          <p className="mt-2 text-2xl font-semibold text-emerald-300">
            {formatMoney(income)}
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4">
          <p className="text-sm text-zinc-400">Expenses</p>
          <p className="mt-2 text-2xl font-semibold text-red-200">
            {formatMoney(expense)}
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4">
          <p className="text-sm text-zinc-400">Balance</p>
          <p
            className={
              "mt-2 text-2xl font-semibold " +
              (balance >= 0 ? "text-emerald-300" : "text-red-200")
            }
          >
            {formatMoney(balance)}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4">
        <h2 className="text-lg font-semibold">Top expense categories</h2>

        {topCategories.length === 0 ? (
          <p className="mt-3 text-sm text-zinc-400">
            No expenses yet. Add a few transactions and come back 👀
          </p>
        ) : (
          <ul className="mt-4 space-y-2">
            {topCategories.map(([cat, total]) => (
              <li
                key={cat}
                className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2"
              >
                <span className="truncate text-zinc-200">{cat}</span>
                <span className="font-semibold text-zinc-100">
                  {formatMoney(total)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4">
        <h2 className="text-lg font-semibold">Sanity checks</h2>
        <div className="mt-3 grid gap-2 text-sm text-zinc-300 md:grid-cols-3">
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2">
            Total tx: <span className="font-semibold">{txs.length}</span>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2">
            Income tx:{" "}
            <span className="font-semibold">
              {txs.filter((t) => t.type === "INCOME").length}
            </span>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2">
            Expense tx:{" "}
            <span className="font-semibold">
              {txs.filter((t) => t.type === "EXPENSE").length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
