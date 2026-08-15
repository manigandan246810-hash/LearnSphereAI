import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'learnsphere_super_secret_jwt_key_2026';

export function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication token missing or invalid.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
}

export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ error: 'Access denied: User role not identified.' });
    }

    const userRoleLower = req.user.role.toLowerCase();
    const normalizedAllowed = allowedRoles.flatMap(r => {
      const rl = r.toLowerCase();
      if (rl === 'staff' || rl === 'faculty') return ['staff', 'faculty', 'admin'];
      if (rl === 'student') return ['student'];
      return [rl];
    });

    if (!normalizedAllowed.includes(userRoleLower)) {
      return res.status(403).json({ error: '403 Forbidden: Insufficient role permissions for this operation.' });
    }
    next();
  };
}

export function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      user_code: user.user_code,
      email: user.email,
      name: user.name,
      role: user.role,
      department: user.department
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}
