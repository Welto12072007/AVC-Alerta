import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import { supabase } from '../config/supabase';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Get symptom check history
router.get('/checks', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { limit = 50, offset = 0 } = req.query;

    const { data, error } = await supabase
      .from('symptom_checks')
      .select('*')
      .eq('user_id', userId)
      .order('checked_at', { ascending: false })
      .range(Number(offset), Number(offset) + Number(limit) - 1);

    if (error) {
      return res.status(400).json({ error: 'Erro ao buscar histórico de sintomas' });
    }

    res.json({ data });
  } catch (error: any) {
    console.error('Erro ao buscar sintomas:', error);
    res.status(500).json({ error: 'Erro ao buscar histórico de sintomas' });
  }
});

// Perform symptom check (FAST protocol)
router.post('/check',
  authMiddleware,
  [
    body('symptoms').isObject().withMessage('Sintomas devem ser um objeto'),
    body('symptoms.face_drooping').isBoolean().withMessage('Face drooping deve ser boolean'),
    body('symptoms.arm_weakness').isBoolean().withMessage('Arm weakness deve ser boolean'),
    body('symptoms.speech_difficulty').isBoolean().withMessage('Speech difficulty deve ser boolean'),
    body('symptoms.sudden_confusion').optional().isBoolean(),
    body('symptoms.vision_problems').optional().isBoolean(),
    body('symptoms.severe_headache').optional().isBoolean(),
    body('symptoms.loss_of_balance').optional().isBoolean(),
    body('additional_symptoms').optional().isString(),
  ],
  async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId;
      const { symptoms, additional_symptoms } = req.body;

      // Calculate risk level based on FAST protocol
      const fastSymptoms = [
        symptoms.face_drooping,
        symptoms.arm_weakness,
        symptoms.speech_difficulty
      ];

      const fastCount = fastSymptoms.filter((s: boolean) => s === true).length;

      let risk_level: 'low' | 'medium' | 'high' | 'critical';
      let recommendation: string;

      if (fastCount >= 2) {
        risk_level = 'critical';
        recommendation = 'LIGAR PARA 192 IMEDIATAMENTE! Você apresenta sinais críticos de AVC.';
      } else if (fastCount === 1) {
        risk_level = 'high';
        recommendation = 'Procure atendimento médico de emergência urgentemente. Sinais de possível AVC detectados.';
      } else if (symptoms.sudden_confusion || symptoms.vision_problems || symptoms.severe_headache || symptoms.loss_of_balance) {
        risk_level = 'medium';
        recommendation = 'Procure atendimento médico assim que possível. Sintomas preocupantes detectados.';
      } else {
        risk_level = 'low';
        recommendation = 'Nenhum sintoma crítico detectado. Continue monitorando sua saúde.';
      }

      const checkData = {
        user_id: userId,
        symptoms: symptoms,
        risk_level: risk_level,
        recommendation: recommendation,
        additional_symptoms: additional_symptoms,
      };

      const { data, error } = await supabase
        .from('symptom_checks')
        .insert(checkData)
        .select()
        .single();

      if (error) {
        return res.status(400).json({ error: 'Erro ao registrar verificação de sintomas' });
      }

      res.status(201).json({ 
        message: 'Verificação de sintomas registrada com sucesso', 
        data,
        risk_level,
        recommendation,
      });
    } catch (error: any) {
      console.error('Erro ao verificar sintomas:', error);
      res.status(500).json({ error: 'Erro ao verificar sintomas' });
    }
  }
);

// Get specific symptom check
router.get('/checks/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;

    const { data, error } = await supabase
      .from('symptom_checks')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Verificação não encontrada' });
    }

    res.json({ data });
  } catch (error: any) {
    console.error('Erro ao buscar verificação:', error);
    res.status(500).json({ error: 'Erro ao buscar verificação' });
  }
});

// Delete symptom check
router.delete('/checks/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;

    const { error } = await supabase
      .from('symptom_checks')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      return res.status(400).json({ error: 'Erro ao deletar verificação' });
    }

    res.json({ message: 'Verificação deletada com sucesso' });
  } catch (error: any) {
    console.error('Erro ao deletar verificação:', error);
    res.status(500).json({ error: 'Erro ao deletar verificação' });
  }
});

export default router;
