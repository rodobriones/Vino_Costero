import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { pool } from '../db.js';

const router = Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Email y password requeridos' } });
  const [rows] = await pool.query('SELECT * FROM usuarios WHERE email=?', [email]);
  const user = rows[0];
  if (!user) return res.status(401).json({ error: { code: 'AUTH_ERROR', message: 'Credenciales inválidas' } });
  const ok = await bcrypt.compare(password, user.hash);
  if (!ok) return res.status(401).json({ error: { code: 'AUTH_ERROR', message: 'Credenciales inválidas' } });
  const payload = { sub: user.id, email: user.email, rol: user.rol, nombre: user.nombre };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2h' });
  res.json({ token, exp: Math.floor(Date.now()/1000)+7200, rol: user.rol, nombre: user.nombre, userId: user.id });
});

export default router;
