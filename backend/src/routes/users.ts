import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import { supabase } from '../config/supabase';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Get user profile
router.get('/profile', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email, full_name, cpf, phone, date_of_birth, created_at, updated_at')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    res.json({
      user,
      profile: profile || null,
    });
  } catch (error: any) {
    console.error('Erro ao buscar perfil:', error);
    res.status(500).json({ error: 'Erro ao buscar perfil do usuário' });
  }
});

// Update user basic info
router.put('/profile', 
  authMiddleware,
  [
    body('full_name').optional().isString(),
    body('phone').optional().isString(),
    body('date_of_birth').optional().isISO8601(),
  ],
  async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId;
      const { full_name, phone, date_of_birth } = req.body;

      const updateData: any = {};
      if (full_name !== undefined) updateData.full_name = full_name;
      if (phone !== undefined) updateData.phone = phone;
      if (date_of_birth !== undefined) updateData.date_of_birth = date_of_birth;

      const { data, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        return res.status(400).json({ error: 'Erro ao atualizar usuário' });
      }

      res.json({ message: 'Perfil atualizado com sucesso', user: data });
    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error);
      res.status(500).json({ error: 'Erro ao atualizar perfil' });
    }
  }
);

// Update user profile details
router.put('/profile/details',
  authMiddleware,
  [
    body('address').optional().isString(),
    body('city').optional().isString(),
    body('state').optional().isString(),
    body('zip_code').optional().isString(),
    body('emergency_contact_name').optional().isString(),
    body('emergency_contact_phone').optional().isString(),
    body('blood_type').optional().isString(),
    body('allergies').optional().isString(),
    body('chronic_conditions').optional().isString(),
    body('current_medications').optional().isString(),
    body('health_insurance').optional().isString(),
  ],
  async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId;
      const profileData = req.body;

      // Check if profile exists
      const { data: existingProfile } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('user_id', userId)
        .single();

      let data, error;

      if (existingProfile) {
        // Update existing profile
        const result = await supabase
          .from('user_profiles')
          .update(profileData)
          .eq('user_id', userId)
          .select()
          .single();
        
        data = result.data;
        error = result.error;
      } else {
        // Create new profile
        const result = await supabase
          .from('user_profiles')
          .insert({ ...profileData, user_id: userId })
          .select()
          .single();
        
        data = result.data;
        error = result.error;
      }

      if (error) {
        return res.status(400).json({ error: 'Erro ao atualizar detalhes do perfil' });
      }

      res.json({ message: 'Detalhes do perfil atualizados com sucesso', profile: data });
    } catch (error: any) {
      console.error('Erro ao atualizar detalhes do perfil:', error);
      res.status(500).json({ error: 'Erro ao atualizar detalhes do perfil' });
    }
  }
);

// Delete user account
router.delete('/account', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    // Delete user (cascade will handle related records)
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);

    if (error) {
      return res.status(400).json({ error: 'Erro ao deletar conta' });
    }

    res.json({ message: 'Conta deletada com sucesso' });
  } catch (error: any) {
    console.error('Erro ao deletar conta:', error);
    res.status(500).json({ error: 'Erro ao deletar conta' });
  }
});

export default router;
