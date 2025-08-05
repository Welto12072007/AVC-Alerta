import express, { Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { supabase } from '../config/supabase';

const router = express.Router();

// Obter perfil do usuário
router.get('/profile', authenticateToken, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error || !data) {
      return res.status(404).json({
        error: 'Usuário não encontrado',
      });
    }
    
    res.json({
      user: {
        id: userId,
        ...data,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Atualizar perfil do usuário
router.put('/profile', [
  authenticateToken,
  body('name').optional().notEmpty().withMessage('Nome não pode estar vazio'),
  body('age').optional().isInt({ min: 1, max: 120 }).withMessage('Idade inválida'),
  body('gender').optional().isIn(['male', 'female', 'other']).withMessage('Gênero inválido'),
], async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: errors.array(),
      });
    }

    const userId = req.user!.id;
    const updates = req.body;

    const { error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) {
      throw error;
    }

    res.json({
      message: 'Perfil atualizado com sucesso',
    });
  } catch (error) {
    next(error);
  }
});

// Obter estatísticas do usuário
router.get('/stats', authenticateToken, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;

    // Contar registros de saúde
    const { count: healthCount, error: healthError } = await supabase
      .from('health_readings')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    // Contar contatos de emergência
    const { count: contactsCount, error: contactsError } = await supabase
      .from('emergency_contacts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    // Obter registros de saúde agrupados por tipo
    const { data: healthReadings, error: healthReadingsError } = await supabase
      .from('health_readings')
      .select('type')
      .eq('user_id', userId);

    if (healthError || contactsError || healthReadingsError) {
      throw new Error('Erro ao buscar estatísticas');
    }

    // Agrupar registros por tipo
    const healthByType = healthReadings?.reduce((acc: Record<string, number>, reading) => {
      acc[reading.type] = (acc[reading.type] || 0) + 1;
      return acc;
    }, {}) || {};

    res.json({
      stats: {
        totalHealthReadings: healthCount || 0,
        healthByType,
        totalEmergencyContacts: contactsCount || 0,
        lastActivity: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;