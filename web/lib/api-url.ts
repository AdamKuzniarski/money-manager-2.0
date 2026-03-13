const API_BASE_URL =
  process.env.API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:4000";

function trimTrailingSlashes(value: string) {
  return value.replace(/\/+$/, "");
}

export function buildApiUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const normalizedBase = trimTrailingSlashes(API_BASE_URL);
  const hasApiPrefix = /\/api$/i.test(normalizedBase);

  return `${normalizedBase}${hasApiPrefix ? "" : "/api"}${normalizedPath}`;
}
