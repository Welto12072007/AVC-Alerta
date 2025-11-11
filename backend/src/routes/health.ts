import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import { supabase } from '../config/supabase';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Get health monitoring history
router.get('/monitoring', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { limit = 50, offset = 0 } = req.query;

    const { data, error } = await supabase
      .from('health_monitoring')
      .select('*')
      .eq('user_id', userId)
      .order('recorded_at', { ascending: false })
      .range(Number(offset), Number(offset) + Number(limit) - 1);

    if (error) {
      return res.status(400).json({ error: 'Erro ao buscar histórico de monitoramento' });
    }

    res.json({ data });
  } catch (error: any) {
    console.error('Erro ao buscar monitoramento:', error);
    res.status(500).json({ error: 'Erro ao buscar histórico de monitoramento' });
  }
});

// Add health monitoring record
router.post('/monitoring',
  authMiddleware,
  [
    body('blood_pressure_systolic').optional().isInt({ min: 0, max: 300 }),
    body('blood_pressure_diastolic').optional().isInt({ min: 0, max: 200 }),
    body('heart_rate').optional().isInt({ min: 0, max: 300 }),
    body('blood_glucose').optional().isFloat({ min: 0 }),
    body('weight').optional().isFloat({ min: 0 }),
    body('temperature').optional().isFloat({ min: 0 }),
    body('notes').optional().isString(),
  ],
  async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId;
      const monitoringData = {
        user_id: userId,
        blood_pressure_systolic: req.body.blood_pressure_systolic,
        blood_pressure_diastolic: req.body.blood_pressure_diastolic,
        heart_rate: req.body.heart_rate,
        blood_glucose: req.body.blood_glucose,
        weight: req.body.weight,
        temperature: req.body.temperature,
        notes: req.body.notes,
      };

      const { data, error } = await supabase
        .from('health_monitoring')
        .insert(monitoringData)
        .select()
        .single();

      if (error) {
        return res.status(400).json({ error: 'Erro ao registrar monitoramento' });
      }

      res.status(201).json({ message: 'Monitoramento registrado com sucesso', data });
    } catch (error: any) {
      console.error('Erro ao criar monitoramento:', error);
      res.status(500).json({ error: 'Erro ao criar monitoramento' });
    }
  }
);

// Get specific monitoring record
router.get('/monitoring/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;

    const { data, error } = await supabase
      .from('health_monitoring')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Registro não encontrado' });
    }

    res.json({ data });
  } catch (error: any) {
    console.error('Erro ao buscar registro:', error);
    res.status(500).json({ error: 'Erro ao buscar registro' });
  }
});

// Update monitoring record
router.put('/monitoring/:id',
  authMiddleware,
  [
    body('blood_pressure_systolic').optional().isInt({ min: 0, max: 300 }),
    body('blood_pressure_diastolic').optional().isInt({ min: 0, max: 200 }),
    body('heart_rate').optional().isInt({ min: 0, max: 300 }),
    body('blood_glucose').optional().isFloat({ min: 0 }),
    body('weight').optional().isFloat({ min: 0 }),
    body('temperature').optional().isFloat({ min: 0 }),
    body('notes').optional().isString(),
  ],
  async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId;
      const { id } = req.params;

      const { data, error } = await supabase
        .from('health_monitoring')
        .update(req.body)
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        return res.status(400).json({ error: 'Erro ao atualizar registro' });
      }

      res.json({ message: 'Registro atualizado com sucesso', data });
    } catch (error: any) {
      console.error('Erro ao atualizar registro:', error);
      res.status(500).json({ error: 'Erro ao atualizar registro' });
    }
  }
);

// Delete monitoring record
router.delete('/monitoring/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;

    const { error } = await supabase
      .from('health_monitoring')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      return res.status(400).json({ error: 'Erro ao deletar registro' });
    }

    res.json({ message: 'Registro deletado com sucesso' });
  } catch (error: any) {
    console.error('Erro ao deletar registro:', error);
    res.status(500).json({ error: 'Erro ao deletar registro' });
  }
});

export default router;
