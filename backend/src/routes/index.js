const express = require('express');
const authRoutes = require('./auth');
const userRoutes = require('./users');
const healthRoutes = require('./health');
const emergencyRoutes = require('./emergency');
const symptomRoutes = require('./symptoms');

const router = express.Router();

// Rota de status da API
router.get('/status', (req, res) => {
  res.json({
    success: true,
    message: 'AVC Alerta API está funcionando',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Rotas da aplicação
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/health', healthRoutes);
router.use('/emergency', emergencyRoutes);
router.use('/symptoms', symptomRoutes);

module.exports = router;