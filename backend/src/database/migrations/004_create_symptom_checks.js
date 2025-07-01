/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('symptom_checks', function(table) {
    table.increments('id').primary();
    table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    table.boolean('face_symptoms').notNullable();
    table.boolean('arms_symptoms').notNullable();
    table.boolean('speech_symptoms').notNullable();
    table.boolean('has_stroke_symptoms').notNullable();
    table.text('additional_notes');
    table.timestamp('check_date').defaultTo(knex.fn.now());
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('symptom_checks');
};