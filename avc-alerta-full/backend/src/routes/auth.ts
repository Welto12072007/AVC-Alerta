import express from 'express';
import { auth, db } from '../config/firebase';
import { createError } from '../middleware/errorHandler';

const router = express.Router();

// Registrar usuário
router.post('/register', async (req, res, next) => {
  try {
    const { email, password, name, phone } = req.body;

    if (!email || !password || !name) {
      throw createError('Email, senha e nome são obrigatórios', 400);
    }

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
      phone: phone || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    res.status(201).json({
      message: 'Usuário criado com sucesso',
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        name,
      },
    });
  } catch (error: any) {
    next(createError(error.message, 400));
  }
});

// Login (o login real é feito no frontend com Firebase Auth)
router.post('/login', async (req, res, next) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      throw createError('Token ID é obrigatório', 400);
    }

    // Verificar token
    const decodedToken = await auth.verifyIdToken(idToken);
    
    // Buscar dados do usuário
    const userDoc = await db.collection('users').doc(decodedToken.uid).get();
    
    if (!userDoc.exists) {
      throw createError('Usuário não encontrado', 404);
    }

    const userData = userDoc.data();

    res.json({
      message: 'Login realizado com sucesso',
      user: {
        uid: decodedToken.uid,
        email: decodedToken.email,
        name: userData?.name,
        phone: userData?.phone,
      },
    });
  } catch (error: any) {
    next(createError(error.message, 401));
  }
});

// Logout
router.post('/logout', async (req, res, next) => {
  try {
    const { uid } = req.body;

    if (uid) {
      // Revogar tokens do usuário
      await auth.revokeRefreshTokens(uid);
    }

    res.json({
      message: 'Logout realizado com sucesso',
    });
  } catch (error: any) {
    next(createError(error.message, 400));
  }
});

export default router;