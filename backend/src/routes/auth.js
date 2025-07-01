const express = require('express');
const AuthController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Rotas públicas (com rate limiting)
router.post('/register', authLimiter, AuthController.registerValidation, AuthController.register);
router.post('/login', authLimiter, AuthController.loginValidation, AuthController.login);

// Rotas protegidas
router.get('/verify', authMiddleware, AuthController.verifyToken);
router.post('/refresh', authMiddleware, AuthController.refreshToken);

module.exports = router;