const knex = require('../config/database');

class EmergencyContact {
  static get tableName() {
    return 'emergency_contacts';
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
      .orderBy('is_primary', 'desc')
      .orderBy('type')
      .orderBy('name');
  }

  static async findByUserIdAndType(userId, type) {
    const db = knex[process.env.NODE_ENV || 'development'];
    return await db(this.tableName)
      .where('user_id', userId)
      .where('type', type)
      .orderBy('is_primary', 'desc')
      .orderBy('name');
  }

  static async create(contactData) {
    const db = knex[process.env.NODE_ENV || 'development'];
    
    // Se este contato está sendo marcado como primário, desmarcar outros
    if (contactData.is_primary) {
      await db(this.tableName)
        .where('user_id', contactData.user_id)
        .where('type', contactData.type)
        .update({ is_primary: false });
    }

    const [id] = await db(this.tableName).insert(contactData);
    return await this.findById(id);
  }

  static async update(id, contactData) {
    const db = knex[process.env.NODE_ENV || 'development'];
    
    // Se este contato está sendo marcado como primário, desmarcar outros
    if (contactData.is_primary) {
      const contact = await this.findById(id);
      if (contact) {
        await db(this.tableName)
          .where('user_id', contact.user_id)
          .where('type', contact.type)
          .where('id', '!=', id)
          .update({ is_primary: false });
      }
    }

    await db(this.tableName).where('id', id).update(contactData);
    return await this.findById(id);
  }

  static async delete(id) {
    const db = knex[process.env.NODE_ENV || 'development'];
    return await db(this.tableName).where('id', id).del();
  }

  static async getPrimaryContact(userId, type) {
    const db = knex[process.env.NODE_ENV || 'development'];
    return await db(this.tableName)
      .where('user_id', userId)
      .where('type', type)
      .where('is_primary', true)
      .first();
  }
}

module.exports = EmergencyContact;