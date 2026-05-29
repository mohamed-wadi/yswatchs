# YsWatchs — E-commerce Montres de Luxe (Maroc)

Plateforme e-commerce pour montres de luxe, avec vitrine victorienne, panneau d'administration, et API backend.

## Run & Operate

- **Boutique** : `PORT=3000 BASE_PATH=/ pnpm --filter @workspace/yswatchs run dev`
- **Admin** : `PORT=3001 BASE_PATH=/admin/ pnpm --filter @workspace/ys-admin run dev`
- **API** : `PORT=8080 pnpm --filter @workspace/api-server run dev`
- `pnpm run typecheck` — vérification TypeScript complète
- `pnpm run build` — build production de tous les packages

## Démarrage local rapide

- **Linux / macOS** : `bash start-dev.sh`
- **Windows** : double-cliquer sur `start-dev.bat`

## Déploiement VPS Hostinger

```bash
# Éditer d'abord DOMAIN et REPO dans deploy-vps.sh
bash deploy-vps.sh
```

## Stack

- pnpm workspaces, Node.js 20, TypeScript 5.9
- Frontend : React + Vite + Wouter + Framer Motion + Tailwind CSS
- Admin : React + Vite + Recharts + Lucide React
- API : Express 5
- DB : PostgreSQL + Drizzle ORM
- Build : esbuild (API), Vite (frontends)

## Architecture

```
artifacts/
  yswatchs/     — Boutique (port 3000)
  ys-admin/     — Admin Dashboard (port 3001, /admin/)
  api-server/   — API REST (port 8080, /api/)
lib/
  db/           — Schéma Drizzle ORM
  api-spec/     — OpenAPI spec
  api-client-react/ — Hooks générés (Orval)
  api-zod/      — Schémas Zod partagés
```

## Where things live

- Schéma DB : `lib/db/src/schema/index.ts`
- Données admin (store) : `artifacts/ys-admin/src/lib/store.tsx`
- Données boutique : `artifacts/yswatchs/src/lib/data.ts`
- Auth admin + 2FA : `artifacts/ys-admin/src/lib/auth.tsx`
- TOTP (Google Authenticator) : `artifacts/ys-admin/src/lib/totp.ts`
- Config déploiement Nginx : `deploy-vps.sh`

## Accès admin

- URL : `http://localhost:3001/admin/`
- Email : `admin@yswatchs.com` / Mot de passe : `Admin@2025`
- Email : `editor@yswatchs.com` / Mot de passe : `Editor@2025`

## Fonctionnalités

**Boutique (yswatchs)**
- Catalogue avec filtres hommes/femmes/collections
- Page produit avec zoom manuel (clic sur loupe), galerie d'images
- Panier, commande, promotions
- Thème victorien, dark/light mode

**Admin (ys-admin)**
- Dashboard avec KPIs, graphiques CA/commandes
- Gestion commandes (cycle : pending → confirmée → expédiée → livrée)
- Inventaire & stocks
- Clients & CRM
- Blacklist téléphonique
- Promotions
- Analytics
- Paramètres : boutique, livraison, sécurité (2FA optionnelle)

**2FA Admin (Google Authenticator)**
- Optionnelle — activable/désactivable depuis Paramètres > Sécurité
- Requiert confirmation du mot de passe
- QR code à scanner avec Google Authenticator
- Vérification TOTP (RFC 6238) en pur JS (Web Crypto API)

## User preferences

- Langue française pour l'interface
- Devise MAD pour les prix
- Marché marocain
