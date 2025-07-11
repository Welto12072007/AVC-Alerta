import express from 'express';
import { db } from '../config/firebase';
import { authenticateToken } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';

const router = express.Router();

// Todas as rotas requerem autenticação
router.use(authenticateToken);

// Buscar perfil do usuário
router.get('/profile', async (req, res, next) => {
  try {
    const userId = (req as any).user.uid;

    const doc = await db.collection('users').doc(userId).get();
    
    if (!doc.exists) {
      throw createError('Usuário não encontrado', 404);
    }

    const userData = doc.data();
    
    res.json({
      user: {
        uid: userId,
        ...userData,
      },
    });
  } catch (error: any) {
    next(createError(error.message, 400));
  }
});

// Atualizar perfil do usuário
router.put('/profile', async (req, res, next) => {
  try {
    const userId = (req as any).user.uid;
    const { name, phone, birthDate, medicalInfo } = req.body;

    const updateData: any = {
      updatedAt: new Date(),
    };

    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (birthDate) updateData.birthDate = new Date(birthDate);
    if (medicalInfo) updateData.medicalInfo = medicalInfo;

    await db.collection('users').doc(userId).update(updateData);

    res.json({
      message: 'Perfil atualizado com sucesso',
    });
  } catch (error: any) {
    next(createError(error.message, 400));
  }
});

// Salvar informações médicas
router.post('/medical-info', async (req, res, next) => {
  try {
    const userId = (req as any).user.uid;
    const { 
      allergies, 
      medications, 
      conditions, 
      emergencyContact,
      bloodType,
      height,
      weight 
    } = req.body;

    const medicalInfo = {
      allergies: allergies || [],
      medications: medications || [],
      conditions: conditions || [],
      emergencyContact: emergencyContact || '',
      bloodType: bloodType || '',
      height: height || null,
      weight: weight || null,
      updatedAt: new Date(),
    };

    await db.collection('users').doc(userId).update({
      medicalInfo,
      updatedAt: new Date(),
    });

    res.json({
      message: 'Informações médicas salvas com sucesso',
    });
  } catch (error: any) {
    next(createError(error.message, 400));
  }
});

// Buscar informações médicas
router.get('/medical-info', async (req, res, next) => {
  try {
    const userId = (req as any).user.uid;

    const doc = await db.collection('users').doc(userId).get();
    
    if (!doc.exists) {
      throw createError('Usuário não encontrado', 404);
    }

    const userData = doc.data();
    
    res.json({
      medicalInfo: userData?.medicalInfo || {},
    });
  } catch (error: any) {
    next(createError(error.message, 400));
  }
});

// Deletar conta do usuário
router.delete('/account', async (req, res, next) => {
  try {
    const userId = (req as any).user.uid;

    // Deletar dados do Firestore
    const batch = db.batch();
    
    // Deletar perfil do usuário
    batch.delete(db.collection('users').doc(userId));
    
    // Deletar dados de saúde
    const healthSnapshot = await db.collection('healthData').where('userId', '==', userId).get();
    healthSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    // Deletar contatos de emergência
    batch.delete(db.collection('emergencyContacts').doc(userId));
    
    // Deletar logs de chamadas
    const callLogsSnapshot = await db.collection('emergencyCallLogs').where('userId', '==', userId).get();
    callLogsSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    await batch.commit();

    res.json({
      message: 'Conta deletada com sucesso',
    });
  } catch (error: any) {
    next(createError(error.message, 400));
  }
});

export default router;