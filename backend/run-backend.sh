#!/bin/sh
# Cross-platform FastAPI backend runner with venv activation and requirements install
SCRIPT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$SCRIPT_DIR"

. ./activate-venv.sh

if [ -z "$VIRTUAL_ENV" ]; then
  echo "[ERROR] Failed to activate venv."
  exit 1
fi

pip install -r backend/requirements.txt

cd backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 # --reload
