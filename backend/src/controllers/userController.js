const { body } = require('express-validator');
const User = require('../models/User');
const { handleValidationErrors } = require('../middleware/validation');

class UserController {
  // Validações
  static updateProfileValidation = [
    body('name').optional().notEmpty().withMessage('Nome não pode estar vazio'),
    body('email').optional().isEmail().withMessage('Email inválido'),
    body('phone').optional().isMobilePhone('pt-BR').withMessage('Telefone inválido'),
    body('birth_date').optional().isDate().withMessage('Data de nascimento inválida'),
    body('gender').optional().isIn(['masculino', 'feminino', 'outro']).withMessage('Gênero inválido'),
    handleValidationErrors
  ];

  // Obter perfil do usuário
  static async getProfile(req, res) {
    try {
      const user = await User.getUserProfile(req.user.id);
      
      res.json({
        success: true,
        data: { user }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar perfil',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Atualizar perfil
  static async updateProfile(req, res) {
    try {
      const {
        name,
        email,
        phone,
        birth_date,
        gender,
        medical_conditions,
        medications,
        allergies,
        emergency_contact_name,
        emergency_contact_phone
      } = req.body;

      // Verificar se email já está em uso por outro usuário
      if (email) {
        const existingUser = await User.findByEmail(email);
        if (existingUser && existingUser.id !== req.user.id) {
          return res.status(400).json({
            success: false,
            message: 'Email já está em uso por outro usuário'
          });
        }
      }

      const updatedUser = await User.update(req.user.id, {
        name,
        email,
        phone,
        birth_date,
        gender,
        medical_conditions,
        medications,
        allergies,
        emergency_contact_name,
        emergency_contact_phone
      });

      // Remover senha da resposta
      const { password: _, ...userWithoutPassword } = updatedUser;

      res.json({
        success: true,
        message: 'Perfil atualizado com sucesso',
        data: { user: userWithoutPassword }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao atualizar perfil',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Alterar senha
  static async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;

      // Validar dados
      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Senha atual e nova senha são obrigatórias'
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Nova senha deve ter pelo menos 6 caracteres'
        });
      }

      // Buscar usuário
      const user = await User.findById(req.user.id);
      
      // Verificar senha atual
      const isValidPassword = await User.validatePassword(currentPassword, user.password);
      if (!isValidPassword) {
        return res.status(400).json({
          success: false,
          message: 'Senha atual incorreta'
        });
      }

      // Atualizar senha
      await User.update(req.user.id, { password: newPassword });

      res.json({
        success: true,
        message: 'Senha alterada com sucesso'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao alterar senha',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Deletar conta
  static async deleteAccount(req, res) {
    try {
      const { password } = req.body;

      if (!password) {
        return res.status(400).json({
          success: false,
          message: 'Senha é obrigatória para deletar a conta'
        });
      }

      // Buscar usuário
      const user = await User.findById(req.user.id);
      
      // Verificar senha
      const isValidPassword = await User.validatePassword(password, user.password);
      if (!isValidPassword) {
        return res.status(400).json({
          success: false,
          message: 'Senha incorreta'
        });
      }

      // Deletar usuário (cascade irá deletar dados relacionados)
      await User.delete(req.user.id);

      res.json({
        success: true,
        message: 'Conta deletada com sucesso'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao deletar conta',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = UserController;