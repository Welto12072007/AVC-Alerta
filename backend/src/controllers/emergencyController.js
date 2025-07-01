const { body } = require('express-validator');
const EmergencyContact = require('../models/EmergencyContact');
const { handleValidationErrors } = require('../middleware/validation');

class EmergencyController {
  // Validações
  static createContactValidation = [
    body('name').notEmpty().withMessage('Nome é obrigatório'),
    body('phone').notEmpty().withMessage('Telefone é obrigatório'),
    body('type').isIn(['personal', 'medical', 'emergency']).withMessage('Tipo de contato inválido'),
    handleValidationErrors
  ];

  // Criar novo contato de emergência
  static async createContact(req, res) {
    try {
      const { name, phone, relation, type, is_primary } = req.body;

      const contact = await EmergencyContact.create({
        user_id: req.user.id,
        name,
        phone,
        relation,
        type,
        is_primary: is_primary || false
      });

      res.status(201).json({
        success: true,
        message: 'Contato de emergência criado com sucesso',
        data: { contact }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao criar contato de emergência',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Obter contatos de emergência do usuário
  static async getContacts(req, res) {
    try {
      const { type } = req.query;

      let contacts;
      if (type) {
        contacts = await EmergencyContact.findByUserIdAndType(req.user.id, type);
      } else {
        contacts = await EmergencyContact.findByUserId(req.user.id);
      }

      res.json({
        success: true,
        data: { contacts }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar contatos de emergência',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Obter contato específico
  static async getContact(req, res) {
    try {
      const { id } = req.params;
      const contact = await EmergencyContact.findById(id);

      if (!contact) {
        return res.status(404).json({
          success: false,
          message: 'Contato não encontrado'
        });
      }

      // Verificar se o contato pertence ao usuário
      if (contact.user_id !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Acesso negado'
        });
      }

      res.json({
        success: true,
        data: { contact }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar contato',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Atualizar contato de emergência
  static async updateContact(req, res) {
    try {
      const { id } = req.params;
      const { name, phone, relation, type, is_primary } = req.body;

      const contact = await EmergencyContact.findById(id);

      if (!contact) {
        return res.status(404).json({
          success: false,
          message: 'Contato não encontrado'
        });
      }

      // Verificar se o contato pertence ao usuário
      if (contact.user_id !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Acesso negado'
        });
      }

      const updatedContact = await EmergencyContact.update(id, {
        name,
        phone,
        relation,
        type,
        is_primary
      });

      res.json({
        success: true,
        message: 'Contato atualizado com sucesso',
        data: { contact: updatedContact }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao atualizar contato',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Deletar contato de emergência
  static async deleteContact(req, res) {
    try {
      const { id } = req.params;
      const contact = await EmergencyContact.findById(id);

      if (!contact) {
        return res.status(404).json({
          success: false,
          message: 'Contato não encontrado'
        });
      }

      // Verificar se o contato pertence ao usuário
      if (contact.user_id !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Acesso negado'
        });
      }

      await EmergencyContact.delete(id);

      res.json({
        success: true,
        message: 'Contato deletado com sucesso'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao deletar contato',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Obter contato primário por tipo
  static async getPrimaryContact(req, res) {
    try {
      const { type } = req.params;

      if (!['personal', 'medical', 'emergency'].includes(type)) {
        return res.status(400).json({
          success: false,
          message: 'Tipo de contato inválido'
        });
      }

      const contact = await EmergencyContact.getPrimaryContact(req.user.id, type);

      if (!contact) {
        return res.status(404).json({
          success: false,
          message: 'Nenhum contato primário encontrado para este tipo'
        });
      }

      res.json({
        success: true,
        data: { contact }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar contato primário',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = EmergencyController;