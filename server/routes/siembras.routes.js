import { Router } from 'express';
import { pool } from '../db.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, async (req, res) => {
  const { parcelaId, tipoUvaId } = req.query;
  let sql = 'SELECT s.*, p.nombre AS parcela, t.nombre AS tipo_uva FROM siembras s JOIN parcelas p ON p.id=s.parcela_id JOIN tipos_uva t ON t.id=s.tipo_uva_id';
  const params = [];
  const where = [];
  if (parcelaId) { where.push('s.parcela_id=?'); params.push(parcelaId); }
  if (tipoUvaId) { where.push('s.tipo_uva_id=?'); params.push(tipoUvaId); }
  if (where.length) sql += ' WHERE ' + where.join(' AND ');
  sql += ' ORDER BY s.id DESC';
  const [rows] = await pool.query(sql, params);
  res.json(rows);
});

router.post('/', requireAuth, requireRole('admin'), async (req, res) => {
  const { parcela_id, tipo_uva_id, fecha, responsable } = req.body;
  if (!parcela_id || !tipo_uva_id || !fecha) return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'parcela_id, tipo_uva_id, fecha requeridos' } });
  try {
    const [r] = await pool.query('INSERT INTO siembras (parcela_id, tipo_uva_id, fecha, responsable) VALUES (?,?,?,?)',
      [parcela_id, tipo_uva_id, fecha, responsable || null]);
    res.status(201).json({ id: r.insertId });
  } catch (e) {
    res.status(400).json({ error: { code: 'DB_ERROR', message: String(e) } });
  }
});

export default router;
