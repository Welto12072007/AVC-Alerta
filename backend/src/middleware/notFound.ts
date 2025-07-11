import { Request, Response } from 'express';

export const notFound = (req: Request, res: Response) => {
  res.status(404).json({
    error: `Rota não encontrada: ${req.method} ${req.path}`,
    code: 'ROUTE_NOT_FOUND',
    availableRoutes: [
      'GET /',
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET /api/health/readings',
      'POST /api/health/readings',
      'GET /api/emergency/contacts',
      'POST /api/emergency/contacts',
      'GET /api/users/profile',
      'PUT /api/users/profile',
    ],
  });
};