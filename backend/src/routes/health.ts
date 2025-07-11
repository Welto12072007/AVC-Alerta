import express from 'express';
import { body, validationResult } from 'express-validator';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { db } from '../config/firebase';

const router = express.Router();

// Obter registros de saúde do usuário
router.get('/readings', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.user!.uid;
    const { type, limit = 50 } = req.query;

    let query = db.collection('healthReadings')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(parseInt(limit as string));

    if (type) {
      query = query.where('type', '==', type);
    }

    const snapshot = await query.get();
    const readings = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({
      readings,
      total: readings.length,
    });
  } catch (error) {
    next(error);
  }
});

// Adicionar novo registro de saúde
router.post('/readings', [
  authenticateToken,
  body('type').isIn(['bp', 'heartRate', 'weight']).withMessage('Tipo inválido'),
  body('value').notEmpty().withMessage('Valor é obrigatório'),
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
    const { type, value, notes } = req.body;

    const reading = {
      userId,
      type,
      value,
      notes: notes || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await db.collection('healthReadings').add(reading);

    res.status(201).json({
      message: 'Registro adicionado com sucesso',
      reading: {
        id: docRef.id,
        ...reading,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Deletar registro de saúde
router.delete('/readings/:id', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.user!.uid;
    const { id } = req.params;

    const doc = await db.collection('healthReadings').doc(id).get();
    
    if (!doc.exists) {
      return res.status(404).json({
        error: 'Registro não encontrado',
      });
    }

    const data = doc.data();
    if (data?.userId !== userId) {
      return res.status(403).json({
        error: 'Acesso negado',
      });
    }

    await db.collection('healthReadings').doc(id).delete();

    res.json({
      message: 'Registro deletado com sucesso',
    });
  } catch (error) {
    next(error);
  }
});

export default router;