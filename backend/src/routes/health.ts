import express, { Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { supabase } from '../config/supabase';

const router = express.Router();

// Obter registros de saúde do usuário
router.get('/readings', authenticateToken, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { type, limit = 50 } = req.query;

    let query = supabase
      .from('health_readings')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(parseInt(limit as string));

    if (type) {
      query = query.eq('type', type);
    }

    const { data: readings, error } = await query;

    if (error) {
      throw error;
    }

    res.json({
      readings: readings || [],
      total: readings?.length || 0,
    });
  } catch (error) {
    next(error);
  }
});

// Adicionar novo registro de saúde
router.post('/readings', [
  authenticateToken,
  body('type').isIn(['bp', 'heartRate', 'weight']).withMessage('Tipo inválido'),
  body('value').notEmpty().withMessage('Valor é obrigatório'),
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
    const { type, value, notes } = req.body;

    const reading = {
      user_id: userId,
      type,
      value,
      notes: notes || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('health_readings')
      .insert(reading)
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.status(201).json({
      message: 'Registro adicionado com sucesso',
      reading: data,
    });
  } catch (error) {
    next(error);
  }
});

// Deletar registro de saúde
router.delete('/readings/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    // Verificar se o registro existe e pertence ao usuário
    const { data: existingReading, error: selectError } = await supabase
      .from('health_readings')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();
    
    if (selectError || !existingReading) {
      return res.status(404).json({
        error: 'Registro não encontrado',
      });
    }

    const { error: deleteError } = await supabase
      .from('health_readings')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (deleteError) {
      throw deleteError;
    }

    res.json({
      message: 'Registro deletado com sucesso',
    });
  } catch (error) {
    next(error);
  }
});

export default router;