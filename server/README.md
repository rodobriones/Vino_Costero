# VINOCOSTERO API (Express)

## Setup
1. Copia `.env.example` a `.env` y ajusta credenciales MySQL.
2. Crea DB y semillas:
   ```bash
   mysql -u root -p < ../sql/schema.sql
   mysql -u root -p < ../sql/seeds.sql
   ```
3. Instala deps y corre:
   ```bash
   npm install
   npm run dev
   ```

## Endpoints
- POST /auth/login
- GET /parcelas, POST /parcelas, PATCH /parcelas/:id
- GET /tipos-uva, POST /tipos-uva
- GET /siembras, POST /siembras, POST /siembras/:id/enfermedad
- GET /catas/lotes?anio=2025, POST /catas
- GET /reportes/cosecha?anio=2025

Todas (menos login) requieren header `Authorization: Bearer <TOKEN>`.
