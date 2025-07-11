import express from 'express';
import { db } from '../config/firebase';
import { authenticateToken } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';

const router = express.Router();

// Todas as rotas requerem autenticação
router.use(authenticateToken);

// Salvar contatos de emergência
router.post('/contacts', async (req, res, next) => {
  try {
    const { contacts } = req.body;
    const userId = (req as any).user.uid;

    if (!contacts || !Array.isArray(contacts)) {
      throw createError('Lista de contatos é obrigatória', 400);
    }

    // Validar estrutura dos contatos
    for (const contact of contacts) {
      if (!contact.name || !contact.number) {
        throw createError('Nome e número são obrigatórios para cada contato', 400);
      }
    }

    const emergencyData = {
      userId,
      contacts,
      updatedAt: new Date(),
    };

    // Usar merge para atualizar ou criar
    await db.collection('emergencyContacts').doc(userId).set(emergencyData, { merge: true });

    res.json({
      message: 'Contatos de emergência salvos com sucesso',
    });
  } catch (error: any) {
    next(createError(error.message, 400));
  }
});

// Buscar contatos de emergência
router.get('/contacts', async (req, res, next) => {
  try {
    const userId = (req as any).user.uid;

    const doc = await db.collection('emergencyContacts').doc(userId).get();
    
    if (!doc.exists) {
      return res.json({
        contacts: [],
      });
    }

    const data = doc.data();
    
    res.json({
      contacts: data?.contacts || [],
      updatedAt: data?.updatedAt,
    });
  } catch (error: any) {
    next(createError(error.message, 400));
  }
});

// Adicionar um contato específico
router.post('/contacts/add', async (req, res, next) => {
  try {
    const { name, number, relation, type } = req.body;
    const userId = (req as any).user.uid;

    if (!name || !number) {
      throw createError('Nome e número são obrigatórios', 400);
    }

    const newContact = {
      id: Date.now().toString(),
      name,
      number,
      relation: relation || '',
      type: type || 'personal',
      createdAt: new Date(),
    };

    // Buscar contatos existentes
    const doc = await db.collection('emergencyContacts').doc(userId).get();
    const existingContacts = doc.exists ? doc.data()?.contacts || [] : [];

    // Adicionar novo contato
    const updatedContacts = [...existingContacts, newContact];

    await db.collection('emergencyContacts').doc(userId).set({
      userId,
      contacts: updatedContacts,
      updatedAt: new Date(),
    }, { merge: true });

    res.status(201).json({
      message: 'Contato adicionado com sucesso',
      contact: newContact,
    });
  } catch (error: any) {
    next(createError(error.message, 400));
  }
});

// Remover um contato específico
router.delete('/contacts/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const userId = (req as any).user.uid;

    const doc = await db.collection('emergencyContacts').doc(userId).get();
    
    if (!doc.exists) {
      throw createError('Contatos não encontrados', 404);
    }

    const data = doc.data();
    const contacts = data?.contacts || [];
    
    const updatedContacts = contacts.filter((contact: any) => contact.id !== contactId);

    await db.collection('emergencyContacts').doc(userId).set({
      userId,
      contacts: updatedContacts,
      updatedAt: new Date(),
    }, { merge: true });

    res.json({
      message: 'Contato removido com sucesso',
    });
  } catch (error: any) {
    next(createError(error.message, 400));
  }
});

// Registrar chamada de emergência
router.post('/call-log', async (req, res, next) => {
  try {
    const { contactNumber, contactName, timestamp } = req.body;
    const userId = (req as any).user.uid;

    const callLog = {
      userId,
      contactNumber,
      contactName: contactName || 'Desconhecido',
      timestamp: timestamp ? new Date(timestamp) : new Date(),
      createdAt: new Date(),
    };

    await db.collection('emergencyCallLogs').add(callLog);

    res.status(201).json({
      message: 'Chamada de emergência registrada',
    });
  } catch (error: any) {
    next(createError(error.message, 400));
  }
});

// Buscar histórico de chamadas de emergência
router.get('/call-logs', async (req, res, next) => {
  try {
    const userId = (req as any).user.uid;
    const { limit = 20 } = req.query;

    const snapshot = await db
      .collection('emergencyCallLogs')
      .where('userId', '==', userId)
      .orderBy('timestamp', 'desc')
      .limit(Number(limit))
      .get();

    const callLogs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({
      callLogs,
      total: callLogs.length,
    });
  } catch (error: any) {
    next(createError(error.message, 400));
  }
});

export default router;