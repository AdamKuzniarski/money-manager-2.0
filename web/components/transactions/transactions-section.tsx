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

  return(
    <div className="space-y-6">
        {/* Create section */}
        <TransactionForm/>
    </div>
  )
}
