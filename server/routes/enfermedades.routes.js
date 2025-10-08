import { Router } from 'express';
import { pool } from '../db.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, async (req, res) => {
  const [rows] = await pool.query(
    `SELECT e.id, e.siembra_id, e.tipo, e.severidad, e.fecha, e.observaciones,
            CONCAT(p.nombre, ' / ', t.nombre) AS siembra
     FROM siembras_enfermedad e
     JOIN siembras s ON s.id = e.siembra_id
     JOIN parcelas p ON p.id = s.parcela_id
     JOIN tipos_uva t ON t.id = s.tipo_uva_id
     ORDER BY e.id DESC`
  );
  res.json(rows);
});

router.post('/', requireAuth, requireRole('admin'), async (req, res) => {
  const { siembra_id, tipo, severidad, fecha, observaciones } = req.body;
  if (!siembra_id || !tipo || !severidad || !fecha) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'siembra_id, tipo, severidad, fecha requeridos' } });
  }
  try {
    const [r] = await pool.query(
      'INSERT INTO siembras_enfermedad (siembra_id, tipo, severidad, fecha, observaciones) VALUES (?,?,?,?,?)',
      [siembra_id, tipo, severidad, fecha, observaciones || null]
    );
    res.status(201).json({ id: r.insertId });
  } catch (e) {
    res.status(400).json({ error: { code: 'DB_ERROR', message: String(e) } });
  }
});

router.patch('/:id', requireAuth, requireRole('admin'), async (req, res) => {
  const { id } = req.params;
  const { siembra_id, tipo, severidad, fecha, observaciones } = req.body;
  try {
    await pool.query(
      'UPDATE siembras_enfermedad SET siembra_id=COALESCE(?, siembra_id), tipo=COALESCE(?, tipo), severidad=COALESCE(?, severidad), fecha=COALESCE(?, fecha), observaciones=COALESCE(?, observaciones) WHERE id=?',
      [siembra_id ?? null, tipo ?? null, severidad ?? null, fecha ?? null, observaciones ?? null, id]
    );
    const [rows] = await pool.query('SELECT * FROM siembras_enfermedad WHERE id=?', [id]);
    res.json(rows[0] || null);
  } catch (e) {
    res.status(400).json({ error: { code: 'DB_ERROR', message: String(e) } });
  }
});

router.delete('/:id', requireAuth, requireRole('admin'), async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM siembras_enfermedad WHERE id=?', [id]);
  res.json({ ok: true });
});

export default router;
