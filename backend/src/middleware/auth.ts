import { Request, Response, NextFunction } from 'express';
import { supabaseAuth } from '../config/supabase';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
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

    // Verificar token com Supabase
    const { data: { user }, error } = await supabaseAuth.auth.getUser(token);
    
    if (error || !user) {
      return res.status(401).json({
        error: 'Token inválido',
        code: 'INVALID_TOKEN',
      });
    }
    
    req.user = {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.name || user.email,
    };

    next();
  } catch (error) {
    console.error('Erro na autenticação:', error);
    
    return res.status(401).json({
      error: 'Falha na autenticação',
      code: 'AUTH_FAILED',
    });
  }
};

export type { AuthenticatedRequest };