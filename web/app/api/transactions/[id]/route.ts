import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL =
  process.env.API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:4000";

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

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const token = await getToken();
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;
  const body = await req.json();

  const upstream = await fetch(`${API_URL}/transactions/${id}`, {
    method: "PATCH",
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

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const token = await getToken();
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;

  const upstream = await fetch(`${API_URL}/transactions/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  const text = await upstream.text();
  return passthrough(upstream, text);
}
