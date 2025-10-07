import { Router } from 'express';
import { pool } from '../db.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM parcelas ORDER BY id DESC');
  res.json(rows);
});

router.post('/', requireAuth, requireRole('admin'), async (req, res) => {
  const { nombre, hectareas, activo = 1 } = req.body;
  if (!nombre || !hectareas) return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'nombre y hectareas son requeridos' } });
  try {
    const [r] = await pool.query('INSERT INTO parcelas (nombre, hectareas, activo) VALUES (?,?,?)', [nombre, hectareas, activo ? 1 : 0]);
    res.status(201).json({ id: r.insertId });
  } catch (e) {
    res.status(400).json({ error: { code: 'DB_ERROR', message: String(e) } });
  }
});

router.patch('/:id', requireAuth, requireRole('admin'), async (req, res) => {
  const { id } = req.params;
  const { nombre, hectareas, activo } = req.body;
  await pool.query('UPDATE parcelas SET nombre=COALESCE(?, nombre), hectareas=COALESCE(?, hectareas), activo=COALESCE(?, activo) WHERE id=?',
    [nombre, hectareas, typeof activo==='boolean'? (activo?1:0): NULL, id])
    .catch(()=>{})
  const [row] = await pool.query('SELECT * FROM parcelas WHERE id=?',[id]);
  res.json(row[0] || null);
});

export default router;
