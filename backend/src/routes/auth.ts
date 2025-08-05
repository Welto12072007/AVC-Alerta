import express, { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { supabase, supabaseAuth } from '../config/supabase';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Registrar usuário
router.post('/register', [
  body('email').isEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('Senha deve ter pelo menos 6 caracteres'),
  body('name').notEmpty().withMessage('Nome é obrigatório'),
], async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: errors.array(),
      });
    }

    const { email, password, name } = req.body;

    // Criar usuário no Supabase Auth
    const { data: authData, error: authError } = await supabaseAuth.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        }
      }
    });

    if (authError) {
      return res.status(400).json({
        error: authError.message,
        code: 'SIGNUP_FAILED',
      });
    }

    // Salvar dados adicionais na tabela profiles
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          name,
          email,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (profileError) {
        console.error('Erro ao criar perfil:', profileError);
        // Não falha o registro se houver erro no perfil
      }
    }

    res.status(201).json({
      message: 'Usuário criado com sucesso',
      user: {
        id: authData.user?.id,
        email: authData.user?.email,
        name,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Login
router.post('/login', [
  body('email').isEmail().withMessage('Email inválido'),
  body('password').notEmpty().withMessage('Senha é obrigatória'),
], async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: errors.array(),
      });
    }

    const { email, password } = req.body;

    // Fazer login com Supabase Auth
    const { data, error } = await supabaseAuth.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({
        error: 'Credenciais inválidas',
        code: 'LOGIN_FAILED',
      });
    }

    res.json({
      message: 'Login realizado com sucesso',
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name,
      },
      session: {
        access_token: data.session?.access_token,
        refresh_token: data.session?.refresh_token,
        expires_at: data.session?.expires_at,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;