const express = require('express');
const UserController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Todas as rotas requerem autenticação
router.use(authMiddleware);

// Rotas do usuário
router.get('/profile', UserController.getProfile);
router.put('/profile', UserController.updateProfileValidation, UserController.updateProfile);
router.put('/password', UserController.changePassword);
router.delete('/account', UserController.deleteAccount);

module.exports = router;