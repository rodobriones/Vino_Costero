import jwt from 'jsonwebtoken';

export function requireAuth(req, res, next) {
  const auth = req.headers.authorization || '';
  const [, token] = auth.split(' ');
  if (!token) return res.status(401).json({ error: { code: 'AUTH_REQUIRED', message: 'Token requerido' } });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).json({ error: { code: 'TOKEN_INVALID', message: 'Token inválido o expirado' } });
  }
}

export function requireRole(role) {
  return (req, res, next) => {
    if (!req.user || req.user.rol !== role) {
      return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Permiso denegado' } });
    }
    next();
  };
}
