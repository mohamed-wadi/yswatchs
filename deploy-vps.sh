#!/bin/bash
# YsWatchs — Script de déploiement VPS Hostinger
# A exécuter sur votre VPS (Ubuntu/Debian)
# Usage: bash deploy-vps.sh

set -e

DOMAIN="votre-domaine.com"      # ← Changez ici
APP_DIR="/var/www/yswatchs"
REPO="https://github.com/mohamed-wadi/yswatchs"

echo ""
echo "=========================================="
echo "  YsWatchs — Déploiement VPS"
echo "=========================================="
echo ""

# 1. Installer Node.js 20 LTS
echo "📦 Installation Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. Installer pnpm
echo "📦 Installation pnpm..."
npm install -g pnpm

# 3. Installer PM2
echo "📦 Installation PM2..."
npm install -g pm2

# 4. Installer Nginx
echo "📦 Installation Nginx..."
sudo apt-get install -y nginx

# 5. Cloner / mettre à jour le projet
echo "📂 Téléchargement du projet..."
if [ -d "$APP_DIR" ]; then
  cd $APP_DIR && git pull
else
  git clone $REPO $APP_DIR
  cd $APP_DIR
fi

# 6. Installer les dépendances
echo "📦 Installation des dépendances..."
pnpm install

# 7. Build de l'API
echo "🔨 Build API..."
pnpm --filter @workspace/api-server run build

# 8. Build du site boutique
echo "🔨 Build Boutique..."
PORT=3000 BASE_PATH=/ pnpm --filter @workspace/yswatchs run build

# 9. Build du panneau admin
echo "🔨 Build Admin..."
PORT=3001 BASE_PATH=/admin/ pnpm --filter @workspace/ys-admin run build

# 10. Lancer l'API avec PM2
echo "🚀 Démarrage API avec PM2..."
pm2 delete yswatchs-api 2>/dev/null || true
PORT=8080 pm2 start "$APP_DIR/artifacts/api-server/dist/index.mjs" \
  --name "yswatchs-api" \
  --env PORT=8080
pm2 save
pm2 startup

# 11. Configurer Nginx
echo "⚙️  Configuration Nginx..."
sudo bash -c "cat > /etc/nginx/sites-available/yswatchs" << EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    # Site boutique (root)
    location / {
        root $APP_DIR/artifacts/yswatchs/dist/public;
        try_files \$uri \$uri/ /index.html;
        add_header Cache-Control "public, max-age=3600";
    }

    # Panneau admin
    location /admin/ {
        root $APP_DIR/artifacts/ys-admin/dist/public;
        try_files \$uri \$uri/ /index.html;
        add_header Cache-Control "public, max-age=3600";
    }

    # API backend
    location /api/ {
        proxy_pass http://localhost:8080/;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/yswatchs /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

echo ""
echo "✅ Déploiement terminé !"
echo ""
echo "Prochaine étape — SSL (HTTPS) gratuit avec Certbot :"
echo "  sudo apt install certbot python3-certbot-nginx"
echo "  sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN"
echo ""
echo "  Boutique → http://$DOMAIN"
echo "  Admin    → http://$DOMAIN/admin/"
