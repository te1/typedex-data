const fs = require('fs-extra');
const Knex = require('knex');
const knexConfig = require('../knexfile');

function createTables(knex) {
  return (
    knex.schema
      // -- Languages
      .createTable('languages', table => {
        table.increments();
        table.string('iso639').notNullable();
        table.string('iso3166').notNullable();
        table.string('identifier').notNullable();
        table.boolean('official').notNullable();
        table.integer('order');
      })

      .createTable('language_names', table => {
        table
          .integer('language_id')
          .references('languages.id')
          .notNullable();
        table
          .integer('local_language_id')
          .references('languages.id')
          .notNullable();
        table.string('name').notNullable();
        table.primary(['language_id', 'local_language_id']);
      })

      // -- Types
      .createTable('types', table => {
        table.increments();
        table.string('identifier').notNullable();
        table
          .integer('generation_id')
          .references('generations.id')
          .notNullable();
        table.integer('damage_class_id').references('move_damage_classes.id');
      })

      .createTable('type_names', table => {
        table
          .integer('type_id')
          .references('types.id')
          .notNullable();
        table
          .integer('local_language_id')
          .references('languages.id')
          .notNullable();
        table.string('name').notNullable();
        table.primary(['type_id', 'local_language_id']);
      })

      .createTable('type_efficacy', table => {
        table
          .integer('damage_type_id')
          .references('types.id')
          .notNullable();
        table
          .integer('target_type_id')
          .references('types.id')
          .notNullable();
        table.integer('damage_factor').notNullable();
        table.primary(['damage_type_id', 'target_type_id']);
      })

      // -- Moves
      .createTable('move_damage_classes', table => {
        table.increments();
        table.string('identifier').notNullable();
      })

      // -- Generations
      .createTable('generations', table => {
        table.increments();
        table
          .integer('main_region_id')
          .references('regions.id')
          .notNullable();
        table.string('identifier').notNullable();
      })

      .createTable('generation_names', table => {
        table
          .integer('generation_id')
          .references('generations.id')
          .notNullable();
        table
          .integer('local_language_id')
          .references('languages.id')
          .notNullable();
        table.string('name').notNullable();
        table.primary(['generation_id', 'local_language_id']);
      })

      // -- Regions
      .createTable('regions', table => {
        table.increments();
        table.string('identifier').notNullable();
      })

      .createTable('region_names', table => {
        table
          .integer('region_id')
          .references('regions.id')
          .notNullable();
        table
          .integer('local_language_id')
          .references('languages.id')
          .notNullable();
        table.string('name').notNullable();
        table.primary(['region_id', 'local_language_id']);
      })
  );
}

// TODO version*, move*, pokemon*

async function init() {
  await fs.remove(knexConfig.connection.filename);
  await fs.ensureFile(knexConfig.connection.filename);

  const knex = Knex(knexConfig);

  await createTables(knex);

  return knex;
}

module.exports = init;
