#!/bin/bash
# YsWatchs — Script de déploiement VPS Hostinger (Ubuntu/Debian)
# Usage: bash deploy-vps.sh
# Assurez-vous d'être connecté en tant que root ou utilisateur sudo

set -e

DOMAIN="votre-domaine.com"        # ← Remplacez par votre domaine
APP_DIR="/var/www/yswatchs"
REPO="https://github.com/votre-compte/yswatchs"   # ← Remplacez par votre repo

echo ""
echo "=========================================="
echo "  YsWatchs — Déploiement VPS Hostinger"
echo "=========================================="
echo ""

# 1. Mise à jour système
echo "🔄 Mise à jour du système..."
sudo apt-get update -y

# 2. Installer Node.js 20 LTS
echo "📦 Installation de Node.js 20 LTS..."
if ! command -v node &> /dev/null; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi
echo "✅ Node.js $(node -v)"

# 3. Installer pnpm
echo "📦 Installation de pnpm..."
if ! command -v pnpm &> /dev/null; then
  npm install -g pnpm
fi
echo "✅ pnpm $(pnpm --version)"

# 4. Installer PM2
echo "📦 Installation de PM2..."
if ! command -v pm2 &> /dev/null; then
  npm install -g pm2
fi
echo "✅ PM2 $(pm2 --version)"

# 5. Installer Nginx
echo "📦 Installation de Nginx..."
if ! command -v nginx &> /dev/null; then
  sudo apt-get install -y nginx
fi
echo "✅ Nginx installé"

# 6. Cloner ou mettre à jour le projet
echo "📂 Récupération du code source..."
if [ -d "$APP_DIR/.git" ]; then
  cd "$APP_DIR" && git pull
else
  sudo mkdir -p "$APP_DIR"
  sudo chown "$USER:$USER" "$APP_DIR"
  git clone "$REPO" "$APP_DIR"
  cd "$APP_DIR"
fi

# 7. Installer les dépendances
echo "📦 Installation des dépendances npm..."
cd "$APP_DIR"
pnpm install --frozen-lockfile

# 8. Build de l'API backend
echo "🔨 Build de l'API backend..."
pnpm --filter @workspace/api-server run build

# 9. Build du site boutique
echo "🔨 Build du site boutique..."
PORT=3000 BASE_PATH=/ pnpm --filter @workspace/yswatchs run build

# 10. Build du panneau admin
echo "🔨 Build du panneau admin..."
PORT=3001 BASE_PATH=/admin/ pnpm --filter @workspace/ys-admin run build

# 11. Lancer l'API avec PM2
echo "🚀 Démarrage de l'API avec PM2..."
pm2 delete yswatchs-api 2>/dev/null || true
DATABASE_URL="${DATABASE_URL:-}" \
PORT=8080 \
pm2 start "$APP_DIR/artifacts/api-server/dist/index.js" \
  --name "yswatchs-api" \
  --env production
pm2 save
pm2 startup | tail -n 1 | sudo bash || true

# 12. Configurer Nginx
echo "⚙️  Configuration de Nginx..."
sudo bash -c "cat > /etc/nginx/sites-available/yswatchs" << NGINX_CONF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    # Gzip
    gzip on;
    gzip_types text/plain text/css application/javascript application/json image/svg+xml;

    # Boutique (racine)
    location / {
        root $APP_DIR/artifacts/yswatchs/dist/public;
        try_files \$uri \$uri/ /index.html;
        add_header Cache-Control "public, max-age=3600";
    }

    # Assets statiques boutique — cache long
    location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico|woff2?)$ {
        root $APP_DIR/artifacts/yswatchs/dist/public;
        expires 7d;
        add_header Cache-Control "public, immutable";
    }

    # Panneau admin
    location /admin {
        alias $APP_DIR/artifacts/ys-admin/dist/public;
        try_files \$uri \$uri/ /admin/index.html;
        add_header Cache-Control "no-cache";
    }

    # Assets statiques admin
    location /admin/assets/ {
        alias $APP_DIR/artifacts/ys-admin/dist/public/assets/;
        expires 7d;
        add_header Cache-Control "public, immutable";
    }

    # API backend (proxy)
    location /api/ {
        proxy_pass http://127.0.0.1:8080/api/;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_read_timeout 30s;
    }
}
NGINX_CONF

sudo ln -sf /etc/nginx/sites-available/yswatchs /etc/nginx/sites-enabled/yswatchs
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx

echo ""
echo "=========================================="
echo "  ✅ Déploiement terminé !"
echo "=========================================="
echo ""
echo "  Boutique  → http://$DOMAIN"
echo "  Admin     → http://$DOMAIN/admin"
echo "  API       → http://$DOMAIN/api/health"
echo ""
echo "─── HTTPS gratuit avec Certbot ───────────"
echo "  sudo apt install -y certbot python3-certbot-nginx"
echo "  sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN"
echo ""
echo "─── Commandes utiles ─────────────────────"
echo "  pm2 status          — état des services"
echo "  pm2 logs yswatchs-api   — logs API"
echo "  pm2 restart yswatchs-api — redémarrer l'API"
echo ""
