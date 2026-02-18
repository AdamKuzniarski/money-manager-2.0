# Money Manager 2.0

Money Manager 2.0 is a personal finance dashboard with separate frontend and backend apps.

## Tech Stack

- **Frontend:** Next.js, TypeScript, Tailwind CSS
- **Backend:** NestJS, TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Infrastructure:** Docker, Docker Compose, Hetzner

## Project Structure

- `web/` – Next.js frontend application
- `api/` – NestJS backend API
- `Caddyfile.local` – local reverse proxy for API (`localhost:8080`)
- `Caddyfile` – production reverse proxy with TLS for API domain
- `docker-compose.server.yml` – server stack for Hetzner (API + DB + Caddy)

## Local Run (Docker)

```bash
docker compose up --build
```

- Frontend: `http://localhost:3000`
- API via Caddy: `http://localhost:8080`
- API direct (debug): `http://localhost:4000`

## Server Deploy (Hetzner VPS + Vercel FE)

1. Copy env template and fill values:

```bash
cp .env.server.example .env.server
```

2. Start server stack:

```bash
docker compose -f docker-compose.server.yml --env-file .env.server up -d --build
```

3. Run Prisma migrations:

```bash
docker compose -f docker-compose.server.yml --env-file .env.server exec api npx prisma migrate deploy
```

4. Set Vercel env vars:

- `API_URL=https://<your-api-domain>`
- `NEXT_PUBLIC_API_URL=https://<your-api-domain>`
- `AUTH_COOKIE_NAME=mm_token` (optional, if changed in API)

## CORS Configuration (API)

Backend CORS now supports both local and server config:

- `FRONTEND_URL` for your main frontend URL
- `CORS_ORIGINS` as comma-separated allow-list (e.g. preview/staging domains)
