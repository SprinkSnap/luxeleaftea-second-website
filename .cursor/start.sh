#!/usr/bin/env bash
# Per-boot reconciliation: bring the local PostgreSQL server up so the app can
# reach it. Idempotent and safe to run on every environment start.
set -euo pipefail

cd "$(dirname "$0")/.."

DB_NAME="luxleaftea"
DB_USER="postgres"
DB_PASSWORD="postgres"

PG_VER="$(ls /usr/lib/postgresql/ 2>/dev/null | sort -V | tail -n1 || true)"
if [ -z "${PG_VER}" ]; then
  echo "PostgreSQL is not installed; run .cursor/install.sh first." >&2
  exit 1
fi

echo "==> Starting PostgreSQL cluster ${PG_VER}/main (if not already running)"
if ! sudo pg_isready -q 2>/dev/null; then
  sudo pg_ctlcluster "${PG_VER}" main start || sudo pg_ctlcluster "${PG_VER}" main restart
fi
for _ in $(seq 1 30); do
  if sudo pg_isready -q; then break; fi
  sleep 1
done

# Ensure role/database exist (harmless if they already do). This makes a fresh
# boot resilient even if the data directory was not part of a snapshot.
sudo -u postgres psql -v ON_ERROR_STOP=1 -c "ALTER USER ${DB_USER} WITH PASSWORD '${DB_PASSWORD}';" >/dev/null 2>&1 || true
if ! sudo -u postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname='${DB_NAME}'" | grep -q 1; then
  sudo -u postgres createdb "${DB_NAME}" || true
fi

echo "==> PostgreSQL is ready on 127.0.0.1:5432"
