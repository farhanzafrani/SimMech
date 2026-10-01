#!/usr/bin/env bash
# Builds the SimMec frontend and serves the production build on localhost.
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)"
FRONTEND_DIR="$SCRIPT_DIR/frontend"
PORT="${PORT:-4173}"

cd "$FRONTEND_DIR"

if [ ! -d node_modules ]; then
  echo "Installing frontend dependencies..."
  npm install
fi

echo "Building production bundle..."
npm run build

echo "Serving http://localhost:$PORT"
exec npm run preview -- --host localhost --port "$PORT" --strictPort
