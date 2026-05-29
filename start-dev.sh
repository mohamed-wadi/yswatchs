#!/bin/bash
# YsWatchs — Démarrage local (Linux / macOS)
# Usage: bash start-dev.sh

set -e

echo ""
echo "=========================================="
echo "  YsWatchs — Démarrage local"
echo "=========================================="
echo ""

# Vérifier Node.js
if ! command -v node &> /dev/null; then
  echo "❌ Node.js non trouvé."
  echo "   Installez Node.js v20+ depuis https://nodejs.org"
  exit 1
fi

NODE_VER=$(node -e "process.stdout.write(process.versions.node)")
echo "✅ Node.js $NODE_VER"

# Vérifier pnpm
if ! command -v pnpm &> /dev/null; then
  echo "⚙️  Installation de pnpm..."
  npm install -g pnpm
fi
echo "✅ pnpm $(pnpm --version)"

# Installer les dépendances
echo ""
echo "📦 Installation des dépendances..."
pnpm install

echo ""
echo "🚀 Démarrage des 3 services en parallèle..."
echo "   API Server  →  http://localhost:8080"
echo "   Boutique    →  http://localhost:3000"
echo "   Admin       →  http://localhost:3001/admin/"
echo ""
echo "Appuyez sur Ctrl+C pour tout arrêter"
echo ""

# Arrêter tous les processus enfants à la sortie
trap 'echo ""; echo "Arrêt des services..."; kill 0' EXIT INT TERM

PORT=8080 pnpm --filter @workspace/api-server run dev &
sleep 2
PORT=3000 BASE_PATH=/ pnpm --filter @workspace/yswatchs run dev &
PORT=3001 BASE_PATH=/admin/ pnpm --filter @workspace/ys-admin run dev &

wait
