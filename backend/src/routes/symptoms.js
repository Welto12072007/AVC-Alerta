const express = require('express');
const SymptomController = require('../controllers/symptomController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Todas as rotas requerem autenticação
router.use(authMiddleware);

// Rotas de verificação de sintomas
router.post('/checks', SymptomController.createCheckValidation, SymptomController.createCheck);
router.get('/checks', SymptomController.getChecks);
router.get('/checks/:id', SymptomController.getCheck);
router.put('/checks/:id', SymptomController.updateCheck);
router.delete('/checks/:id', SymptomController.deleteCheck);

// Estatísticas
router.get('/stats', SymptomController.getStats);

module.exports = router;