import express, { Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { supabase } from '../config/supabase';

const router = express.Router();

// Obter contatos de emergência do usuário
router.get('/contacts', authenticateToken, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;

    const { data: contacts, error } = await supabase
      .from('emergency_contacts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    res.json({
      contacts: contacts || [],
      total: contacts?.length || 0,
    });
  } catch (error) {
    next(error);
  }
});

// Adicionar contato de emergência
router.post('/contacts', [
  authenticateToken,
  body('name').notEmpty().withMessage('Nome é obrigatório'),
  body('phone').notEmpty().withMessage('Telefone é obrigatório'),
  body('type').isIn(['personal', 'medical', 'emergency']).withMessage('Tipo inválido'),
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
    const { name, phone, type, relation } = req.body;

    const contact = {
      user_id: userId,
      name,
      phone,
      type,
      relation: relation || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('emergency_contacts')
      .insert(contact)
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.status(201).json({
      message: 'Contato adicionado com sucesso',
      contact: data,
    });
  } catch (error) {
    next(error);
  }
});

// Atualizar contato de emergência
router.put('/contacts/:id', [
  authenticateToken,
  body('name').optional().notEmpty().withMessage('Nome não pode estar vazio'),
  body('phone').optional().notEmpty().withMessage('Telefone não pode estar vazio'),
  body('type').optional().isIn(['personal', 'medical', 'emergency']).withMessage('Tipo inválido'),
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
    const { id } = req.params;
    const updates = req.body;

    // Verificar se o contato existe e pertence ao usuário
    const { data: existingContact, error: selectError } = await supabase
      .from('emergency_contacts')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();
    
    if (selectError || !existingContact) {
      return res.status(404).json({
        error: 'Contato não encontrado',
      });
    }

    const { data, error } = await supabase
      .from('emergency_contacts')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.json({
      message: 'Contato atualizado com sucesso',
      contact: data,
    });
  } catch (error) {
    next(error);
  }
});

// Deletar contato de emergência
router.delete('/contacts/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    // Verificar se o contato existe e pertence ao usuário
    const { data: existingContact, error: selectError } = await supabase
      .from('emergency_contacts')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();
    
    if (selectError || !existingContact) {
      return res.status(404).json({
        error: 'Contato não encontrado',
      });
    }

    const { error: deleteError } = await supabase
      .from('emergency_contacts')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (deleteError) {
      throw deleteError;
    }

    res.json({
      message: 'Contato deletado com sucesso',
    });
  } catch (error) {
    next(error);
  }
});

export default router;