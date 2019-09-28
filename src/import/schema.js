const fs = require('fs-extra');
const { knex, config } = require('../knex');

function createTables() {
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
// abilities, ability_names, ability_prose, ability_flavor_text
// evolution_chains, evolution_triggers, evolution_trigger_prose
// items, item_names, item_prose, item_flavor_summaries, item_flavor_text
// moves, move_names, move_flavor_summaries, move_effects, move_effect_prose, move_flavor_text
// natures, nature_names, stats, stat_names

async function build() {
  console.log('creating database...');
  await fs.remove(config.connection.filename);
  await fs.ensureFile(config.connection.filename);

  console.log('creating tables...');
  await createTables();
}

module.exports = build;
