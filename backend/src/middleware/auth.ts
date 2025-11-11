import { Request, Response, NextFunction } from 'express';
import { verifyToken, extractTokenFromHeader } from '../utils/jwtToken';

export interface AuthRequest extends Request {
  userId?: string;
  userEmail?: string;
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);

    if (!token) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    const decoded = verifyToken(token);

    if (decoded.type !== 'access') {
      return res.status(401).json({ error: 'Token inválido' });
    }

    req.userId = decoded.userId;
    req.userEmail = decoded.email;

    next();
  } catch (error: any) {
    return res.status(401).json({ error: error.message || 'Token inválido' });
  }
};

export default authMiddleware;
