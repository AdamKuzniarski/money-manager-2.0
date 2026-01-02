export type TransactionType = "INCOME" | "EXPENSE";

export type Transaction = {
  id: number;
  userId: number;
  type: TransactionType;
  category: string;
  amount: string; // Prisma Decimal kommt als String
  date: string; // ISO string
  note: string | null;
  createdAt: string;
  updatedAt: string;
};

export type TxFieldErrors = {
  type?: string;
  category?: string;
  amount?: string;
  date?: string;
  note?: string;
};

export function toDateInputValue(iso: string) {
  // "2026-01-01T" -> "2026-01-01"
  return typeof iso === "string" && iso.length >= 10 ? iso.slice(0, 10) : "";
}

export function mapValidationMessages(messages: string[]) {
  const fieldErrors: TxFieldErrors = {};
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

export async function readJsonSafe(res: Response) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}
