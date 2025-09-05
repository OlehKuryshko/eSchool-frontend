#!/bin/sh
set -e

ROOT="/usr/share/nginx/html"
for f in "$ROOT/main.js" "$ROOT/main.js.map"; do
  [ -f "$f" ] && sed -i "s|BACKEND_URL|$BACKEND_URL|g" "$f"
done

exec "$@"
