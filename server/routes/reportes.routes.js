import { Router } from 'express';
import { pool } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/cosecha', requireAuth, async (req, res) => {
  const anio = Number(req.query.anio) || new Date().getFullYear();
  const [[{ totParcelas }]] = await pool.query('SELECT COUNT(*) AS totParcelas FROM parcelas');
  const [[{ totSiembras }]] = await pool.query('SELECT COUNT(*) AS totSiembras FROM siembras WHERE YEAR(fecha)=?', [anio]);
  const [lotes] = await pool.query('SELECT l.codigo, COUNT(c.id) AS catas, AVG(c.puntaje) AS promedio FROM lotes l LEFT JOIN catas c ON c.lote_id=l.id WHERE l.anio=? GROUP BY l.id ORDER BY l.codigo', [anio]);
  res.json({ anio, totalesParcelas: totParcelas, totalesSiembras: totSiembras, lotes });
});

export default router;
