const path = require('path');
const _ = require('lodash');
const utils = require('./utils');
const Move = require('../models/Move');

async function exportMoves(target) {
  console.log('loading moves...');

  let moves = await Move.all();

  console.log(`processing ${moves.length} moves...`);

  console.log(moves[0].toJSON());

  // skip Shadow moves
  moves = _.reject(moves, move => move.type.name === 'shadow');

  // let isZMove;

  moves = _.map(moves, move => {
    // effect = _.find(move.effect_entries, { language: { name: 'en' } });
    // if (effect != null) {
    //   effect = {
    //     short: effect.short_effect,
    //     full: effect.effect.replace(/\$effect_chance/g, move.effect_chance),
    //   };
    // }

    // flavorTexts = _.filter(move.flavor_text_entries, {
    //   language: { name: 'en' },
    // });
    // flavorTexts = _.map(flavorTexts, item => {
    //   return {
    //     text: item.flavor_text,
    //     versionGroup: item.version_group.name,
    //   };
    // });

    // isZMove = move.pp === 1;

    return {
      id: move.id,
      name: move.name,
      caption: move.caption,
      type: move.type.name,
      damageCategory: move.damageClass.name,
      power: move.power,
      accuracy: move.accuracy,
      pp: move.pp,
      // z: isZMove,
      priority: move.priority,
      gen: move.generation.name,
      // effect,
      // flavorTexts,
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

  console.log(`writing ${moves.length} moves...`);

  await utils.exportData(path.join(target, 'moves/index.json'), index);

  _.forEach(moves, async move => {
    await utils.exportData(
      path.join(target, 'moves', move.name + '.json'),
      move
    );
  });

  console.log('done\n');
}

module.exports = exportMoves;
