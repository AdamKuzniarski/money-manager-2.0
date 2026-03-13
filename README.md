# Money Manager 2.0

Money Manager 2.0 is a personal finance dashboard built as a **split frontend + backend** system.
It supports **income/expense transactions**, **stats**, **charts**, and **JWT auth**.

Repo structure:
- `web/` — Next.js App Router frontend (also acts as a small BFF via `/app/api/*`)
- `api/` — NestJS REST API
- PostgreSQL + Prisma
- Docker + Caddy + deploy scripts (Hetzner-friendly)

## Features
- ✅ Auth: register/login (JWT)
- ✅ CRUD transactions (INCOME / EXPENSE)
- ✅ Dashboard: stats + charts
- ✅ Summary endpoint for analytics
- ✅ Production-ready setup: Docker Compose, reverse proxy (Caddy), migrations

## Tech Stack
- Frontend: Next.js, TypeScript, Tailwind CSS
- Backend: NestJS, TypeScript
- Database: PostgreSQL
- ORM: Prisma
- Infra: Docker, Docker Compose, Caddy, Hetzner VPS

## API Overview (high level)
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me` (protected)
- `GET /transactions`
- `GET /transactions/summary`
- `POST /transactions`
- `PATCH /transactions/:id`
- `DELETE /transactions/:id`
- `GET /health` + `GET /health/db`

## Local Run (Docker)
```bash
docker compose up --build
