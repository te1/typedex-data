const fs = require('fs-extra');
const { knex } = require('../knex');
const exportGenerations = require('./generations');
const exportTypes = require('./types');
const exportMoves = require('./moves');
const exportAbilities = require('./abilities');
const exportPokedex = require('./pokedex');
const exportPokemon = require('./pokemon');

const target = './out/';

async function main() {
  try {
    await fs.emptyDir(target);

    await exportGenerations(target);
    await exportTypes(target);
    await exportMoves(target);
    await exportAbilities(target);
    await exportPokedex(target);
    await exportPokemon(target);
  } catch (err) {
    console.error(err);
  }

  if (knex) {
    knex.destroy();
  }
}

main();
