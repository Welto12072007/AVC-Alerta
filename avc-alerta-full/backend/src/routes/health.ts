import express from 'express';
import { db } from '../config/firebase';
import { authenticateToken } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';

const router = express.Router();

// Todas as rotas requerem autenticação
router.use(authenticateToken);

// Salvar dados de saúde
router.post('/save', async (req, res, next) => {
  try {
    const { type, data } = req.body;
    const userId = (req as any).user.uid;

    if (!type || !data) {
      throw createError('Tipo e dados são obrigatórios', 400);
    }

    const healthData = {
      userId,
      type, // 'bp', 'heartRate', 'weight'
      data,
      timestamp: new Date(),
      createdAt: new Date(),
    };

    const docRef = await db.collection('healthData').add(healthData);

    res.status(201).json({
      message: 'Dados de saúde salvos com sucesso',
      id: docRef.id,
    });
  } catch (error: any) {
    next(createError(error.message, 400));
  }
});

// Buscar histórico de dados de saúde
router.get('/history/:type?', async (req, res, next) => {
  try {
    const userId = (req as any).user.uid;
    const { type } = req.params;
    const { limit = 50, startDate, endDate } = req.query;

    let query = db
      .collection('healthData')
      .where('userId', '==', userId)
      .orderBy('timestamp', 'desc')
      .limit(Number(limit));

    if (type) {
      query = query.where('type', '==', type);
    }

    if (startDate) {
      query = query.where('timestamp', '>=', new Date(startDate as string));
    }

    if (endDate) {
      query = query.where('timestamp', '<=', new Date(endDate as string));
    }

    const snapshot = await query.get();
    const healthData = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({
      data: healthData,
      total: healthData.length,
    });
  } catch (error: any) {
    next(createError(error.message, 400));
  }
});

// Deletar registro de saúde
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.uid;

    const doc = await db.collection('healthData').doc(id).get();
    
    if (!doc.exists) {
      throw createError('Registro não encontrado', 404);
    }

    const data = doc.data();
    if (data?.userId !== userId) {
      throw createError('Não autorizado', 403);
    }

    await db.collection('healthData').doc(id).delete();

    res.json({
      message: 'Registro deletado com sucesso',
    });
  } catch (error: any) {
    next(createError(error.message, 400));
  }
});

// Estatísticas de saúde
router.get('/stats', async (req, res, next) => {
  try {
    const userId = (req as any).user.uid;
    const { days = 30 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - Number(days));

    const snapshot = await db
      .collection('healthData')
      .where('userId', '==', userId)
      .where('timestamp', '>=', startDate)
      .get();

    const stats = {
      totalRecords: snapshot.size,
      byType: {} as Record<string, number>,
      lastRecord: null as any,
    };

    let lastTimestamp = new Date(0);

    snapshot.docs.forEach(doc => {
      const data = doc.data();
      const type = data.type;
      
      stats.byType[type] = (stats.byType[type] || 0) + 1;
      
      if (data.timestamp.toDate() > lastTimestamp) {
        lastTimestamp = data.timestamp.toDate();
        stats.lastRecord = {
          id: doc.id,
          ...data,
        };
      }
    });

    res.json(stats);
  } catch (error: any) {
    next(createError(error.message, 400));
  }
});

export default router;