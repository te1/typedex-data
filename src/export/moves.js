const path = require('path');
const _ = require('lodash');
const {
  exportData,
  ignoredVersionGroupNames,
  ignoredMoveMethodNames,
} = require('./utils');
const Move = require('../models/Move');
const MoveFlag = require('../models/MoveFlag');
const MoveTarget = require('../models/MoveTarget');

async function exportTargets() {
  console.log('loading targets...');
  let targets = await MoveTarget.all();

  console.log(`processing ${targets.length} targets...`);

  targets = _.map(targets, target => {
    return {
      id: target.id,
      name: target.name,
      caption: target.caption,
      description: target.description, // TODO handle markdown syntax
    };
  });

  targets = _.orderBy(targets, 'id');

  return targets;
}

async function exportFlags() {
  console.log('loading flags...');
  let flags = await MoveFlag.all();

  console.log(`processing ${flags.length} flags...`);

  flags = _.map(flags, flag => {
    return {
      id: flag.id,
      name: flag.name,
      caption: flag.caption,
      description: flag.description, // TODO handle markdown syntax
    };
  });

  flags = _.orderBy(flags, 'id');

  return flags;
}

function getEffect(move) {
  // TODO handle markdown syntax

  let result = {
    short: move.effect.shortEffect,
    full: move.effect.effect,
  };

  // filter out texts that start with XXX as they are placeholders
  if (_.startsWith(result.short, 'XXX')) {
    delete result.short;
  }
  if (_.startsWith(result.full, 'XXX')) {
    delete result.full;
  }

  if (move.effect_chance != null) {
    if (result.short) {
      result.short = result.short.replace(
        /\$effect_chance/g,
        move.effect_chance
      );
    }
    if (result.full) {
      result.full = result.full.replace(/\$effect_chance/g, move.effect_chance);
    }
  }

  return result;
}

async function exportMoves() {
  console.log('loading moves...');
  let moves = await Move.all();

  console.log(`processing ${moves.length} moves...`);

  // skip Shadow moves
  moves = _.reject(moves, move => move.type.name === 'shadow');

  let isZMove, effect, flavorTexts, flags, pokemon;

  moves = _.map(moves, move => {
    isZMove = move.pp === 1;

    effect = getEffect(move);

    flavorTexts = _.map(move.flavorTexts, item => {
      return {
        text: item.flavor_text,
        versionGroup: item.versionGroup.name,
      };
    });

    flags = _.map(move.flags, 'name');

    pokemon = _.map(move.pokemonMoves, item => {
      return {
        pokemon: item.pokemon.name,
        versionGroup: item.versionGroup.name,
        method: item.moveMethod.name,
        level: item.level,
      };
    });
    pokemon = _.reject(pokemon, item =>
      ignoredMoveMethodNames.includes(item.method)
    );
    pokemon = _.reject(pokemon, item =>
      ignoredVersionGroupNames.includes(item.versionGroup)
    );
    pokemon = _.groupBy(pokemon, 'pokemon');
    pokemon = _.mapValues(pokemon, group =>
      _.map(group, item => _.omit(item, 'pokemon'))
    );

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
      pokemon,
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
      'gen',
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
  let moves = await exportMoves();
  let flags = await exportFlags();
  let targets = await exportTargets();

  let data = {
    moves: moves.index,
    flags,
    targets,
  };

  console.log(
    `writing ${moves.index.length} moves, ${flags.length} flags, ${targets.length} targets...`
  );

  await exportData(path.join(target, 'moves.json'), data);

  console.log(`writing ${moves.details.length} move details...`);

  for (const move of moves.details) {
    await exportData(path.join(target, 'move', move.name + '.json'), move);
  }

  console.log('done\n');
}

module.exports = exportAll;
