import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { buildApiUrl } from "@/lib/api-url";

const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME ?? "mm_token";

async function getToken() {
  const store = await cookies();
  return store.get(AUTH_COOKIE_NAME)?.value ?? null;
}

function passthrough(upstream: Response, bodyText: string) {
  return new NextResponse(bodyText, {
    status: upstream.status,
    headers: {
      "Content-Type":
        upstream.headers.get("content-type") ??
        "application/json; charset=utf-8",
    },
  });
}

export async function GET() {
  const token = await getToken();
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const upstream = await fetch(buildApiUrl("/transactions"), {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  const text = await upstream.text();
  return passthrough(upstream, text);
}

export async function POST(req: Request) {
  const token = await getToken();
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const upstream = await fetch(buildApiUrl("/transactions"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const text = await upstream.text();
  return passthrough(upstream, text);
}
