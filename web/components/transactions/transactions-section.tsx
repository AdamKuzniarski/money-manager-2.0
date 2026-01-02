"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { readJsonSafe, type Transaction } from "@/lib/transactions";
import { TransactionForm } from "./transaction-form";
import { TransactionRow } from "./transactions-row";

export function TransactionsSection() {
  const router = useRouter();

  const [items, setItems] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setListError(null);

    const res = await fetch("/api/transactions", { cache: "no-store" });
    const payload = await readJsonSafe(res);

    if (!res.ok) {
      if (res.status === 401) {
        router.replace("/auth/login");
        return;
      }
      setListError(payload?.message ?? "Could not load transactions.");
      setLoading(false);
      return;
    }

    setItems(Array.isArray(payload) ? payload : []);
    setLoading(false);
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="grid gap-6">
      <TransactionForm onCreated={load} />

      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Your transactions</h2>
          <span className="text-sm text-zinc-400">{items.length}</span>
        </div>

        {listError ? (
          <div className="mt-3 rounded-xl border border-red-900/60 bg-red-950/30 px-3 py-2 text-sm text-red-200">
            {listError}
          </div>
        ) : null}

        {loading ? (
          <div className="mt-4 text-sm text-zinc-400">Loading…</div>
        ) : items.length === 0 ? (
          <div className="mt-4 text-sm text-zinc-400">
            No transactions yet. Create your first one 👇
          </div>
        ) : (
          <div className="mt-4 grid gap-3">
            {items.map((tx) => (
              <TransactionRow key={tx.id} tx={tx} onChanged={load} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
