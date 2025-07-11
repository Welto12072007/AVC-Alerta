import { Request, Response, NextFunction } from 'express';
import { auth } from '../config/firebase';

interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email?: string;
    name?: string;
  };
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        error: 'Token de acesso requerido',
        code: 'MISSING_TOKEN',
      });
    }

    // Verificar token com Firebase
    const decodedToken = await auth.verifyIdToken(token);
    
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name,
    };

    next();
  } catch (error) {
    console.error('Erro na autenticação:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('expired')) {
        return res.status(401).json({
          error: 'Token expirado',
          code: 'TOKEN_EXPIRED',
        });
      }
      
      if (error.message.includes('invalid')) {
        return res.status(401).json({
          error: 'Token inválido',
          code: 'INVALID_TOKEN',
        });
      }
    }

    return res.status(401).json({
      error: 'Falha na autenticação',
      code: 'AUTH_FAILED',
    });
  }
};

export type { AuthenticatedRequest };