const jwt = require('jsonwebtoken');
const { body } = require('express-validator');
const User = require('../models/User');
const { handleValidationErrors } = require('../middleware/validation');

class AuthController {
  // Validações
  static registerValidation = [
    body('name').notEmpty().withMessage('Nome é obrigatório'),
    body('email').isEmail().withMessage('Email inválido'),
    body('password').isLength({ min: 6 }).withMessage('Senha deve ter pelo menos 6 caracteres'),
    handleValidationErrors
  ];

  static loginValidation = [
    body('email').isEmail().withMessage('Email inválido'),
    body('password').notEmpty().withMessage('Senha é obrigatória'),
    handleValidationErrors
  ];

  // Registrar usuário
  static async register(req, res) {
    try {
      const { name, email, password, birth_date, gender, phone } = req.body;

      // Verificar se usuário já existe
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email já está em uso'
        });
      }

      // Criar usuário
      const user = await User.create({
        name,
        email,
        password,
        birth_date,
        gender,
        phone
      });

      // Gerar token
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      // Remover senha da resposta
      const { password: _, ...userWithoutPassword } = user;

      res.status(201).json({
        success: true,
        message: 'Usuário criado com sucesso',
        data: {
          user: userWithoutPassword,
          token
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao criar usuário',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Login
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      // Buscar usuário
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Credenciais inválidas'
        });
      }

      // Verificar senha
      const isValidPassword = await User.validatePassword(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: 'Credenciais inválidas'
        });
      }

      // Gerar token
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      // Remover senha da resposta
      const { password: _, ...userWithoutPassword } = user;

      res.json({
        success: true,
        message: 'Login realizado com sucesso',
        data: {
          user: userWithoutPassword,
          token
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao fazer login',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Verificar token
  static async verifyToken(req, res) {
    try {
      const user = await User.getUserProfile(req.user.id);
      
      res.json({
        success: true,
        data: { user }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao verificar token',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Refresh token
  static async refreshToken(req, res) {
    try {
      const token = jwt.sign(
        { userId: req.user.id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      res.json({
        success: true,
        message: 'Token renovado com sucesso',
        data: { token }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao renovar token',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = AuthController;