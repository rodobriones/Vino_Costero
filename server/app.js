import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { pool } from './db.js';

import authRoutes from './routes/auth.routes.js';
import parcelasRoutes from './routes/parcelas.routes.js';
import tiposUvaRoutes from './routes/tiposUva.routes.js';
import siembrasRoutes from './routes/siembras.routes.js';
import catasRoutes from './routes/catas.routes.js';
import reportesRoutes from './routes/reportes.routes.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.json({ ok: true, name: 'VINOCOSTERO API' }));

app.use('/auth', authRoutes);
app.use('/parcelas', parcelasRoutes);
app.use('/tipos-uva', tiposUvaRoutes);
app.use('/siembras', siembrasRoutes);
app.use('/catas', catasRoutes);
app.use('/reportes', reportesRoutes);

// health check DB
app.get('/health/db', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 as ok');
    res.json({ db: 'up', rows });
  } catch (e) {
    res.status(500).json({ db: 'down', error: String(e) });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
