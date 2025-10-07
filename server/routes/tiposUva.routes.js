import { Router } from 'express';
import { pool } from '../db.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM tipos_uva ORDER BY id DESC');
  res.json(rows);
});

router.post('/', requireAuth, requireRole('admin'), async (req, res) => {
  const { nombre, codigo } = req.body;
  if (!nombre || !codigo) return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'nombre y codigo requeridos' } });
  try {
    const [r] = await pool.query('INSERT INTO tipos_uva (nombre, codigo) VALUES (?,?)', [nombre, codigo]);
    res.status(201).json({ id: r.insertId });
  } catch (e) {
    res.status(400).json({ error: { code: 'DB_ERROR', message: String(e) } });
  }
});

export default router;
