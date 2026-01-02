import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME ?? "mm_token";

export default async function HomePage() {
  // Wenn eingeloggt: direkt ins Dashboard (Homepage ist “Marketing/Entry”)
  const store = await cookies();
  const token = store.get(AUTH_COOKIE_NAME)?.value;
  if (token) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Top Bar */}
      <header className="border-b border-zinc-800/80 bg-zinc-950/70 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="font-bold tracking-wide">
            <span className="text-emerald-400">MONEY</span> MANAGER
          </div>

          <nav className="flex items-center gap-2">
            <Link
              href="/auth/login"
              className="rounded-xl border border-zinc-800 px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-900"
            >
              Log in
            </Link>
            <Link
              href="/auth/register"
              className="rounded-xl bg-emerald-500 px-3 py-2 text-sm font-semibold text-black hover:bg-emerald-400"
            >
              Create account
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main className="mx-auto max-w-5xl px-4 py-12">
        <div className="rounded-3xl border border-zinc-800 bg-zinc-950/50 p-6 shadow-[0_0_120px_rgba(16,185,129,0.08)]">
          <p className="text-sm text-emerald-300/90">
            Mobile-first • Simple • Private
          </p>

          <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Track income & expenses{" "}
            <span className="text-emerald-400">without chaos</span>.
          </h1>

          <p className="mt-3 max-w-prose text-zinc-300">
            Minimal money tracking. Add transactions fast, see what’s going on,
            stay in control.
          </p>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-4 py-2 font-semibold text-black hover:bg-emerald-400"
            >
              Get started
            </Link>
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center rounded-xl border border-zinc-800 px-4 py-2 font-semibold text-zinc-200 hover:bg-zinc-900"
            >
              I already have an account
            </Link>
          </div>
        </div>

        {/* Features */}
        <section className="mt-10 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4">
            <h2 className="font-semibold">Fast entries</h2>
            <p className="mt-1 text-sm text-zinc-300">
              One form. Type, category, amount, date. Done.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4">
            <h2 className="font-semibold">Your data stays yours</h2>
            <p className="mt-1 text-sm text-zinc-300">
              Auth + protected routes. No weird magic.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4">
            <h2 className="font-semibold">Clean dashboard</h2>
            <p className="mt-1 text-sm text-zinc-300">
              Transactions list + CRUD. The essentials first.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4">
            <h2 className="font-semibold">Ready for deployment</h2>
            <p className="mt-1 text-sm text-zinc-300">
              Docker backend + Vercel frontend = nice shipping story.
            </p>
          </div>
        </section>

        {/* Preview Card (finance app vibe) */}
        <section className="mt-10 rounded-3xl border border-zinc-800 bg-zinc-950/60 p-6">
          <h2 className="text-lg font-semibold">Preview</h2>
          <p className="mt-1 text-sm text-zinc-300">
            That’s the vibe we’re building inside the dashboard.
          </p>

          <div className="mt-4 grid gap-3">
            {[
              {
                type: "INCOME",
                category: "Salary",
                amount: "+ 1640.22",
                note: "December",
                date: "2025-12-12",
              },
              {
                type: "EXPENSE",
                category: "Food",
                amount: "- 12.50",
                note: "Pizza",
                date: "2025-12-30",
              },
              {
                type: "EXPENSE",
                category: "Rent",
                amount: "- 820.00",
                note: "January",
                date: "2026-01-01",
              },
            ].map((t, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={
                        "rounded-full px-2 py-1 text-xs font-semibold " +
                        (t.type === "INCOME"
                          ? "bg-emerald-500/15 text-emerald-300 border border-emerald-900/40"
                          : "bg-red-500/10 text-red-200 border border-red-900/40")
                      }
                    >
                      {t.type}
                    </span>
                    <span className="truncate font-medium">{t.category}</span>
                    <span className="text-xs text-zinc-500">{t.date}</span>
                  </div>
                  <div className="mt-1 truncate text-sm text-zinc-400">
                    {t.note}
                  </div>
                </div>

                <div className="ml-4 whitespace-nowrap font-semibold">
                  {t.amount}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-800/80">
        <div className="mx-auto max-w-5xl px-4 py-6 text-sm text-zinc-500">
          Money Manager 2.0 • built to be boring & reliable
        </div>
      </footer>
    </div>
  );
}
