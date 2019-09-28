const { knex } = require('../knex');
const build = require('./schema');
const fill = require('./data');

async function main() {
  try {
    await build();

    await fill();

    console.log('done');
  } catch (err) {
    console.error(err);
  }

  if (knex) {
    knex.destroy();
  }
}

main();
