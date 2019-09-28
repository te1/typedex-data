const fs = require('fs');
const path = require('path');
const parse = require('csv-parse/lib/sync');
const { knex, debug } = require('../knex');

const source = './veekun-pokedex/pokedex/data/csv/';

// order is significant, foreign key dependencies go first
const tables = [
  'languages',
  'language_names',
  'regions',
  'region_names',
  'generations',
  'generation_names',
  'version_groups',
  'version_group_regions',
  'versions',
  'version_names',
  'contest_types',
  'contest_type_names',
  'contest_effects',
  'contest_effect_prose',
  'super_contest_effects',
  'super_contest_effect_prose',
  'move_targets',
  'move_target_prose',
  'move_effects',
  'move_effect_prose',
  'move_damage_classes',
  'move_damage_class_prose',
  'stats',
  'stat_names',
  'natures',
  'nature_names',
  'types',
  'type_names',
  'type_efficacy',
  'moves',
  'move_names',
  'move_flavor_text',
  'move_flags',
  'move_flag_map',
  'move_flag_prose',
  'move_meta_ailments',
  'move_meta_ailment_names',
  'move_meta_categories',
  'move_meta_category_prose',
  'move_meta_stat_changes',
  'move_meta',
  'contest_combos',
  'super_contest_combos',
  'abilities',
  'ability_names',
  'ability_prose',
  'ability_flavor_text',
  'item_pockets',
  'item_pocket_names',
  'item_categories',
  'item_category_prose',
  'item_fling_effects',
  'item_fling_effect_prose',
  'items',
  'item_names',
  'item_prose',
  'item_flavor_text',
  'item_flags',
  'item_flag_prose',
  'item_flag_map',
  'pokedexes',
  'pokedex_prose',
  'pokedex_version_groups',
  'growth_rates',
  'growth_rate_prose',
  'experience',
  'evolution_chains',
  'evolution_triggers',
  'evolution_trigger_prose',
  'egg_groups',
  'egg_group_prose',
  'locations',
  'location_names',
  'genders',
  'machines',
  'pokemon_habitats',
  'pokemon_habitat_names',
  'pokemon_shapes',
  'pokemon_shape_prose',
  'pokemon_colors',
  'pokemon_color_names',
  'pokemon_species',
  'pokemon_species_names',
  'pokemon_species_prose',
  'pokemon_species_flavor_text',
  'pokemon_dex_numbers',
  'pokemon',
  'pokemon_forms',
  'pokemon_form_names',
  'pokemon_form_generations',
  'pokemon_stats',
  'pokemon_types',
  'pokemon_items',
  'pokemon_abilities',
  'pokemon_egg_groups',
  'pokemon_evolution',
  'pokemon_move_methods',
  'pokemon_move_method_prose',
  'version_group_pokemon_move_methods',
  'pokemon_moves',
];

// list of columns that self reference with foreign keys
const selfRefs = {
  pokemon_species: ['evolves_from_species_id'],
};

// csv parser options
const options = {
  columns: true,

  cast(value) {
    if (value === '') {
      return null;
    }
    return value;
  },
};

function split(table, records) {
  // in tables where columns self reference with foreign keys
  // some rows may need special handling

  const selfRefColumns = selfRefs[table];
  if (!selfRefColumns || !selfRefColumns.length) {
    // no self referencing, just handle normally

    return [records];
  }

  let normal = [];
  let defer = [];

  let normalIds = [];
  let foreignIds, foreignId, shouldDefer;

  for (const record of records) {
    foreignIds = [];

    // collect all self referencing foreign ids
    for (const column of selfRefColumns) {
      if (record[column] != null) {
        foreignIds.push(record[column]);
      }
    }

    shouldDefer = false;

    for (foreignId of foreignIds) {
      if (!normalIds.includes(foreignId)) {
        // if this row references an id we haven't handled yet
        // it needs to be inserted later to avoid foreign key errors

        shouldDefer = true;
        break;
      }
    }

    if (shouldDefer) {
      defer.push(record);
    } else {
      normal.push(record);
      normalIds.push(record.id);
    }
  }

  return [normal, defer];
}

async function insert(table, allRecords) {
  let recordList = split(table, allRecords);
  let records, record, chunkSize;

  for (records of recordList) {
    if (debug) {
      // debug: shows query when there is an error, also a lot slower

      for (record of records) {
        await knex(table)
          .insert(record)
          .on('query-error', (error, obj) => {
            console.log(error, obj);
          });
      }
    } else if (records.length) {
      // batch insert is faster than individual inserts

      // by default SQLite only allows 999 "variables" (values in value lists)
      // chunkSize needs to take this limitation into account
      // to prevent a "Too many SQL variables" error
      chunkSize = Math.floor(999 / Object.keys(records[0]).length);

      await knex.batchInsert(table, records, chunkSize);
    }
  }
}

async function fill() {
  let csv, records;

  for (const table of tables) {
    if (!(await knex.schema.hasTable(table))) {
      if (!debug) {
        throw new Error(`table ${table} missing`);
      }
      console.log(`skipping ${table}...`);

      continue;
    }

    process.stdout.write(`loading ${table}`);
    csv = fs.readFileSync(path.join(source, table + '.csv'));
    records = parse(csv, options);

    process.stdout.write(`, inserting ${records.length} rows...\n`);
    await insert(table, records);
  }
}

module.exports = fill;
