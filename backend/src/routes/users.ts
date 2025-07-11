import express from 'express';
import { body, validationResult } from 'express-validator';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { db } from '../config/firebase';

const router = express.Router();

// Obter perfil do usuário
router.get('/profile', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.user!.uid;

    const doc = await db.collection('users').doc(userId).get();
    
    if (!doc.exists) {
      return res.status(404).json({
        error: 'Usuário não encontrado',
      });
    }

    const userData = doc.data();
    
    res.json({
      user: {
        uid: userId,
        ...userData,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Atualizar perfil do usuário
router.put('/profile', [
  authenticateToken,
  body('name').optional().notEmpty().withMessage('Nome não pode estar vazio'),
  body('age').optional().isInt({ min: 1, max: 120 }).withMessage('Idade inválida'),
  body('gender').optional().isIn(['male', 'female', 'other']).withMessage('Gênero inválido'),
], async (req: AuthenticatedRequest, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: errors.array(),
      });
    }

    const userId = req.user!.uid;
    const updates = req.body;

    await db.collection('users').doc(userId).update({
      ...updates,
      updatedAt: new Date(),
    });

    res.json({
      message: 'Perfil atualizado com sucesso',
    });
  } catch (error) {
    next(error);
  }
});

// Obter estatísticas do usuário
router.get('/stats', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.user!.uid;

    // Contar registros de saúde
    const healthSnapshot = await db.collection('healthReadings')
      .where('userId', '==', userId)
      .get();

    // Contar contatos de emergência
    const contactsSnapshot = await db.collection('emergencyContacts')
      .where('userId', '==', userId)
      .get();

    // Agrupar registros por tipo
    const healthByType = healthSnapshot.docs.reduce((acc, doc) => {
      const data = doc.data();
      acc[data.type] = (acc[data.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    res.json({
      stats: {
        totalHealthReadings: healthSnapshot.size,
        healthByType,
        totalEmergencyContacts: contactsSnapshot.size,
        lastActivity: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;