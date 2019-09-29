const fs = require('fs-extra');
const { knex } = require('../knex');
const exportTypes = require('./types');
const exportMoves = require('./moves');

const target = './out/';

async function main() {
  try {
    await fs.emptyDir(target);

    await exportTypes(target);
    await exportMoves(target);
  } catch (err) {
    console.error(err);
  }

  if (knex) {
    knex.destroy();
  }
}

main();
