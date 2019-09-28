const fs = require('fs-extra');
const { knex, config } = require('../knex');

async function types() {
  return knex.schema
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
    });
}

async function moves() {
  return knex.schema
    .createTable('moves', table => {
      table.increments();
      table.string('identifier').notNullable();
      table
        .integer('generation_id')
        .references('generations.id')
        .notNullable();
      table
        .integer('type_id')
        .references('types.id')
        .notNullable();
      table.integer('power');
      table.integer('pp');
      table.integer('accuracy');
      table.integer('priority').notNullable();
      table
        .integer('target_id')
        .references('move_targets.id')
        .notNullable();
      table
        .integer('damage_class_id')
        .references('move_damage_classes.id')
        .notNullable();
      table
        .integer('effect_id')
        .references('move_effects.id')
        .notNullable();
      table.integer('effect_chance');
      table.integer('contest_type_id').references('contest_types.id');
      table.integer('contest_effect_id').references('contest_effects.id');
      table
        .integer('super_contest_effect_id')
        .references('super_contest_effects.id');
    })

    .createTable('move_names', table => {
      table
        .integer('move_id')
        .references('moves.id')
        .notNullable();
      table
        .integer('local_language_id')
        .references('languages.id')
        .notNullable();
      table.string('name').notNullable();
      table.primary(['move_id', 'local_language_id']);
    })

    .createTable('move_effects', table => {
      table.increments();
    })

    .createTable('move_effect_prose', table => {
      table
        .integer('move_effect_id')
        .references('move_effects.id')
        .notNullable();
      table
        .integer('local_language_id')
        .references('languages.id')
        .notNullable();
      table.text('short_effect');
      table.text('effect');
      table.primary(['move_effect_id', 'local_language_id']);
    })

    .createTable('move_targets', table => {
      table.increments();
      table.string('identifier').notNullable();
    })

    .createTable('move_target_prose', table => {
      table
        .integer('move_target_id')
        .references('move_targets.id')
        .notNullable();
      table
        .integer('local_language_id')
        .references('languages.id')
        .notNullable();
      table.string('name');
      table.text('description');
      table.primary(['move_target_id', 'local_language_id']);
    })

    .createTable('move_damage_classes', table => {
      table.increments();
      table.string('identifier').notNullable();
    })

    .createTable('move_damage_class_prose', table => {
      table
        .integer('move_damage_class_id')
        .references('move_damage_classes.id')
        .notNullable();
      table
        .integer('local_language_id')
        .references('languages.id')
        .notNullable();
      table.string('name');
      table.text('description');
      table.primary(['move_damage_class_id', 'local_language_id']);
    })

    .createTable('move_flavor_text', table => {
      table
        .integer('move_id')
        .references('moves.id')
        .notNullable();
      table
        .integer('version_group_id')
        .references('version_groups.id')
        .notNullable();
      table
        .integer('language_id')
        .references('languages.id')
        .notNullable();
      table.text('flavor_text');
      table.primary(['move_id', 'version_group_id', 'language_id']);
    })

    .createTable('move_flags', table => {
      table.increments();
      table.string('identifier').notNullable();
    })

    .createTable('move_flag_map', table => {
      table
        .integer('move_id')
        .references('moves.id')
        .notNullable();
      table
        .integer('move_flag_id')
        .references('move_flags.id')
        .notNullable();
      table.string('name');
      table.text('description');
      table.primary(['move_id', 'move_flag_id']);
    })

    .createTable('move_flag_prose', table => {
      table
        .integer('move_flag_id')
        .references('move_flags.id')
        .notNullable();
      table
        .integer('local_language_id')
        .references('languages.id')
        .notNullable();
      table.string('name');
      table.text('description');
      table.primary(['move_flag_id', 'local_language_id']);
    })

    .createTable('move_meta', table => {
      table
        .integer('move_id')
        .references('moves.id')
        .notNullable();
      table
        .integer('meta_category_id')
        .references('move_meta_categories.id')
        .notNullable();
      table
        .integer('meta_ailment_id')
        .references('move_meta_ailments.id')
        .notNullable();
      table.integer('min_hits');
      table.integer('max_hits');
      table.integer('min_turns');
      table.integer('max_turns');
      table.integer('drain').notNullable();
      table.integer('healing').notNullable();
      table.integer('crit_rate').notNullable();
      table.integer('ailment_chance').notNullable();
      table.integer('flinch_chance').notNullable();
      table.integer('stat_chance').notNullable();
      table.primary(['move_id']);
    })

    .createTable('move_meta_ailments', table => {
      table.increments();
      table.string('identifier').notNullable();
    })

    .createTable('move_meta_ailment_names', table => {
      table
        .integer('move_meta_ailment_id')
        .references('move_meta_ailments.id')
        .notNullable();
      table
        .integer('local_language_id')
        .references('languages.id')
        .notNullable();
      table.string('name').notNullable();
      table.primary(['move_meta_ailment_id', 'local_language_id']);
    })

    .createTable('move_meta_categories', table => {
      table.increments();
      table.string('identifier').notNullable();
    })

    .createTable('move_meta_category_prose', table => {
      table
        .integer('move_meta_category_id')
        .references('move_meta_categories.id')
        .notNullable();
      table
        .integer('local_language_id')
        .references('languages.id')
        .notNullable();
      table.text('description');
      table.primary(['move_meta_category_id', 'local_language_id']);
    })

    .createTable('move_meta_stat_changes', table => {
      table
        .integer('move_id')
        .references('moves.id')
        .notNullable();
      table
        .integer('stat_id')
        .references('stats.id')
        .notNullable();
      table.integer('change').notNullable();
      table.primary(['move_id', 'stat_id']);
    });
}

async function abilities() {
  return knex.schema
    .createTable('abilities', table => {
      table.increments();
      table.string('identifier').notNullable();
      table
        .integer('generation_id')
        .references('generations.id')
        .notNullable();
      table.boolean('is_main_series').notNullable();
    })

    .createTable('ability_names', table => {
      table
        .integer('ability_id')
        .references('abilities.id')
        .notNullable();
      table
        .integer('local_language_id')
        .references('languages.id')
        .notNullable();
      table.string('name').notNullable();
      table.primary(['ability_id', 'local_language_id']);
    })

    .createTable('ability_prose', table => {
      table
        .integer('ability_id')
        .references('abilities.id')
        .notNullable();
      table
        .integer('local_language_id')
        .references('languages.id')
        .notNullable();
      table.text('short_effect');
      table.text('effect');
      table.primary(['ability_id', 'local_language_id']);
    })

    .createTable('ability_flavor_text', table => {
      table
        .integer('ability_id')
        .references('abilities.id')
        .notNullable();
      table
        .integer('version_group_id')
        .references('version_groups.id')
        .notNullable();
      table
        .integer('language_id')
        .references('languages.id')
        .notNullable();
      table.text('flavor_text');
      table.primary(['ability_id', 'version_group_id', 'language_id']);
    });
}

async function items() {
  return knex.schema
    .createTable('items', table => {
      table.increments();
      table.string('identifier').notNullable();
      table
        .integer('category_id')
        .references('item_categories.id')
        .notNullable();
      table.integer('cost').notNullable();
      table.integer('fling_power');
      table.integer('fling_effect_id').references('item_fling_effects.id');
    })

    .createTable('item_names', table => {
      table
        .integer('item_id')
        .references('items.id')
        .notNullable();
      table
        .integer('local_language_id')
        .references('languages.id')
        .notNullable();
      table.string('name').notNullable();
      table.primary(['item_id', 'local_language_id']);
    })

    .createTable('item_prose', table => {
      table
        .integer('item_id')
        .references('items.id')
        .notNullable();
      table
        .integer('local_language_id')
        .references('languages.id')
        .notNullable();
      table.text('short_effect');
      table.text('effect');
      table.primary(['item_id', 'local_language_id']);
    })

    .createTable('item_flavor_text', table => {
      table
        .integer('item_id')
        .references('items.id')
        .notNullable();
      table
        .integer('version_group_id')
        .references('version_groups.id')
        .notNullable();
      table
        .integer('language_id')
        .references('languages.id')
        .notNullable();
      table.text('flavor_text');
      table.primary(['item_id', 'version_group_id', 'language_id']);
    })

    .createTable('item_categories', table => {
      table.increments();
      table
        .integer('pocket_id')
        .references('item_pockets.id')
        .notNullable();
      table.string('identifier').notNullable();
    })

    .createTable('item_category_prose', table => {
      table
        .integer('item_category_id')
        .references('item_categories.id')
        .notNullable();
      table
        .integer('local_language_id')
        .references('languages.id')
        .notNullable();
      table.string('name');
      table.primary(['item_category_id', 'local_language_id']);
    })

    .createTable('item_fling_effects', table => {
      table.increments();
      table.string('identifier').notNullable();
    })

    .createTable('item_fling_effect_prose', table => {
      table
        .integer('item_fling_effect_id')
        .references('item_fling_effects.id')
        .notNullable();
      table
        .integer('local_language_id')
        .references('languages.id')
        .notNullable();
      table.text('effect');
      table.primary(['item_fling_effect_id', 'local_language_id']);
    })

    .createTable('item_pockets', table => {
      table.increments();
      table.string('identifier').notNullable();
    })

    .createTable('item_pocket_names', table => {
      table
        .integer('item_pocket_id')
        .references('item_pockets.id')
        .notNullable();
      table
        .integer('local_language_id')
        .references('languages.id')
        .notNullable();
      table.string('name').notNullable();
      table.primary(['item_pocket_id', 'local_language_id']);
    })

    .createTable('item_flags', table => {
      table.increments();
      table.string('identifier').notNullable();
    })

    .createTable('item_flag_prose', table => {
      table
        .integer('item_flag_id')
        .references('item_flags.id')
        .notNullable();
      table
        .integer('local_language_id')
        .references('languages.id')
        .notNullable();
      table.string('name');
      table.text('description');
      table.primary(['item_flag_id', 'local_language_id']);
    })

    .createTable('item_flag_map', table => {
      table
        .integer('item_id')
        .references('items.id')
        .notNullable();
      table
        .integer('item_flag_id')
        .references('item_flags.id')
        .notNullable();
      table.string('name');
      table.text('description');
      table.primary(['item_id', 'item_flag_id']);
    });
}

async function languages() {
  return knex.schema
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
    });
}

async function generations() {
  return knex.schema
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
    });
}

async function regions() {
  return knex.schema
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
    });
}

async function verions() {
  return knex.schema
    .createTable('versions', table => {
      table.increments();
      table
        .integer('version_group_id')
        .references('version_groups.id')
        .notNullable();
      table.string('identifier').notNullable();
    })

    .createTable('version_names', table => {
      table
        .integer('version_id')
        .references('versions.id')
        .notNullable();
      table
        .integer('local_language_id')
        .references('languages.id')
        .notNullable();
      table.string('name').notNullable();
      table.primary(['version_id', 'local_language_id']);
    })

    .createTable('version_groups', table => {
      table.increments();
      table
        .string('identifier')
        .unique()
        .notNullable();
      table
        .integer('generation_id')
        .references('generations.id')
        .notNullable();
      table.integer('order');
    })

    .createTable('version_group_regions', table => {
      table
        .integer('version_group_id')
        .references('version_groups.id')
        .notNullable();
      table
        .integer('region_id')
        .references('regions.id')
        .notNullable();
      table.primary(['version_group_id', 'region_id']);
    });
}

async function stats() {
  return knex.schema
    .createTable('stats', table => {
      table.increments();
      table.integer('damage_class_id').references('move_damage_classes.id');
      table.string('identifier').notNullable();
      table.boolean('is_battle_only').notNullable();
      table.integer('game_index');
    })

    .createTable('stat_names', table => {
      table
        .integer('stat_id')
        .references('stats.id')
        .notNullable();
      table
        .integer('local_language_id')
        .references('languages.id')
        .notNullable();
      table.string('name').notNullable();
      table.primary(['stat_id', 'local_language_id']);
    });
}

async function natures() {
  return knex.schema
    .createTable('natures', table => {
      table.increments();
      table.string('identifier').notNullable();
      table
        .integer('decreased_stat_id')
        .references('stats.id')
        .notNullable();
      table
        .integer('increased_stat_id')
        .references('stats.id')
        .notNullable();
      table
        .integer('hates_flavor_id')
        .references('contest_types.id')
        .notNullable();
      table
        .integer('likes_flavor_id')
        .references('contest_types.id')
        .notNullable();
      table
        .integer('game_index')
        .unique()
        .notNullable();
    })

    .createTable('nature_names', table => {
      table
        .integer('nature_id')
        .references('natures.id')
        .notNullable();
      table
        .integer('local_language_id')
        .references('languages.id')
        .notNullable();
      table.string('name').notNullable();
      table.primary(['nature_id', 'local_language_id']);
    });
}

async function contests() {
  return knex.schema
    .createTable('contest_types', table => {
      table.increments();
      table.string('identifier').notNullable();
    })

    .createTable('contest_effects', table => {
      table.increments();
      table.integer('appeal').notNullable();
      table.integer('jam').notNullable();
    })

    .createTable('super_contest_effects', table => {
      table.increments();
      table.integer('appeal').notNullable();
    });
}

// TODO
// pokemon*
// evolution_chains, evolution_triggers, evolution_trigger_prose

async function build() {
  console.log('creating database...');
  await fs.remove(config.connection.filename);
  await fs.ensureFile(config.connection.filename);

  console.log('creating tables...');
  await languages();
  await types();
  await moves();
  await abilities();
  await items();
  await generations();
  await regions();
  await verions();
  await stats();
  await natures();
  await contests();

  console.log('');
}

module.exports = build;
