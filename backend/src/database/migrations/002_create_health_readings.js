/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('health_readings', function(table) {
    table.increments('id').primary();
    table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    table.enum('type', ['blood_pressure', 'heart_rate', 'weight']).notNullable();
    table.integer('systolic'); // Para pressão arterial
    table.integer('diastolic'); // Para pressão arterial
    table.integer('heart_rate'); // Para frequência cardíaca
    table.decimal('weight', 5, 2); // Para peso
    table.text('notes');
    table.timestamp('reading_date').defaultTo(knex.fn.now());
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('health_readings');
};