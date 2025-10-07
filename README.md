# VINOCOSTERO – Prototipo MVP (Node + React + Bootstrap + MySQL)

## Requisitos
- Node.js 20+
- MySQL 8

## Pasos rápidos
```bash
# 1) Base de datos
mysql -u root -p < sql/schema.sql
mysql -u root -p < sql/seeds.sql

# 2) Backend
cd server
cp .env.example .env
npm install
npm run dev  # http://localhost:4000

# 3) Frontend
cd ../web
npm install
npm run dev  # http://localhost:5173
```

## Credenciales
- admin@vc.com / Admin123!
- visor@vc.com / Visor123!
