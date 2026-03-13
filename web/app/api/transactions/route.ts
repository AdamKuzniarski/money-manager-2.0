import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { buildApiUrl } from '@/lib/api-url';

const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME ?? 'mm_token';

async function getToken() {
  const store = await cookies();
  return store.get(AUTH_COOKIE_NAME)?.value ?? null;
}

function passthrough(upstream: Response, bodyText: string) {
  return new NextResponse(bodyText, {
    status: upstream.status,
    headers: {
      'Content-Type':
        upstream.headers.get('content-type') ??
        'application/json; charset=utf-8',
    },
  });
}

export async function GET() {
  try {
    const token = await getToken();
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const url = buildApiUrl('/transactions');
    console.log('[GET /api/transactions] upstream:', url);

    const upstream = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });

    const text = await upstream.text();
    console.log('[GET /api/transactions] status:', upstream.status, text);

    return passthrough(upstream, text);
  } catch (error) {
    console.error('[GET /api/transactions] failed:', error);
    return NextResponse.json(
      { message: 'Proxy failed', detail: String(error) },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const token = await getToken();
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const url = buildApiUrl('/transactions');

    console.log('[POST /api/transactions] upstream:', url, body);

    const upstream = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    const text = await upstream.text();
    console.log('[POST /api/transactions] status:', upstream.status, text);

    return passthrough(upstream, text);
  } catch (error) {
    console.error('[POST /api/transactions] failed:', error);
    return NextResponse.json(
      { message: 'Proxy failed', detail: String(error) },
      { status: 500 },
    );
  }
}
