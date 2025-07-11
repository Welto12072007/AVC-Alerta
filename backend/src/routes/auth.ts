import express from 'express';
import { body, validationResult } from 'express-validator';
import { auth, db } from '../config/firebase';

const router = express.Router();

// Registrar usuário
router.post('/register', [
  body('email').isEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('Senha deve ter pelo menos 6 caracteres'),
  body('name').notEmpty().withMessage('Nome é obrigatório'),
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: errors.array(),
      });
    }

    const { email, password, name } = req.body;

    // Criar usuário no Firebase Auth
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: name,
    });

    // Salvar dados adicionais no Firestore
    await db.collection('users').doc(userRecord.uid).set({
      name,
      email,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    res.status(201).json({
      message: 'Usuário criado com sucesso',
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        name: userRecord.displayName,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Login (o login real é feito no frontend com Firebase)
router.post('/login', [
  body('email').isEmail().withMessage('Email inválido'),
  body('password').notEmpty().withMessage('Senha é obrigatória'),
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: errors.array(),
      });
    }

    // O login real é feito no frontend
    // Este endpoint pode ser usado para validações adicionais
    res.json({
      message: 'Use o Firebase Auth no frontend para fazer login',
    });
  } catch (error) {
    next(error);
  }
});

export default router;