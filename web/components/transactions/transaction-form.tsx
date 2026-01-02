"use client";

import { useState } from "react";
import type { Transaction, TransactionType } from "./transactions-section";

type FieldErrors = {
  type?: string;
  category?: string;
  amount?: string;
  date?: string;
  note?: string;
};

function mapValidationMessages(messages: string[]) {
  const fieldErrors: FieldErrors = {};
  for (const msg of messages) {
    const lower = msg.toLowerCase();
    if (lower.includes("type")) fieldErrors.type = msg;
    if (lower.includes("category")) fieldErrors.category = msg;
    if (lower.includes("amount")) fieldErrors.amount = msg;
    if (lower.includes("date")) fieldErrors.date = msg;
    if (lower.includes("note")) fieldErrors.note = msg;
  }
  return fieldErrors;
}

async function readJsonSafe(res: Response) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export function TransactionForm({
  onCreated,
}: {
  onCreated: (tx: Transaction) => void;
}) {
  const [pending, setPending] = useState(false);

  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [success, setSuccess] = useState<string | null>(null);

  const [type, setType] = useState<TransactionType>("EXPENSE");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    setPending(true);
    setFormError(null);
    setFieldErrors({});
    setSuccess(null);

    //mini client-side-validation
    const localErrors: FieldErrors = {};
    if (!category) localErrors.category = "Category is required.";
    const num = Number(amount);
    if (!Number.isFinite(num) || num <= 0)
      localErrors.amount = "Amount must be a positive number.";
    if (!date) localErrors.date = "Date is required.";

    if (Object.keys(localErrors).length > 0) {
      setFieldErrors(localErrors);
      setPending(false);
      return;
    }

    //POST zu NEXT

    const res = await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type,
        category,
        amount: Number(amount),
        date,
        note: note.trim() ? note.trim() : undefined,
      }),
    });
    const payload = await readJsonSafe(res);

    //Fehler-Mapping
    if (!res.ok) {
      if (res.status === 401) {
        setFormError("You are logged out. Please login again.");
        setPending(false);
        return;
      }

      if (res.status === 400 && Array.isArray(payload?.message)) {
        setFieldErrors(mapValidationMessages(payload.message));
        setPending(false);
        return;
      }
    }
    //Erfolg UI reset
    const created = payload as Transaction;

    setType("EXPENSE");
    setCategory("");
    setAmount("");
    setDate("");
    setNote("");

    setSuccess("Saved");
    onCreated(created);

    setPending(false);
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4">
      <h2 className="text-lg font-semibold">Add transaction</h2>

      {formError ? (
        <div className="mt-3 rounded-xl border border-red-900/60 bg-red-950/30 px-3 py-2 text-sm text-red-200">
          {formError}
        </div>
      ) : null}

      {success ? (
        <div className="mt-3 rounded-xl border border-emerald-900/60 bg-emerald-950/30 px-3 py-2 text-sm text-emerald-200">
          {success}
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="mt-4 grid gap-3 md:grid-cols-2">
        <div>
          <label htmlFor="option" className="text-sm text-zinc-300">
            Type
          </label>
          <select
            name="option"
            id="option"
            value={type}
            onChange={(e) => setType(e.target.value as TransactionType)}
            className="mt-1 w-full rounded-xl border border-zinc-950 px-3 py-2"
          >
            <option value="EXPENSE">EXPENSE</option>
            <option value="INCOME">INCOME</option>
          </select>
          {fieldErrors.type ? (
            <p className="mt-1 text-xs text-red-300">{fieldErrors.type}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="category" className="text-sm text-zinc-300">
            Category
          </label>
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Food, Rent, Salary..."
            className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2"
          />
          {fieldErrors.category ? (
            <p className="mt-1 text-xs text-red-300">{fieldErrors.category}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="amount">Amount</label>
          <input
            value={amount}
            type="number"
            onChange={(e) => setAmount(e.target.value)}
            placeholder="12.50"
            className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2"
          />
          {fieldErrors.amount ? (
            <p className="mt-1 text-xs text-red-300">{fieldErrors.amount}</p>
          ) : null}
        </div>

        <div>
          <label className="text-sm text-zinc-300">Date</label>
          <input
            value={date}
            onChange={(e) => setDate(e.target.value)}
            type="date"
            className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2"
          />
          {fieldErrors.date ? (
            <p className="mt-1 text-xs text-red-300">{fieldErrors.date}</p>
          ) : null}
        </div>

        <div className="md:col-span-2">
          <label className="text-sm text-zinc-300">Note (optional)</label>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Pizza + Cola…"
            className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2"
          />
        </div>

        <div className="md:col-span-2 flex justify-end pt-2">
          <button
            disabled={pending}
            className="rounded-xl bg-emerald-500 px-4 py-2 font-semibold text-black disabled:opacity-60"
          >
            {pending ? "Saving..." : "Add"}
          </button>
        </div>
      </form>
    </div>
  );
}
