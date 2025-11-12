import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { supabase } from '../config/supabase';
import { hashPassword, comparePassword, validatePasswordStrength } from '../utils/passwordHash';
import { generateAccessToken, generateRefreshToken, verifyToken } from '../utils/jwtToken';

const router = express.Router();

// Registro
router.post('/register',
  [
    body('email').isEmail().withMessage('Email inválido'),
    body('password').isLength({ min: 8 }).withMessage('Senha deve ter 8+ caracteres'),
    body('fullName').notEmpty().withMessage('Nome completo obrigatório'),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: 'Dados inválidos', details: errors.array() });
      }

      const { email, password, fullName, phone } = req.body;

      // Validar força da senha
      const passwordValidation = validatePasswordStrength(password);
      if (!passwordValidation.isValid) {
        return res.status(400).json({ error: 'Senha fraca', details: passwordValidation.errors });
      }

      // Hash da senha
      const passwordHash = await hashPassword(password);

      // Inserir usuário - apenas os campos que existem na tabela
      const { data: user, error } = await supabase
        .from('users')
        .insert([{ 
          email, 
          password_hash: passwordHash, 
          full_name: fullName,
          ...(phone && { phone }) // Adiciona phone apenas se fornecido
        }])
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          return res.status(409).json({ error: 'Email já cadastrado' });
        }
        throw error;
      }

      // Criar perfil
      await supabase.from('user_profiles').insert([{ user_id: user.id }]);

      // Gerar tokens
      const accessToken = generateAccessToken(user.id, user.email);
      const refreshToken = generateRefreshToken(user.id, user.email);

      res.status(201).json({
        message: 'Usuário criado com sucesso',
        user: { id: user.id, email: user.email, fullName: user.full_name },
        accessToken,
        refreshToken,
      });
    } catch (error: any) {
      console.error('Erro no registro:', error);
      res.status(500).json({ error: 'Erro ao criar usuário' });
    }
  }
);

// Login
router.post('/login',
  [
    body('email').isEmail().withMessage('Email inválido'),
    body('password').notEmpty().withMessage('Senha obrigatória'),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: 'Dados inválidos' });
      }

      const { email, password } = req.body;

      // Buscar usuário
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error || !user) {
        return res.status(401).json({ error: 'Email ou senha incorretos' });
      }

      if (!user.is_active) {
        return res.status(403).json({ error: 'Conta desativada' });
      }

      // Verificar senha
      const passwordMatch = await comparePassword(password, user.password_hash);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Email ou senha incorretos' });
      }

      // Atualizar last_login
      await supabase
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', user.id);

      // Gerar tokens
      const accessToken = generateAccessToken(user.id, user.email);
      const refreshToken = generateRefreshToken(user.id, user.email);

      res.json({
        message: 'Login realizado com sucesso',
        user: { id: user.id, email: user.email, fullName: user.full_name },
        accessToken,
        refreshToken,
      });
    } catch (error) {
      console.error('Erro no login:', error);
      res.status(500).json({ error: 'Erro ao fazer login' });
    }
  }
);

// Refresh Token
router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token obrigatório' });
    }

    const decoded = verifyToken(refreshToken);

    if (decoded.type !== 'refresh') {
      return res.status(401).json({ error: 'Token inválido' });
    }

    const newAccessToken = generateAccessToken(decoded.userId, decoded.email);

    res.json({ accessToken: newAccessToken });
  } catch (error: any) {
    res.status(401).json({ error: error.message || 'Token inválido' });
  }
});

export default router;
