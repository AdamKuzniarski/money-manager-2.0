"use client";

import { useEffect, useState } from "react";
import { TransactionForm } from "./transaction-form";

export type TransactionType = "INCOME" | "EXPENSE";

export type Transaction = {
  id: number;
  userId: number;
  type: TransactionType;
  category: string;
  amount: string; // kommt von Prisma als string Dezimal
  date: string;
  note?: string | null;
  createdAt: string;
  updatedAt: string;
};

async function readJsonSafe(res: Response) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export function TransactionsSection() {
  const [items, setItems] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);

  //liste wird mit useEffect geladen
  useEffect(() => {
    let alive = true;

    (async () => {
      setLoading(true);
      setListError(null);

      const res = await fetch("/api/transactions", { cache: "no-store" });

      if (!alive) return;

      if (!res.ok) {
        const payload = await readJsonSafe(res);

        //fallback wenn Server down fallback text
        setListError(payload?.message ?? "Could not load transactions.");
        setItems([]);
        setLoading(false);
        return;
      }

      const data = (await res.json()) as Transaction[];
      setItems(Array.isArray(data) ? data : []);
      setLoading(false);
    })();

    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Create */}
      <TransactionForm
        onCreated={(tx) => {
          setItems((prev) => [tx, ...prev]);
        }}
      />

      {/* List */}
      <div className="rounded-2xl border border-zinc-400 bg-zinc-950/60 p-4">
        <h2 className="text-lg font-semibold">Your transactions</h2>
        {loading ? (
          <p className="mt-3 text-sm text-zinc-400">Loading...</p>
        ) : null}

        {listError ? (
          <div className="mt-3 rounded-xl border border-red-900/60 br-red-950/30 px-3 py-2 text-sm text-red-200">
            {listError}
          </div>
        ) : null}

        {!loading && !listError && items.length === 0 ? (
          <p className="mt-3 text-sm text-zinc-400">
            No transactions yet. Please create your first one
          </p>
        ) : null}

        {!loading && !listError && items.length > 0 ? (
          <ul className="mt-4 divide-y divide-zinc-800">
            {items.map((tx) => (
              <li
                key={tx.id}
                className="py-3 flex items-center justify-between"
              >
                <div>
                  <div className="font-medium">
                    {tx.type === "EXPENSE" ? "−" : "+"} {tx.category}{" "}
                    <span className="text-zinc-400 text-sm">
                      ({new Date(tx.date).toLocaleDateString()})
                    </span>
                  </div>
                  {tx.note ? (
                    <div className="text-sm text-zinc-400">{tx.note}</div>
                  ) : null}
                </div>

                <div className="font-semibold tabular-nums">{tx.amount}</div>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
