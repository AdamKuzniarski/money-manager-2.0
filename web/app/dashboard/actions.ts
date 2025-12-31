"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { matchesGlob } from "path";

export type TransactionType = "INCOME" | "EXPENSE";

export type Transaction = {
  id: number;
  userId: number;
  type: TransactionType;
  category: string;
  amount: string;
  date: string;
  note: string;
  createdAt: string;
  updatedAt: string;
};

export type TxActionState = {
  ok?: boolean;
  formError?: string;
  fieldErrors?: {
    type?: string;
    category?: string;
    amount?: string;
    date?: string;
    note?: string;
  };
};

function getApiUrl() {
  //Fallback auf NEXT_PUBLIC_API_URL fürs lokal
  return (
    process.env.API_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    "http//:localhost:4000"
  );
}

async function getTokenOrRedirect() {
  const cookeiStore = await cookies();
  const token = cookeiStore.get(
    process.env.AUTH_COOKIE_NAME ?? "mm_token"
  )?.value;

  if (!token) redirect("/auth/login");
  return token;
}

async function readJsonSafe(res: Response) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

function mapValidationMessages(messages: string[]) {
  const fieldErrors: TxActionState["fieldErrors"] = {};
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

export async function createTransactionAction(
  _prev: TxActionState,
  formData: FormData
): Promise<TxActionState> {
  const token = await getTokenOrRedirect();

  const type = String(formData.get("type") ?? "") as TransactionType;
  const category = String(formData.get("category") ?? "").trim();
  const amountRaw = String(formData.get("amount") ?? "");
  const date = String(formData.get("date") ?? "");
  const note = String(formData.get("note") ?? "").trim();

  //client side validation  basic
  const fieldErrors: TxActionState["fieldErrors"] = {};
  if (type !== "INCOME" && type !== "EXPENSE")
    fieldErrors.type = "Pick INCOME or EXPENSE.";
  if (!category) fieldErrors.category = "Category is required.";
  const amount = Number(amountRaw);
  if (!Number.isFinite(amount) || amount <= 0)
    fieldErrors.amount = "Amount must be a positive number.";
  if (!date) fieldErrors.date = "Date is required.";

  if (Object.keys(fieldErrors).length > 0) return { fieldErrors };

  const res = await fetch(`${getApiUrl()}/transactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      type,
      category,
      amount,
      date,
      note: note.length ? note : undefined,
    }),
    cache: "no-cache",
  });

  if (!res.ok) {
    const payload = await readJsonSafe(res);

    if (res.status === 401) redirect("/auth/login");

    if (res.status === 400 && Array.isArray(payload?.message)) {
      return { fieldErrors: mapValidationMessages(payload.message) };
    }
    return { formError: payload?.message ?? "Could not create transaction." };
  }
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function deleteTransactionAction(formData: FormData) {
  const token = await getTokenOrRedirect();
  const id = Number(formData.get("id"));

  if (!Number.isFinite(id)) return;

  const res = await fetch(`${getApiUrl()}/transactions/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
  if (res.status === 401) redirect("auth/login");
  revalidatePath("/dashboard");
}
