const { body } = require('express-validator');
const HealthReading = require('../models/HealthReading');
const { handleValidationErrors } = require('../middleware/validation');

class HealthController {
  // Validações
  static createReadingValidation = [
    body('type').isIn(['blood_pressure', 'heart_rate', 'weight']).withMessage('Tipo de leitura inválido'),
    body('systolic').optional().isInt({ min: 50, max: 300 }).withMessage('Pressão sistólica inválida'),
    body('diastolic').optional().isInt({ min: 30, max: 200 }).withMessage('Pressão diastólica inválida'),
    body('heart_rate').optional().isInt({ min: 30, max: 250 }).withMessage('Frequência cardíaca inválida'),
    body('weight').optional().isFloat({ min: 20, max: 500 }).withMessage('Peso inválido'),
    handleValidationErrors
  ];

  // Criar nova leitura
  static async createReading(req, res) {
    try {
      const { type, systolic, diastolic, heart_rate, weight, notes } = req.body;

      // Validar dados específicos por tipo
      if (type === 'blood_pressure' && (!systolic || !diastolic)) {
        return res.status(400).json({
          success: false,
          message: 'Pressão sistólica e diastólica são obrigatórias para leitura de pressão arterial'
        });
      }

      if (type === 'heart_rate' && !heart_rate) {
        return res.status(400).json({
          success: false,
          message: 'Frequência cardíaca é obrigatória para leitura de frequência cardíaca'
        });
      }

      if (type === 'weight' && !weight) {
        return res.status(400).json({
          success: false,
          message: 'Peso é obrigatório para leitura de peso'
        });
      }

      const reading = await HealthReading.create({
        user_id: req.user.id,
        type,
        systolic,
        diastolic,
        heart_rate,
        weight,
        notes
      });

      res.status(201).json({
        success: true,
        message: 'Leitura criada com sucesso',
        data: { reading }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao criar leitura',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Obter leituras do usuário
  static async getReadings(req, res) {
    try {
      const { type, limit = 50, startDate, endDate } = req.query;

      let readings;

      if (startDate && endDate) {
        readings = await HealthReading.getReadingsByDateRange(
          req.user.id,
          startDate,
          endDate,
          type
        );
      } else {
        readings = await HealthReading.findByUserId(req.user.id, type);
      }

      // Aplicar limite se especificado
      if (limit && !startDate && !endDate) {
        readings = readings.slice(0, parseInt(limit));
      }

      res.json({
        success: true,
        data: { readings }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar leituras',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Obter leitura específica
  static async getReading(req, res) {
    try {
      const { id } = req.params;
      const reading = await HealthReading.findById(id);

      if (!reading) {
        return res.status(404).json({
          success: false,
          message: 'Leitura não encontrada'
        });
      }

      // Verificar se a leitura pertence ao usuário
      if (reading.user_id !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Acesso negado'
        });
      }

      res.json({
        success: true,
        data: { reading }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar leitura',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Atualizar leitura
  static async updateReading(req, res) {
    try {
      const { id } = req.params;
      const { systolic, diastolic, heart_rate, weight, notes } = req.body;

      const reading = await HealthReading.findById(id);

      if (!reading) {
        return res.status(404).json({
          success: false,
          message: 'Leitura não encontrada'
        });
      }

      // Verificar se a leitura pertence ao usuário
      if (reading.user_id !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Acesso negado'
        });
      }

      const updatedReading = await HealthReading.update(id, {
        systolic,
        diastolic,
        heart_rate,
        weight,
        notes
      });

      res.json({
        success: true,
        message: 'Leitura atualizada com sucesso',
        data: { reading: updatedReading }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao atualizar leitura',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Deletar leitura
  static async deleteReading(req, res) {
    try {
      const { id } = req.params;
      const reading = await HealthReading.findById(id);

      if (!reading) {
        return res.status(404).json({
          success: false,
          message: 'Leitura não encontrada'
        });
      }

      // Verificar se a leitura pertence ao usuário
      if (reading.user_id !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Acesso negado'
        });
      }

      await HealthReading.delete(id);

      res.json({
        success: true,
        message: 'Leitura deletada com sucesso'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao deletar leitura',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Obter estatísticas de saúde
  static async getHealthStats(req, res) {
    try {
      const { days = 30 } = req.query;

      const [bpStats, hrStats, weightStats, latestReadings] = await Promise.all([
        HealthReading.getAverageReadings(req.user.id, 'blood_pressure', days),
        HealthReading.getAverageReadings(req.user.id, 'heart_rate', days),
        HealthReading.getAverageReadings(req.user.id, 'weight', days),
        HealthReading.getLatestReadings(req.user.id, 10)
      ]);

      res.json({
        success: true,
        data: {
          averages: {
            blood_pressure: bpStats,
            heart_rate: hrStats,
            weight: weightStats
          },
          latest_readings: latestReadings,
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

module.exports = HealthController;