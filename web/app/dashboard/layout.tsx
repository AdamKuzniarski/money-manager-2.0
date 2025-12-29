import { LogoutButton } from "@/components/auth/logout-button";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME ?? "mm_token";
const API_URL = process.env.API_URL ?? "http://localhost:4000";

async function getMe() {
  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;

  const res = await fetch(`${API_URL}/auth/me`, {
    headers: {
      // Cookie an API weitergeben -server side
      Cookie: `${AUTH_COOKIE_NAME}=${token}`,
    },
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json() as Promise<{ userId: number; email: string }>;
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const me = await getMe();

  if (!me) redirect("/auth/login");
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800 bg-zinc-950/60 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="font-bold tracking-wide">
            <span className="text-emerald-400">MONEY</span> MANAGER
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-zinc-400 hidden sm:block">
              {me.email}
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
    </div>
  );
}
