#!/bin/bash
# YsWatchs — Local Development Starter
# Usage: bash start-dev.sh

set -e

echo ""
echo "=========================================="
echo "  YsWatchs — Démarrage local"
echo "=========================================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
  echo "❌ Node.js non trouvé. Installez Node.js v18+ depuis https://nodejs.org"
  exit 1
fi

NODE_VER=$(node -e "process.stdout.write(process.versions.node)")
echo "✅ Node.js $NODE_VER"

# Check pnpm
if ! command -v pnpm &> /dev/null; then
  echo "⚙️  Installation de pnpm..."
  npm install -g pnpm
fi
echo "✅ pnpm $(pnpm --version)"

# Install dependencies
echo ""
echo "📦 Installation des dépendances..."
pnpm install

echo ""
echo "🚀 Démarrage des 3 services..."
echo "   API Server  →  http://localhost:8080"
echo "   Boutique    →  http://localhost:3000"
echo "   Admin       →  http://localhost:3001/admin/"
echo ""
echo "Appuyez sur Ctrl+C pour arrêter"
echo ""

# Start all 3 services in parallel
trap 'kill 0' EXIT

PORT=8080 pnpm --filter @workspace/api-server run dev &
sleep 2
PORT=3000 BASE_PATH=/ pnpm --filter @workspace/yswatchs run dev &
PORT=3001 BASE_PATH=/admin/ pnpm --filter @workspace/ys-admin run dev &

wait
