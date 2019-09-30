const path = require('path');
const _ = require('lodash');
const { exportData, ignoredMoveMethodNames } = require('./utils');
const Move = require('../models/Move');
const PokemonMoveMethod = require('../models/PokemonMoveMethod');

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

async function exportPokemon() {
  // TODO

  console.log('loading moves...');
  let moves = await Move.all();

  console.log(`processing ${moves.length} moves...`);

  // skip Shadow moves
  moves = _.reject(moves, move => move.type.name === 'shadow');

  let isZMove, effect, flavorTexts, flags;

  moves = _.map(moves, move => {
    isZMove = move.pp === 1;

    // TODO handle markdown syntax
    effect = {
      short: move.effect.shortEffect,
      full: move.effect.effect,
    };

    if (move.effect_chance != null) {
      effect.short = effect.short.replace(
        /\$effect_chance/g,
        move.effect_chance
      );
      effect.full = effect.full.replace(/\$effect_chance/g, move.effect_chance);
    }

    flavorTexts = _.map(move.flavorTexts, item => {
      return {
        text: item.flavor_text,
        versionGroup: item.versionGroup.name,
      };
    });

    flags = _.map(move.flags, 'name');

    return {
      id: move.id,
      name: move.name,
      caption: move.caption,
      type: move.type.name,
      damageCategory: move.damageClass.name,
      power: move.power,
      accuracy: move.accuracy,
      pp: move.pp,
      z: isZMove,
      priority: move.priority,
      gen: move.generation.name,
      effect,
      flavorTexts,
      flags,
      target: move.target.name,
    };
  });

  moves = _.orderBy(moves, 'name');

  let result;

  let index = _.map(moves, move => {
    result = _.pick(move, [
      'id',
      'name',
      'caption',
      'type',
      'damageCategory',
      'power',
      'accuracy',
      'pp',
      'z',
    ]);

    // drop undefined, null and false values
    result = _.pickBy(result, value => value != null && value !== false);

    return result;
  });

  return {
    index,
    details: moves,
  };
}

async function exportAll(target) {
  let pokemon = await exportPokemon();
  let moveMethods = await exportMoveMethods();

  let data = {
    pokemon: pokemon.index,
    moveMethods,
  };

  console.log(
    `writing ${pokemon.index.length} pokemon, ${moveMethods.length} move methods...`
  );

  await exportData(path.join(target, 'pokemon.json'), data);

  console.log(`writing ${pokemon.details.length} pokemon details...`);

  for (const pkmn of pokemon.details) {
    await exportData(path.join(target, 'pokemon', pkmn.name + '.json'), pkmn);
  }

  console.log('done\n');
}

module.exports = exportAll;
