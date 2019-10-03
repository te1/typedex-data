const path = require('path');
const _ = require('lodash');
const {
  exportData,
  ignoredMoveMethodNames,
  ignoredVersionGroupNames,
} = require('./utils');
const Stat = require('../models/Stat');
const Pokemon = require('../models/Pokemon');
const PokemonMoveMethod = require('../models/PokemonMoveMethod');

async function exportStats() {
  console.log('loading stats...');
  let stats = await Stat.all();

  console.log(`processing ${stats.length} stats...`);

  let damageCategory;

  stats = _.map(stats, stat => {
    damageCategory = stat.damageClass ? stat.damageClass.name : null;

    return {
      id: stat.id,
      name: stat.name,
      caption: stat.caption,
      damageCategory,
      battleOnly: !!stat.is_battle_only,
    };
  });

  stats = _.orderBy(stats, 'id');

  return stats;
}

async function exportMoveMethods() {
  console.log('loading move methods...');
  let moveMethods = await PokemonMoveMethod.all();

  console.log(`processing ${moveMethods.length} move methods...`);

  moveMethods = _.reject(moveMethods, item =>
    _.includes(ignoredMoveMethodNames, item.name)
  );

  moveMethods = _.map(moveMethods, moveMethod => {
    return {
      id: moveMethod.id,
      name: moveMethod.name,
      caption: moveMethod.caption,
      description: moveMethod.description, // TODO handle markdown syntax
    };
  });

  moveMethods = _.orderBy(moveMethods, 'id');

  return moveMethods;
}

function getMoves(pkmn) {
  let result = _.map(pkmn.pokemonMoves, item => {
    return {
      move: item.move.name,
      versionGroup: item.versionGroup.name,
      method: item.moveMethod.name,
      level: item.level,
    };
  });
  result = _.reject(result, item =>
    ignoredMoveMethodNames.includes(item.method)
  );
  result = _.reject(result, item =>
    ignoredVersionGroupNames.includes(item.versionGroup)
  );
  result = _.groupBy(result, 'move');
  result = _.mapValues(result, group =>
    _.map(group, item => _.omit(item, 'move'))
  );

  return result;
}

function getAbilities(pkmn) {
  let result = _.filter(pkmn.abilities, item => item.is_main_series);
  result = _.map(result, item => {
    return {
      ability: item.name,
      hidden: !!item.is_hidden,
      slot: item.slot,
    };
  });
  result = _.keyBy(result, 'ability');
  result = _.mapValues(result, item => _.omit(item, 'ability'));

  return result;
}

async function exportPokemon() {
  console.log('loading pokemon...');
  let pokemon = await Pokemon.all();

  // console.log(pokemon[0].types);

  console.log(`processing ${pokemon.length} pokemon...`);

  let caption, height, weight, baseStats, types, moves, abilities;

  pokemon = _.map(pokemon, pkmn => {
    caption = ''; // TODO

    height = pkmn.height / 10; // convert to m
    weight = pkmn.weight / 10; // convert to kg

    baseStats = _.keyBy(pkmn.baseStats, 'name');
    baseStats = _.mapValues(baseStats, 'base_stat');

    types = _.orderBy(pkmn.types, 'slot');
    types = _.map(types, 'name');

    moves = getMoves(pkmn);
    abilities = getAbilities(pkmn);

    return {
      id: pkmn.id,
      name: pkmn.name,
      caption,
      order: pkmn.order,
      species: pkmn.species.name,
      default: !!pkmn.is_default,
      types,
      height,
      weight,
      baseStats,
      moves,
      abilities,
    };
  });

  pokemon = _.orderBy(pokemon, 'order');

  let result;

  let index = _.map(pokemon, pkmn => {
    result = _.pick(pkmn, [
      'id',
      'name',
      'caption',
      'order',
      'species',
      'default',
      'types',
    ]);

    // drop undefined, null and false values
    result = _.pickBy(result, value => value != null && value !== false);

    return result;
  });

  return {
    index,
    details: pokemon,
  };
}

async function exportAll(target) {
  let pokemon = await exportPokemon();
  let moveMethods = await exportMoveMethods();
  let stats = await exportStats();

  let data = {
    pokemon: pokemon.index,
    moveMethods,
    stats,
  };

  console.log(
    `writing ${pokemon.index.length} pokemon, ${moveMethods.length} move methods, ${stats.length} stats...`
  );

  await exportData(path.join(target, 'pokemon.json'), data);

  console.log(`writing ${pokemon.details.length} pokemon details...`);

  for (const pkmn of pokemon.details) {
    await exportData(path.join(target, 'pokemon', pkmn.name + '.json'), pkmn);
  }

  console.log('done\n');
}

module.exports = exportAll;
