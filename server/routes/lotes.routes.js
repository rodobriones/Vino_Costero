import { Router } from 'express'
import { pool } from '../db.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

const router = Router()

// Listar lotes con nombre de parcela
router.get('/', requireAuth, async (req, res) => {
  const [rows] = await pool.query(`
    SELECT l.id, l.codigo, l.anio, l.parcela_id, p.nombre AS parcela
    FROM lotes l
    JOIN parcelas p ON p.id = l.parcela_id
    ORDER BY l.anio DESC, l.codigo
  `)
  res.json(rows)
})

// Crear lote (admin)
router.post('/', requireAuth, requireRole('admin'), async (req, res) => {
  const { codigo, anio, parcela_id, fecha_cosecha = null, cantidad_litros = null, notas = null } = req.body
  if (!codigo || !anio || !parcela_id) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'codigo, anio y parcela_id son requeridos' } })
  }

  // valida que exista la parcela
  const [parc] = await pool.query('SELECT id FROM parcelas WHERE id=?', [parcela_id])
  if (!parc[0]) return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'parcela_id no existe' } })

  // Inserción: si tu tabla solo tiene (codigo, parcela_id, anio), usa esa versión.
  try {
    const [r] = await pool.query(
      'INSERT INTO lotes (codigo, anio, parcela_id, fecha_cosecha, cantidad_litros, notas) VALUES (?,?,?,?,?,?)',
      [codigo, anio, parcela_id, fecha_cosecha, cantidad_litros, notas]
    )
    res.status(201).json({ id: r.insertId })
  } catch (e) {
    res.status(400).json({ error: { code: 'DB_ERROR', message: String(e) } })
  }
})

export default router
