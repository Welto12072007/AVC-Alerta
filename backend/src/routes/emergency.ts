import express from 'express';
import { body, validationResult } from 'express-validator';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { db } from '../config/firebase';

const router = express.Router();

// Obter contatos de emergência do usuário
router.get('/contacts', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.user!.uid;

    const snapshot = await db.collection('emergencyContacts')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();

    const contacts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({
      contacts,
      total: contacts.length,
    });
  } catch (error) {
    next(error);
  }
});

// Adicionar contato de emergência
router.post('/contacts', [
  authenticateToken,
  body('name').notEmpty().withMessage('Nome é obrigatório'),
  body('phone').notEmpty().withMessage('Telefone é obrigatório'),
  body('type').isIn(['personal', 'medical', 'emergency']).withMessage('Tipo inválido'),
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
    const { name, phone, type, relation } = req.body;

    const contact = {
      userId,
      name,
      phone,
      type,
      relation: relation || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await db.collection('emergencyContacts').add(contact);

    res.status(201).json({
      message: 'Contato adicionado com sucesso',
      contact: {
        id: docRef.id,
        ...contact,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Atualizar contato de emergência
router.put('/contacts/:id', [
  authenticateToken,
  body('name').optional().notEmpty().withMessage('Nome não pode estar vazio'),
  body('phone').optional().notEmpty().withMessage('Telefone não pode estar vazio'),
  body('type').optional().isIn(['personal', 'medical', 'emergency']).withMessage('Tipo inválido'),
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
    const { id } = req.params;
    const updates = req.body;

    const doc = await db.collection('emergencyContacts').doc(id).get();
    
    if (!doc.exists) {
      return res.status(404).json({
        error: 'Contato não encontrado',
      });
    }

    const data = doc.data();
    if (data?.userId !== userId) {
      return res.status(403).json({
        error: 'Acesso negado',
      });
    }

    await db.collection('emergencyContacts').doc(id).update({
      ...updates,
      updatedAt: new Date(),
    });

    res.json({
      message: 'Contato atualizado com sucesso',
    });
  } catch (error) {
    next(error);
  }
});

// Deletar contato de emergência
router.delete('/contacts/:id', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.user!.uid;
    const { id } = req.params;

    const doc = await db.collection('emergencyContacts').doc(id).get();
    
    if (!doc.exists) {
      return res.status(404).json({
        error: 'Contato não encontrado',
      });
    }

    const data = doc.data();
    if (data?.userId !== userId) {
      return res.status(403).json({
        error: 'Acesso negado',
      });
    }

    await db.collection('emergencyContacts').doc(id).delete();

    res.json({
      message: 'Contato deletado com sucesso',
    });
  } catch (error) {
    next(error);
  }
});

export default router;