#!/bin/sh
set -e

echo "Waiting for DB at $DATABASE_URL..."
# Optionally could parse host and wait, but docker-compose ensures DB healthy via depends_on condition

export PYTHONPATH=/app
echo "Running DB initialization..."
python -u src/scripts/init_db.py

echo "Starting uvicorn..."
exec uvicorn src.app:app --host 0.0.0.0 --port ${PORT:-8000} --reload
