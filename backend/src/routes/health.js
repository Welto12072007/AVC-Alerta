const express = require('express');
const HealthController = require('../controllers/healthController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Todas as rotas requerem autenticação
router.use(authMiddleware);

// Rotas de leituras de saúde
router.post('/readings', HealthController.createReadingValidation, HealthController.createReading);
router.get('/readings', HealthController.getReadings);
router.get('/readings/:id', HealthController.getReading);
router.put('/readings/:id', HealthController.updateReading);
router.delete('/readings/:id', HealthController.deleteReading);

// Estatísticas
router.get('/stats', HealthController.getHealthStats);

module.exports = router;