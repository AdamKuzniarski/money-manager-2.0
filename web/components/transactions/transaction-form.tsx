"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  mapValidationMessages,
  readJsonSafe,
  type TxFieldErrors,
} from "@/lib/transactions";

export function TransactionForm({
  onCreated,
}: {
  onCreated: () => Promise<void>;
}) {
  const router = useRouter();

  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<TxFieldErrors>({});

  const [type, setType] = useState<"EXPENSE" | "INCOME">("EXPENSE");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    setPending(true);
    setSuccess(null);
    setFormError(null);
    setFieldErrors({});

    // Mini local validation
    const local: TxFieldErrors = {};
    if (!category.trim()) local.category = "Category is required.";
    const num = Number(amount);
    if (!Number.isFinite(num) || num <= 0)
      local.amount = "Amount must be a positive number.";
    if (!date) local.date = "Date is required.";

    if (Object.keys(local).length > 0) {
      setFieldErrors(local);
      setPending(false);
      return;
    }

    const res = await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type,
        category: category.trim(),
        amount: Number(amount),
        date, // YYYY-MM-DD
        note: note.trim() ? note.trim() : undefined,
      }),
    });

    const payload = await readJsonSafe(res);

    if (!res.ok) {
      if (res.status === 401) {
        router.replace("/auth/login");
        return;
      }

      if (res.status === 400 && Array.isArray(payload?.message)) {
        setFieldErrors(mapValidationMessages(payload.message));
        setPending(false);
        return;
      }

      setFormError(payload?.message ?? "Could not create transaction.");
      setPending(false);
      return;
    }

    // success
    setCategory("");
    setAmount("");
    setDate("");
    setNote("");
    setType("EXPENSE");

    setSuccess("Saved");
    await onCreated(); // reload list
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
          <label className="text-sm text-zinc-300">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as "EXPENSE" | "INCOME")}
            className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2"
          >
            <option value="EXPENSE">EXPENSE</option>
            <option value="INCOME">INCOME</option>
          </select>
          {fieldErrors.type ? (
            <p className="mt-1 text-xs text-red-300">{fieldErrors.type}</p>
          ) : null}
        </div>

        <div>
          <label className="text-sm text-zinc-300">Category</label>
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
          <label className="text-sm text-zinc-300">Amount</label>
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            type="number"
            step="0.01"
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
            placeholder="Pizza + Cola..."
            className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2"
          />
          {fieldErrors.note ? (
            <p className="mt-1 text-xs text-red-300">{fieldErrors.note}</p>
          ) : null}
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
