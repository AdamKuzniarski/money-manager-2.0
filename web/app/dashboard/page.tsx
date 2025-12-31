import { cookies } from "next/headers";
import { redirect } from "next/navigation";



function getApiUrl() {
  return process.env.API_URL ?? "http://localhost:4000";
}

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("mm_token")?.value;
  if (!token) redirect("/auth/login");

  const res = await fetch(`${getApiUrl()}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!res.ok) redirect("/auth/login");

  const me = await res.json();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-2 text-zinc-400">Logged in as:</p>
      <pre className="mt-4 rounded-xl border border-zinc-800 bg-zinc-950 p-4">
        {JSON.stringify(me, null, 2)}
      </pre>
    </div>
  );
}
