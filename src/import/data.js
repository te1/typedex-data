const fs = require('fs');
const path = require('path');
const parse = require('csv-parse/lib/sync');
const { knex } = require('../knex');

const source = './veekun-pokedex/pokedex/data/csv/';
const tables = [
  'languages',
  'language_names',
  'regions',
  'region_names',
  'generations',
  'generation_names',
  'move_damage_classes',
  'types',
  'type_names',
  'type_efficacy',
];
const options = {
  columns: true,
  cast(value) {
    if (value === '') {
      return null;
    }
    return value;
  },
};

async function fill() {
  let csv, records;

  for (const table of tables) {
    console.log(`loading ${table}...`);
    csv = fs.readFileSync(path.join(source, table + '.csv'));
    records = parse(csv, options);

    console.log(`inserting ${records.length} rows...`);
    await knex.batchInsert(table, records);

    // debug: shows query when there is an error
    // for (const record of records) {
    //   await knex(table)
    //     .insert(record)
    //     .on('query-error', (error, obj) => {
    //       console.log(error, obj);
    //     });
    // }

    console.log('');
  }
}

module.exports = fill;
