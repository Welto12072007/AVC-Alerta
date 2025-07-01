const express = require('express');
const EmergencyController = require('../controllers/emergencyController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Todas as rotas requerem autenticação
router.use(authMiddleware);

// Rotas de contatos de emergência
router.post('/contacts', EmergencyController.createContactValidation, EmergencyController.createContact);
router.get('/contacts', EmergencyController.getContacts);
router.get('/contacts/:id', EmergencyController.getContact);
router.put('/contacts/:id', EmergencyController.updateContact);
router.delete('/contacts/:id', EmergencyController.deleteContact);

// Contato primário por tipo
router.get('/contacts/primary/:type', EmergencyController.getPrimaryContact);

module.exports = router;