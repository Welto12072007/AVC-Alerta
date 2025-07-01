const knex = require('../config/database');

class HealthReading {
  static get tableName() {
    return 'health_readings';
  }

  static async findAll() {
    const db = knex[process.env.NODE_ENV || 'development'];
    return await db(this.tableName).select('*');
  }

  static async findById(id) {
    const db = knex[process.env.NODE_ENV || 'development'];
    return await db(this.tableName).where('id', id).first();
  }

  static async findByUserId(userId, type = null) {
    const db = knex[process.env.NODE_ENV || 'development'];
    let query = db(this.tableName).where('user_id', userId);
    
    if (type) {
      query = query.where('type', type);
    }
    
    return await query.orderBy('reading_date', 'desc');
  }

  static async create(readingData) {
    const db = knex[process.env.NODE_ENV || 'development'];
    const [id] = await db(this.tableName).insert(readingData);
    return await this.findById(id);
  }

  static async update(id, readingData) {
    const db = knex[process.env.NODE_ENV || 'development'];
    await db(this.tableName).where('id', id).update(readingData);
    return await this.findById(id);
  }

  static async delete(id) {
    const db = knex[process.env.NODE_ENV || 'development'];
    return await db(this.tableName).where('id', id).del();
  }

  static async getLatestReadings(userId, limit = 10) {
    const db = knex[process.env.NODE_ENV || 'development'];
    return await db(this.tableName)
      .where('user_id', userId)
      .orderBy('reading_date', 'desc')
      .limit(limit);
  }

  static async getReadingsByDateRange(userId, startDate, endDate, type = null) {
    const db = knex[process.env.NODE_ENV || 'development'];
    let query = db(this.tableName)
      .where('user_id', userId)
      .whereBetween('reading_date', [startDate, endDate]);
    
    if (type) {
      query = query.where('type', type);
    }
    
    return await query.orderBy('reading_date', 'desc');
  }

  static async getAverageReadings(userId, type, days = 30) {
    const db = knex[process.env.NODE_ENV || 'development'];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    if (type === 'blood_pressure') {
      return await db(this.tableName)
        .where('user_id', userId)
        .where('type', type)
        .where('reading_date', '>=', startDate)
        .avg('systolic as avg_systolic')
        .avg('diastolic as avg_diastolic')
        .first();
    } else if (type === 'heart_rate') {
      return await db(this.tableName)
        .where('user_id', userId)
        .where('type', type)
        .where('reading_date', '>=', startDate)
        .avg('heart_rate as avg_heart_rate')
        .first();
    } else if (type === 'weight') {
      return await db(this.tableName)
        .where('user_id', userId)
        .where('type', type)
        .where('reading_date', '>=', startDate)
        .avg('weight as avg_weight')
        .first();
    }
  }
}

module.exports = HealthReading;