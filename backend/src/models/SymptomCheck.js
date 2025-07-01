const knex = require('../config/database');

class SymptomCheck {
  static get tableName() {
    return 'symptom_checks';
  }

  static async findAll() {
    const db = knex[process.env.NODE_ENV || 'development'];
    return await db(this.tableName).select('*');
  }

  static async findById(id) {
    const db = knex[process.env.NODE_ENV || 'development'];
    return await db(this.tableName).where('id', id).first();
  }

  static async findByUserId(userId) {
    const db = knex[process.env.NODE_ENV || 'development'];
    return await db(this.tableName)
      .where('user_id', userId)
      .orderBy('check_date', 'desc');
  }

  static async create(checkData) {
    const db = knex[process.env.NODE_ENV || 'development'];
    
    // Determinar se há sintomas de AVC
    checkData.has_stroke_symptoms = 
      checkData.face_symptoms || 
      checkData.arms_symptoms || 
      checkData.speech_symptoms;

    const [id] = await db(this.tableName).insert(checkData);
    return await this.findById(id);
  }

  static async update(id, checkData) {
    const db = knex[process.env.NODE_ENV || 'development'];
    
    // Atualizar o campo has_stroke_symptoms se os sintomas foram modificados
    if (checkData.face_symptoms !== undefined || 
        checkData.arms_symptoms !== undefined || 
        checkData.speech_symptoms !== undefined) {
      
      const currentCheck = await this.findById(id);
      checkData.has_stroke_symptoms = 
        (checkData.face_symptoms !== undefined ? checkData.face_symptoms : currentCheck.face_symptoms) ||
        (checkData.arms_symptoms !== undefined ? checkData.arms_symptoms : currentCheck.arms_symptoms) ||
        (checkData.speech_symptoms !== undefined ? checkData.speech_symptoms : currentCheck.speech_symptoms);
    }

    await db(this.tableName).where('id', id).update(checkData);
    return await this.findById(id);
  }

  static async delete(id) {
    const db = knex[process.env.NODE_ENV || 'development'];
    return await db(this.tableName).where('id', id).del();
  }

  static async getRecentChecks(userId, limit = 10) {
    const db = knex[process.env.NODE_ENV || 'development'];
    return await db(this.tableName)
      .where('user_id', userId)
      .orderBy('check_date', 'desc')
      .limit(limit);
  }

  static async getPositiveChecks(userId) {
    const db = knex[process.env.NODE_ENV || 'development'];
    return await db(this.tableName)
      .where('user_id', userId)
      .where('has_stroke_symptoms', true)
      .orderBy('check_date', 'desc');
  }

  static async getChecksByDateRange(userId, startDate, endDate) {
    const db = knex[process.env.NODE_ENV || 'development'];
    return await db(this.tableName)
      .where('user_id', userId)
      .whereBetween('check_date', [startDate, endDate])
      .orderBy('check_date', 'desc');
  }

  static async getStatistics(userId, days = 30) {
    const db = knex[process.env.NODE_ENV || 'development'];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const stats = await db(this.tableName)
      .where('user_id', userId)
      .where('check_date', '>=', startDate)
      .select(
        db.raw('COUNT(*) as total_checks'),
        db.raw('SUM(CASE WHEN has_stroke_symptoms = 1 THEN 1 ELSE 0 END) as positive_checks'),
        db.raw('SUM(CASE WHEN face_symptoms = 1 THEN 1 ELSE 0 END) as face_symptoms_count'),
        db.raw('SUM(CASE WHEN arms_symptoms = 1 THEN 1 ELSE 0 END) as arms_symptoms_count'),
        db.raw('SUM(CASE WHEN speech_symptoms = 1 THEN 1 ELSE 0 END) as speech_symptoms_count')
      )
      .first();

    return stats;
  }
}

module.exports = SymptomCheck;