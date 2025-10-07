import { Router } from 'express';
import { pool } from '../db.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/lotes', requireAuth, async (req, res) => {
  const { anio } = req.query;
  let sql = 'SELECT * FROM lotes';
  const params = [];
  if (anio) { sql += ' WHERE anio=?'; params.push(anio); }
  sql += ' ORDER BY id DESC';
  const [rows] = await pool.query(sql, params);
  res.json(rows);
});

router.post('/', requireAuth, requireRole('admin'), async (req, res) => {
  const { lote_id, puntaje, notas, fecha } = req.body;
  if (!lote_id || puntaje == null || !fecha) return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'lote_id, puntaje, fecha requeridos' } });
  if (puntaje < 0 || puntaje > 100) return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'puntaje debe estar entre 0 y 100' } });
  try {
    const [r] = await pool.query('INSERT INTO catas (lote_id, puntaje, notas, fecha) VALUES (?,?,?,?)',
      [lote_id, puntaje, notas || null, fecha]);
    res.status(201).json({ id: r.insertId });
  } catch (e) {
    res.status(400).json({ error: { code: 'DB_ERROR', message: String(e) } });
  }
});

export default router;
