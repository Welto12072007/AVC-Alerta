/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('users', function(table) {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('email').unique().notNullable();
    table.string('password').notNullable();
    table.date('birth_date');
    table.enum('gender', ['masculino', 'feminino', 'outro']);
    table.string('phone');
    table.text('medical_conditions');
    table.text('medications');
    table.text('allergies');
    table.string('emergency_contact_name');
    table.string('emergency_contact_phone');
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('users');
};