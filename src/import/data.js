const fs = require('fs');
const path = require('path');
const parse = require('csv-parse/lib/sync');
const { knex, debug } = require('../knex');

const source = './veekun-pokedex/pokedex/data/csv/';

// order is significant, foreign key dependencies go first
const tables = [
  'languages',
  // 'language_names',
  'regions',
  // 'region_names',
  'generations',
  // 'generation_names',
  'version_groups',
  'version_group_regions',
  'versions',
  // 'version_names',
  'contest_types',
  'contest_effects',
  'super_contest_effects',
  'move_targets',
  // 'move_target_prose',
  'move_effects',
  // 'move_effect_prose',
  'move_damage_classes',
  // 'move_damage_class_prose',
  'stats',
  // 'stat_names',
  'natures',
  // 'nature_names',
  'types',
  // 'type_names',
  'type_efficacy',
  'moves',
  // 'move_names',
  // 'move_flavor_text',
  'move_flags',
  'move_flag_map',
  // 'move_flag_prose',
  'move_meta_ailments',
  'move_meta_categories',
  // 'move_meta_category_prose',
  'move_meta_stat_changes',
  'move_meta',
  'abilities',
  // 'ability_names',
  // 'ability_flavor_text',
  'item_pockets',
  // 'item_pocket_names',
  'item_categories',
  // 'item_category_prose',
  'item_fling_effects',
  // 'item_fling_effect_prose',
  'items',
  // 'item_prose',
  // 'item_flavor_text',
  'pokedexes',
  // 'pokedex_prose',
  'pokedex_version_groups',
  'growth_rates',
  // 'growth_rate_prose',
  'evolution_chains',
  'evolution_triggers',
  'evolution_trigger_prose',
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
  'pokemon',
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
        // throw new Error(`table ${table} missing`);
      }
      console.log(`skipping ${table}...`);
      console.log('');

      continue;
    }

    console.log(`loading ${table}...`);
    csv = fs.readFileSync(path.join(source, table + '.csv'));
    records = parse(csv, options);

    console.log(`inserting ${records.length} rows...`);
    await insert(table, records);

    console.log('');
  }
}

module.exports = fill;
