"use client";

import { useState } from "react";
import {
  mapValidationMessages,
  readJsonSafe,
  toDateInputValue,
  type Transaction,
  type TxFieldErrors,
} from "@/lib/transactions";

export function TransactionRow({
  tx,
  onChanged,
}: {
  tx: Transaction;
  onChanged: () => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [pending, setPending] = useState(false);

  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<TxFieldErrors>({});

  const [type, setType] = useState<Transaction["type"]>(tx.type);
  const [category, setCategory] = useState(tx.category);
  const [amount, setAmount] = useState(tx.amount);
  const [date, setDate] = useState(toDateInputValue(tx.date));
  const [note, setNote] = useState(tx.note ?? "");

  async function save() {
    setPending(true);
    setFormError(null);
    setFieldErrors({});

    // mini local validation
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

    const res = await fetch(`/api/transactions/${tx.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type,
        category: category.trim(),
        amount: Number(amount),
        date,
        note: note.trim() ? note.trim() : undefined,
      }),
    });

    const payload = await readJsonSafe(res);

    if (!res.ok) {
      if (res.status === 400 && Array.isArray(payload?.message)) {
        setFieldErrors(mapValidationMessages(payload.message));
        setPending(false);
        return;
      }
      setFormError(payload?.message ?? "Could not update transaction.");
      setPending(false);
      return;
    }

    setEditing(false);
    await onChanged();
    setPending(false);
  }

  async function remove() {
    if (!confirm("Delete this transaction?")) return;

    setPending(true);
    setFormError(null);

    const res = await fetch(`/api/transactions/${tx.id}`, { method: "DELETE" });
    const payload = await readJsonSafe(res);

    if (!res.ok) {
      setFormError(payload?.message ?? "Could not delete transaction.");
      setPending(false);
      return;
    }

    await onChanged();
    setPending(false);
  }

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-3">
      {formError ? (
        <div className="mb-2 rounded-lg border border-red-900/60 bg-red-950/30 px-3 py-2 text-sm text-red-200">
          {formError}
        </div>
      ) : null}

      {!editing ? (
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-zinc-700 px-2 py-0.5 text-xs text-zinc-200">
              {tx.type}
            </span>
            <span className="font-medium">{tx.category}</span>
            <span className="text-zinc-400">•</span>
            <span className="font-mono">{tx.amount}</span>
            <span className="text-zinc-400">•</span>
            <span className="text-zinc-300">{toDateInputValue(tx.date)}</span>
            {tx.note ? (
              <span className="text-zinc-400">— {tx.note}</span>
            ) : null}
          </div>

          <div className="flex gap-2">
            <button
              disabled={pending}
              onClick={() => setEditing(true)}
              className="rounded-lg border border-zinc-700 px-3 py-1.5 text-sm disabled:opacity-60"
            >
              Edit
            </button>
            <button
              disabled={pending}
              onClick={remove}
              className="rounded-lg border border-red-900/60 bg-red-950/30 px-3 py-1.5 text-sm text-red-200 disabled:opacity-60"
            >
              Delete
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-2 md:grid-cols-5">
          <div>
            <label className="text-xs text-zinc-400">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as Transaction["type"])}
              className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-2 py-1.5"
            >
              <option value="EXPENSE">EXPENSE</option>
              <option value="INCOME">INCOME</option>
            </select>
            {fieldErrors.type ? (
              <p className="mt-1 text-xs text-red-300">{fieldErrors.type}</p>
            ) : null}
          </div>

          <div>
            <label className="text-xs text-zinc-400">Category</label>
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-2 py-1.5"
            />
            {fieldErrors.category ? (
              <p className="mt-1 text-xs text-red-300">
                {fieldErrors.category}
              </p>
            ) : null}
          </div>

          <div>
            <label className="text-xs text-zinc-400">Amount</label>
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              type="number"
              step="0.01"
              className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-2 py-1.5"
            />
            {fieldErrors.amount ? (
              <p className="mt-1 text-xs text-red-300">{fieldErrors.amount}</p>
            ) : null}
          </div>

          <div>
            <label className="text-xs text-zinc-400">Date</label>
            <input
              value={date}
              onChange={(e) => setDate(e.target.value)}
              type="date"
              className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-2 py-1.5"
            />
            {fieldErrors.date ? (
              <p className="mt-1 text-xs text-red-300">{fieldErrors.date}</p>
            ) : null}
          </div>

          <div className="md:col-span-5">
            <label className="text-xs text-zinc-400">Note</label>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-2 py-1.5"
            />
            {fieldErrors.note ? (
              <p className="mt-1 text-xs text-red-300">{fieldErrors.note}</p>
            ) : null}
          </div>

          <div className="md:col-span-5 flex justify-end gap-2 pt-1">
            <button
              disabled={pending}
              onClick={() => setEditing(false)}
              className="rounded-lg border border-zinc-700 px-3 py-1.5 text-sm disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              disabled={pending}
              onClick={save}
              className="rounded-lg bg-emerald-500 px-3 py-1.5 text-sm font-semibold text-black disabled:opacity-60"
            >
              {pending ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
