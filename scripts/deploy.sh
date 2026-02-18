#!/usr/bin/env bash
set -Eeuo pipefail

COMPOSE_FILE="${COMPOSE_FILE:-docker-compose.server.yml}"
ENV_FILE="${ENV_FILE:-.env.server}"
REMOTE="${DEPLOY_REMOTE:-origin}"
BRANCH="${DEPLOY_BRANCH:-main}"
DO_PULL=1
DO_BUILD=1

usage() {
  cat <<'EOF'
Usage: scripts/deploy.sh [options]

Options:
  --no-pull               Skip git fetch/pull
  --no-build              Skip docker build step
  --branch <name>         Git branch to deploy (default: main)
  --remote <name>         Git remote to pull from (default: origin)
  --env-file <path>       Env file for compose (default: .env.server)
  --compose-file <path>   Compose file (default: docker-compose.server.yml)
  -h, --help              Show this help
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --no-pull)
      DO_PULL=0
      shift
      ;;
    --no-build)
      DO_BUILD=0
      shift
      ;;
    --branch)
      BRANCH="${2:-}"
      shift 2
      ;;
    --remote)
      REMOTE="${2:-}"
      shift 2
      ;;
    --env-file)
      ENV_FILE="${2:-}"
      shift 2
      ;;
    --compose-file)
      COMPOSE_FILE="${2:-}"
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown option: $1" >&2
      usage
      exit 1
      ;;
  esac
done

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Missing required command: $1" >&2
    exit 1
  fi
}

require_cmd git
require_cmd docker
require_cmd wget

if [[ ! -f "$COMPOSE_FILE" ]]; then
  echo "Compose file not found: $COMPOSE_FILE" >&2
  exit 1
fi

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Env file not found: $ENV_FILE" >&2
  exit 1
fi

if [[ "$DO_PULL" -eq 1 ]]; then
  echo ">> Fetching latest code from ${REMOTE}/${BRANCH}"
  git fetch "$REMOTE" "$BRANCH"

  current_branch="$(git rev-parse --abbrev-ref HEAD)"
  if [[ "$current_branch" != "$BRANCH" ]]; then
    git checkout "$BRANCH"
  fi

  git pull --ff-only "$REMOTE" "$BRANCH"
fi

echo ">> Starting containers"
compose_cmd=(docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d)
if [[ "$DO_BUILD" -eq 1 ]]; then
  compose_cmd+=(--build)
fi
"${compose_cmd[@]}"

echo ">> Waiting for API health"
for i in {1..30}; do
  if docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" exec -T api wget -qO- "http://localhost:4000/health" >/dev/null 2>&1; then
    echo ">> API is healthy"
    break
  fi
  if [[ "$i" -eq 30 ]]; then
    echo "API healthcheck failed after 30 attempts" >&2
    docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" ps
    exit 1
  fi
  sleep 2
done

echo ">> Deployment finished"
docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" ps
