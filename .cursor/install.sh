#!/usr/bin/env bash
# Idempotent Cloud Agent install: prepares Postgres, dependencies, schema, and seed data.
# Safe to run repeatedly and against cached/snapshotted state.
set -euo pipefail

cd "$(dirname "$0")/.."

DB_NAME="luxleaftea"
DB_USER="postgres"
DB_PASSWORD="postgres"

echo "==> Ensuring PostgreSQL is installed"
if ! command -v pg_ctlcluster >/dev/null 2>&1; then
  sudo apt-get update -y
  sudo DEBIAN_FRONTEND=noninteractive apt-get install -y postgresql postgresql-contrib
fi

PG_VER="$(ls /usr/lib/postgresql/ | sort -V | tail -n1)"

echo "==> Ensuring PostgreSQL cluster ${PG_VER}/main is running"
if ! sudo pg_isready -q 2>/dev/null; then
  sudo pg_ctlcluster "${PG_VER}" main start || sudo pg_ctlcluster "${PG_VER}" main restart
fi
# Wait for the server to accept connections.
for _ in $(seq 1 30); do
  if sudo pg_isready -q; then break; fi
  sleep 1
done

echo "==> Ensuring role and database exist"
sudo -u postgres psql -v ON_ERROR_STOP=1 -c "ALTER USER ${DB_USER} WITH PASSWORD '${DB_PASSWORD}';"
if ! sudo -u postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname='${DB_NAME}'" | grep -q 1; then
  sudo -u postgres createdb "${DB_NAME}"
fi

echo "==> Ensuring .env exists"
if [ ! -f .env ]; then
  cp .env.example .env
fi

echo "==> Installing npm dependencies (runs prisma generate via postinstall)"
npm ci

# Load DATABASE_URL / DIRECT_URL for Prisma CLI + tsx seed (tsx does not read .env).
set -a
# shellcheck disable=SC1091
. ./.env
set +a

echo "==> Applying database migrations"
npx prisma migrate deploy

echo "==> Seeding database"
npm run db:seed

echo "==> Install complete"
