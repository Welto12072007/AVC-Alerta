const knex = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static get tableName() {
    return 'users';
  }

  static async findAll() {
    const db = knex[process.env.NODE_ENV || 'development'];
    return await db(this.tableName).select('*');
  }

  static async findById(id) {
    const db = knex[process.env.NODE_ENV || 'development'];
    return await db(this.tableName).where('id', id).first();
  }

  static async findByEmail(email) {
    const db = knex[process.env.NODE_ENV || 'development'];
    return await db(this.tableName).where('email', email).first();
  }

  static async create(userData) {
    const db = knex[process.env.NODE_ENV || 'development'];
    
    // Hash da senha
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }

    const [id] = await db(this.tableName).insert(userData);
    return await this.findById(id);
  }

  static async update(id, userData) {
    const db = knex[process.env.NODE_ENV || 'development'];
    
    // Hash da senha se estiver sendo atualizada
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }

    await db(this.tableName).where('id', id).update(userData);
    return await this.findById(id);
  }

  static async delete(id) {
    const db = knex[process.env.NODE_ENV || 'development'];
    return await db(this.tableName).where('id', id).del();
  }

  static async validatePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  static async getUserProfile(id) {
    const db = knex[process.env.NODE_ENV || 'development'];
    const user = await db(this.tableName)
      .select('id', 'name', 'email', 'birth_date', 'gender', 'phone', 
              'medical_conditions', 'medications', 'allergies', 
              'emergency_contact_name', 'emergency_contact_phone', 'created_at')
      .where('id', id)
      .first();
    
    return user;
  }
}

module.exports = User;