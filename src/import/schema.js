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

async function pokedex() {
  return knex.schema
    .createTable('pokedexes', table => {
      table.increments();
      table.integer('region_id').references('regions.id');
      table.string('identifier').notNullable();
      table.boolean('is_main_series').notNullable();
    })

    .createTable('pokedex_prose', table => {
      table
        .integer('pokedex_id')
        .references('pokedexes.id')
        .notNullable();
      table
        .integer('local_language_id')
        .references('languages.id')
        .notNullable();
      table.string('name');
      table.text('description');
      table.primary(['pokedex_id', 'local_language_id']);
    })

    .createTable('pokedex_version_groups', table => {
      table
        .integer('pokedex_id')
        .references('pokedexes.id')
        .notNullable();
      table
        .integer('version_group_id')
        .references('version_groups.id')
        .notNullable();
      table.string('name');
      table.text('description');
      table.primary(['pokedex_id', 'version_group_id']);
    });
}

async function pokemon() {
  return knex.schema
    .createTable('pokemon', table => {
      table.increments();
      table.string('identifier').notNullable();
      table.integer('species_id').references('pokemon_species.id');
      table.integer('height').notNullable();
      table.integer('weight').notNullable();
      table.integer('base_experience').notNullable();
      table.integer('order').notNullable();
      table.boolean('is_default').notNullable();
    })

    .createTable('pokemon_habitats', table => {
      table.increments();
      table.string('identifier').notNullable();
    })

    .createTable('pokemon_habitat_names', table => {
      table
        .integer('pokemon_habitat_id')
        .references('pokemon_habitats.id')
        .notNullable();
      table
        .integer('local_language_id')
        .references('languages.id')
        .notNullable();
      table.string('name').notNullable();
      table.primary(['pokemon_habitat_id', 'local_language_id']);
    })

    .createTable('pokemon_shapes', table => {
      table.increments();
      table.string('identifier').notNullable();
    })

    .createTable('pokemon_shape_prose', table => {
      table
        .integer('pokemon_shape_id')
        .references('pokemon_shapes.id')
        .notNullable();
      table
        .integer('local_language_id')
        .references('languages.id')
        .notNullable();
      table.string('name');
      table.string('awesome_name');
      table.text('description');
      table.primary(['pokemon_shape_id', 'local_language_id']);
    })

    .createTable('pokemon_colors', table => {
      table.increments();
      table.string('identifier').notNullable();
    })

    .createTable('pokemon_color_names', table => {
      table
        .integer('pokemon_color_id')
        .references('pokemon_colors.id')
        .notNullable();
      table
        .integer('local_language_id')
        .references('languages.id')
        .notNullable();
      table.string('name').notNullable();
      table.primary(['pokemon_color_id', 'local_language_id']);
    })

    .createTable('pokemon_evolution', table => {
      table.increments();
      table
        .integer('evolved_species_id')
        .references('pokemon_species.id')
        .notNullable();
      table
        .integer('evolution_trigger_id')
        .references('evolution_triggers.id')
        .notNullable();
      table.integer('trigger_item_id').references('items.id');
      table.integer('minimum_level');
      table.integer('gender_id').references('genders.id');
      table.integer('location_id').references('locations.id');
      table.integer('held_item_id').references('items.id');
      table.string('time_of_day');
      table.integer('known_move_id').references('moves.id');
      table.integer('known_move_type_id').references('types.id');
      table.integer('minimum_happiness');
      table.integer('minimum_beauty');
      table.integer('minimum_affection');
      table.integer('relative_physical_stats');
      table.integer('party_species_id').references('pokemon_species.id');
      table.integer('party_type_id').references('types.id');
      table.integer('trade_species_id').references('pokemon_species.id');
      table.boolean('needs_overworld_rain').notNullable();
      table.boolean('turn_upside_down').notNullable();
    })

    .createTable('pokemon_moves', table => {
      table
        .integer('pokemon_id')
        .references('pokemon.id')
        .notNullable();
      table
        .integer('version_group_id')
        .references('version_groups.id')
        .notNullable();
      table
        .integer('move_id')
        .references('moves.id')
        .notNullable();
      table
        .integer('pokemon_move_method_id')
        .references('pokemon_move_methods.id')
        .notNullable();
      table.integer('level').notNullable();
      table.integer('order');
      table.primary([
        'pokemon_id',
        'version_group_id',
        'move_id',
        'pokemon_move_method_id',
        'level',
      ]);
    })

    .createTable('pokemon_move_methods', table => {
      table.increments();
      table.string('identifier').notNullable();
    })

    .createTable('pokemon_move_method_prose', table => {
      table
        .integer('pokemon_move_method_id')
        .references('pokemon_move_methods.id')
        .notNullable();
      table
        .integer('local_language_id')
        .references('languages.id')
        .notNullable();
      table.string('name');
      table.text('description');
      table.primary(['pokemon_move_method_id', 'local_language_id']);
    })

    .createTable('version_group_pokemon_move_methods', table => {
      table
        .integer('version_group_id')
        .references('version_groups.id')
        .notNullable();
      table
        .integer('pokemon_move_method_id')
        .references('pokemon_move_methods.id')
        .notNullable();
      table.primary(['version_group_id', 'pokemon_move_method_id']);
    });
}

async function pokemon_relations() {
  return knex.schema
    .createTable('pokemon_stats', table => {
      table
        .integer('pokemon_id')
        .references('pokemon.id')
        .notNullable();
      table
        .integer('stat_id')
        .references('stats.id')
        .notNullable();
      table.integer('base_stat').notNullable();
      table.integer('effort').notNullable();
      table.primary(['pokemon_id', 'stat_id']);
    })

    .createTable('pokemon_types', table => {
      table
        .integer('pokemon_id')
        .references('pokemon.id')
        .notNullable();
      table
        .integer('type_id')
        .references('types.id')
        .notNullable();
      table.integer('slot');
      table.primary(['pokemon_id', 'slot']);
    })

    .createTable('pokemon_items', table => {
      table
        .integer('pokemon_id')
        .references('pokemon.id')
        .notNullable();
      table
        .integer('version_id')
        .references('versions.id')
        .notNullable();
      table
        .integer('item_id')
        .references('items.id')
        .notNullable();
      table.integer('rarity').notNullable();
      table.primary(['pokemon_id', 'version_id', 'item_id']);
    })

    .createTable('pokemon_abilities', table => {
      table
        .integer('pokemon_id')
        .references('pokemon.id')
        .notNullable();
      table
        .integer('ability_id')
        .references('abilities.id')
        .notNullable();
      table.boolean('is_hidden').notNullable();
      table.integer('slot').notNullable();
      table.primary(['pokemon_id', 'slot']);
    });
}

async function pokemon_species() {
  return knex.schema
    .createTable('pokemon_species', table => {
      table.increments();
      table.string('identifier').notNullable();
      table.integer('generation_id').references('generations.id');
      table.integer('evolves_from_species_id').references('pokemon_species.id');
      table.integer('evolution_chain_id').references('evolution_chains.id');
      table
        .integer('color_id')
        .references('pokemon_colors.id')
        .notNullable();
      table
        .integer('shape_id')
        .references('pokemon_shapes.id')
        .notNullable();
      table.integer('habitat_id').references('pokemon_habitats.id');
      table.integer('gender_rate').notNullable();
      table.integer('capture_rate').notNullable();
      table.integer('base_happiness').notNullable();
      table.boolean('is_baby').notNullable();
      table.integer('hatch_counter').notNullable();
      table.boolean('has_gender_differences').notNullable();
      table
        .integer('growth_rate_id')
        .references('growth_rates.id')
        .notNullable();
      table.boolean('forms_switchable').notNullable();
      table.integer('order').notNullable();
      table.integer('conquest_order');
    })

    .createTable('pokemon_species_names', table => {
      table
        .integer('pokemon_species_id')
        .references('pokemon_species.id')
        .notNullable();
      table
        .integer('local_language_id')
        .references('languages.id')
        .notNullable();
      table.string('name');
      table.text('genus');
      table.primary(['pokemon_species_id', 'local_language_id']);
    })

    .createTable('pokemon_species_prose', table => {
      table
        .integer('pokemon_species_id')
        .references('pokemon_species.id')
        .notNullable();
      table
        .integer('local_language_id')
        .references('languages.id')
        .notNullable();
      table.text('form_description');
      table.primary(['pokemon_species_id', 'local_language_id']);
    })

    .createTable('pokemon_species_flavor_text', table => {
      table
        .integer('species_id')
        .references('pokemon_species.id')
        .notNullable();
      table
        .integer('version_id')
        .references('versions.id')
        .notNullable();
      table
        .integer('language_id')
        .references('languages.id')
        .notNullable();
      table.text('flavor_text').notNullable();
      table.primary(['species_id', 'version_id', 'language_id']);
    })

    .createTable('pokemon_dex_numbers', table => {
      table
        .integer('species_id')
        .references('pokemon_species.id')
        .notNullable();
      table
        .integer('pokedex_id')
        .references('pokedexes.id')
        .notNullable();
      table.integer('pokedex_number').notNullable();
      table.unique(['pokedex_id', 'pokedex_number']);
      table.unique(['pokedex_id', 'species_id']);
      table.primary(['species_id', 'pokedex_id']);
    })

    .createTable('pokemon_egg_groups', table => {
      table
        .integer('species_id')
        .references('pokemon_species.id')
        .notNullable();
      table
        .integer('egg_group_id')
        .references('egg_groups.id')
        .notNullable();
      table.primary(['species_id', 'egg_group_id']);
    });
}

async function pokemon_forms() {
  return knex.schema
    .createTable('pokemon_forms', table => {
      table.increments();
      table.string('identifier').notNullable();
      table.string('form_identifier');
      table
        .integer('pokemon_id')
        .references('pokemon.id')
        .notNullable();
      table
        .integer('introduced_in_version_group_id')
        .references('version_groups.id');
      table.boolean('is_default').notNullable();
      table.boolean('is_battle_only').notNullable();
      table.boolean('is_mega').notNullable();
      table.integer('form_order').notNullable();
      table.integer('order').notNullable();
    })

    .createTable('pokemon_form_names', table => {
      table
        .integer('pokemon_form_id')
        .references('pokemon_forms.id')
        .notNullable();
      table
        .integer('local_language_id')
        .references('languages.id')
        .notNullable();
      table.string('form_name');
      table.string('pokemon_name');
      table.primary(['pokemon_form_id', 'local_language_id']);
    })

    .createTable('pokemon_form_generations', table => {
      table
        .integer('pokemon_form_id')
        .references('pokemon_forms.id')
        .notNullable();
      table
        .integer('generation_id')
        .references('generations.id')
        .notNullable();
      table.integer('game_index').notNullable();
      table.primary(['pokemon_form_id', 'generation_id']);
    });
}

async function pokemon_misc() {
  return knex.schema
    .createTable('growth_rates', table => {
      table.increments();
      table.string('identifier').notNullable();
      table.text('formula').notNullable();
    })

    .createTable('growth_rate_prose', table => {
      table
        .integer('growth_rate_id')
        .references('growth_rates.id')
        .notNullable();
      table
        .integer('local_language_id')
        .references('languages.id')
        .notNullable();
      table.string('name');
      table.text('effect');
      table.primary(['growth_rate_id', 'local_language_id']);
    })

    .createTable('experience', table => {
      table
        .integer('growth_rate_id')
        .references('growth_rates.id')
        .notNullable();
      table.integer('level').notNullable();
      table.integer('experience').notNullable();
      table.primary(['growth_rate_id', 'level']);
    })

    .createTable('evolution_chains', table => {
      table.increments();
      table.integer('baby_trigger_item_id').references('items.id');
    })

    .createTable('evolution_triggers', table => {
      table.increments();
      table.string('identifier').notNullable();
    })

    .createTable('evolution_trigger_prose', table => {
      table
        .integer('evolution_trigger_id')
        .references('evolution_triggers.id')
        .notNullable();
      table
        .integer('local_language_id')
        .references('languages.id')
        .notNullable();
      table.string('name');
      table.primary(['evolution_trigger_id', 'local_language_id']);
    })

    .createTable('egg_groups', table => {
      table.increments();
      table.string('identifier').notNullable();
    })

    .createTable('egg_group_prose', table => {
      table
        .integer('egg_group_id')
        .references('egg_groups.id')
        .notNullable();
      table
        .integer('local_language_id')
        .references('languages.id')
        .notNullable();
      table.string('name');
      table.primary(['egg_group_id', 'local_language_id']);
    })

    .createTable('locations', table => {
      table.increments();
      table
        .string('identifier')
        .unique()
        .notNullable();
      table.integer('region_id').references('regions.id');
    })

    .createTable('location_names', table => {
      table
        .integer('location_id')
        .references('locations.id')
        .notNullable();
      table
        .integer('local_language_id')
        .references('languages.id')
        .notNullable();
      table.string('name').notNullable();
      table.string('subtitle');
      table.primary(['location_id', 'local_language_id']);
    })

    .createTable('genders', table => {
      table.increments();
      table.string('identifier');
    })

    .createTable('machines', table => {
      table.integer('machine_number').notNullable();
      table
        .integer('version_group_id')
        .references('version_groups.id')
        .notNullable();
      table
        .integer('item_id')
        .references('items.id')
        .notNullable();
      table
        .integer('move_id')
        .references('moves.id')
        .notNullable();
      table.primary(['machine_number', 'version_group_id']);
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

    .createTable('contest_type_names', table => {
      table
        .integer('contest_type_id')
        .references('contest_types.id')
        .notNullable();
      table
        .integer('local_language_id')
        .references('languages.id')
        .notNullable();
      table.string('name');
      table.text('flavor');
      table.text('color');
      table.primary(['contest_type_id', 'local_language_id']);
    })

    .createTable('contest_effects', table => {
      table.increments();
      table.integer('appeal').notNullable();
      table.integer('jam').notNullable();
    })

    .createTable('contest_effect_prose', table => {
      table
        .integer('contest_effect_id')
        .references('contest_effects.id')
        .notNullable();
      table
        .integer('local_language_id')
        .references('languages.id')
        .notNullable();
      table.text('flavor_text');
      table.text('effect');
      table.primary(['contest_effect_id', 'local_language_id']);
    })

    .createTable('contest_combos', table => {
      table
        .integer('first_move_id')
        .references('moves.id')
        .notNullable();
      table
        .integer('second_move_id')
        .references('moves.id')
        .notNullable();
      table.primary(['first_move_id', 'second_move_id']);
    })

    .createTable('super_contest_effects', table => {
      table.increments();
      table.integer('appeal').notNullable();
    })

    .createTable('super_contest_effect_prose', table => {
      table
        .integer('super_contest_effect_id')
        .references('super_contest_effects.id')
        .notNullable();
      table
        .integer('local_language_id')
        .references('languages.id')
        .notNullable();
      table.text('flavor_text').notNullable();
      table.primary(['super_contest_effect_id', 'local_language_id']);
    })

    .createTable('super_contest_combos', table => {
      table
        .integer('first_move_id')
        .references('moves.id')
        .notNullable();
      table
        .integer('second_move_id')
        .references('moves.id')
        .notNullable();
      table.primary(['first_move_id', 'second_move_id']);
    });
}

async function build() {
  console.log('creating database...');
  await fs.remove(config.connection.filename);
  await fs.ensureFile(config.connection.filename);

  console.log('creating tables...');
  await languages();
  await types();
  await pokedex();
  await pokemon();
  await pokemon_relations();
  await pokemon_species();
  await pokemon_forms();
  await pokemon_misc();
  await moves();
  await abilities();
  await items();
  await generations();
  await regions();
  await verions();
  await stats();
  await natures();
  await contests();
}

module.exports = build;
