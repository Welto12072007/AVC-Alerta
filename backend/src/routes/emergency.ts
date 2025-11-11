import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import { supabase } from '../config/supabase';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Get emergency call history
router.get('/calls', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { limit = 50, offset = 0 } = req.query;

    const { data, error } = await supabase
      .from('emergency_calls')
      .select('*')
      .eq('user_id', userId)
      .order('called_at', { ascending: false })
      .range(Number(offset), Number(offset) + Number(limit) - 1);

    if (error) {
      return res.status(400).json({ error: 'Erro ao buscar histórico de chamadas' });
    }

    res.json({ data });
  } catch (error: any) {
    console.error('Erro ao buscar chamadas:', error);
    res.status(500).json({ error: 'Erro ao buscar histórico de chamadas' });
  }
});

// Register emergency call
router.post('/call',
  authMiddleware,
  [
    body('location_latitude').optional().isFloat(),
    body('location_longitude').optional().isFloat(),
    body('location_address').optional().isString(),
    body('symptom_check_id').optional().isUUID(),
    body('notes').optional().isString(),
  ],
  async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId;
      const callData = {
        user_id: userId,
        location_latitude: req.body.location_latitude,
        location_longitude: req.body.location_longitude,
        location_address: req.body.location_address,
        symptom_check_id: req.body.symptom_check_id,
        notes: req.body.notes,
        call_status: 'registered',
      };

      const { data, error } = await supabase
        .from('emergency_calls')
        .insert(callData)
        .select()
        .single();

      if (error) {
        return res.status(400).json({ error: 'Erro ao registrar chamada de emergência' });
      }

      res.status(201).json({ 
        message: 'Chamada de emergência registrada com sucesso', 
        data,
        emergency_number: '192',
        instructions: 'Ligue imediatamente para 192 (SAMU) e informe sua localização.',
      });
    } catch (error: any) {
      console.error('Erro ao registrar chamada:', error);
      res.status(500).json({ error: 'Erro ao registrar chamada de emergência' });
    }
  }
);

// Update emergency call status
router.put('/calls/:id',
  authMiddleware,
  [
    body('call_status').isIn(['registered', 'in_progress', 'completed', 'cancelled']),
    body('notes').optional().isString(),
  ],
  async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId;
      const { id } = req.params;
      const { call_status, notes } = req.body;

      const updateData: any = { call_status };
      if (notes) updateData.notes = notes;

      const { data, error } = await supabase
        .from('emergency_calls')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        return res.status(400).json({ error: 'Erro ao atualizar chamada' });
      }

      res.json({ message: 'Chamada atualizada com sucesso', data });
    } catch (error: any) {
      console.error('Erro ao atualizar chamada:', error);
      res.status(500).json({ error: 'Erro ao atualizar chamada' });
    }
  }
);

// Get specific emergency call
router.get('/calls/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;

    const { data, error } = await supabase
      .from('emergency_calls')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Chamada não encontrada' });
    }

    res.json({ data });
  } catch (error: any) {
    console.error('Erro ao buscar chamada:', error);
    res.status(500).json({ error: 'Erro ao buscar chamada' });
  }
});

// Get emergency contacts info
router.get('/contacts', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    // Get user's emergency contact from profile
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('emergency_contact_name, emergency_contact_phone')
      .eq('user_id', userId)
      .single();

    const emergencyInfo = {
      samu: '192',
      ambulance: '192',
      fire_department: '193',
      police: '190',
      personal_contact: profile ? {
        name: profile.emergency_contact_name,
        phone: profile.emergency_contact_phone,
      } : null,
    };

    res.json(emergencyInfo);
  } catch (error: any) {
    console.error('Erro ao buscar contatos:', error);
    res.status(500).json({ error: 'Erro ao buscar contatos de emergência' });
  }
});

export default router;
