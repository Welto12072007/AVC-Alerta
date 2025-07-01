const { body } = require('express-validator');
const SymptomCheck = require('../models/SymptomCheck');
const { handleValidationErrors } = require('../middleware/validation');

class SymptomController {
  // Validações
  static createCheckValidation = [
    body('face_symptoms').isBoolean().withMessage('Sintomas faciais devem ser verdadeiro ou falso'),
    body('arms_symptoms').isBoolean().withMessage('Sintomas nos braços devem ser verdadeiro ou falso'),
    body('speech_symptoms').isBoolean().withMessage('Sintomas na fala devem ser verdadeiro ou falso'),
    handleValidationErrors
  ];

  // Criar nova verificação de sintomas
  static async createCheck(req, res) {
    try {
      const { face_symptoms, arms_symptoms, speech_symptoms, additional_notes } = req.body;

      const check = await SymptomCheck.create({
        user_id: req.user.id,
        face_symptoms,
        arms_symptoms,
        speech_symptoms,
        additional_notes
      });

      res.status(201).json({
        success: true,
        message: 'Verificação de sintomas criada com sucesso',
        data: { check }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao criar verificação de sintomas',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Obter verificações do usuário
  static async getChecks(req, res) {
    try {
      const { limit = 50, startDate, endDate, positive_only } = req.query;

      let checks;

      if (startDate && endDate) {
        checks = await SymptomCheck.getChecksByDateRange(
          req.user.id,
          startDate,
          endDate
        );
      } else if (positive_only === 'true') {
        checks = await SymptomCheck.getPositiveChecks(req.user.id);
      } else {
        checks = await SymptomCheck.findByUserId(req.user.id);
      }

      // Aplicar limite se especificado
      if (limit && !startDate && !endDate) {
        checks = checks.slice(0, parseInt(limit));
      }

      res.json({
        success: true,
        data: { checks }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar verificações',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Obter verificação específica
  static async getCheck(req, res) {
    try {
      const { id } = req.params;
      const check = await SymptomCheck.findById(id);

      if (!check) {
        return res.status(404).json({
          success: false,
          message: 'Verificação não encontrada'
        });
      }

      // Verificar se a verificação pertence ao usuário
      if (check.user_id !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Acesso negado'
        });
      }

      res.json({
        success: true,
        data: { check }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar verificação',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Atualizar verificação
  static async updateCheck(req, res) {
    try {
      const { id } = req.params;
      const { face_symptoms, arms_symptoms, speech_symptoms, additional_notes } = req.body;

      const check = await SymptomCheck.findById(id);

      if (!check) {
        return res.status(404).json({
          success: false,
          message: 'Verificação não encontrada'
        });
      }

      // Verificar se a verificação pertence ao usuário
      if (check.user_id !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Acesso negado'
        });
      }

      const updatedCheck = await SymptomCheck.update(id, {
        face_symptoms,
        arms_symptoms,
        speech_symptoms,
        additional_notes
      });

      res.json({
        success: true,
        message: 'Verificação atualizada com sucesso',
        data: { check: updatedCheck }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao atualizar verificação',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Deletar verificação
  static async deleteCheck(req, res) {
    try {
      const { id } = req.params;
      const check = await SymptomCheck.findById(id);

      if (!check) {
        return res.status(404).json({
          success: false,
          message: 'Verificação não encontrada'
        });
      }

      // Verificar se a verificação pertence ao usuário
      if (check.user_id !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Acesso negado'
        });
      }

      await SymptomCheck.delete(id);

      res.json({
        success: true,
        message: 'Verificação deletada com sucesso'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao deletar verificação',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Obter estatísticas de verificações
  static async getStats(req, res) {
    try {
      const { days = 30 } = req.query;

      const stats = await SymptomCheck.getStatistics(req.user.id, days);
      const recentChecks = await SymptomCheck.getRecentChecks(req.user.id, 5);

      res.json({
        success: true,
        data: {
          statistics: stats,
          recent_checks: recentChecks,
          period_days: parseInt(days)
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar estatísticas',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = SymptomController;