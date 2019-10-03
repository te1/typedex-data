const path = require('path');
const _ = require('lodash');
const { exportData } = require('./utils');
const Ability = require('../models/Ability');

function getEffect(ability) {
  // TODO handle markdown syntax

  let result = {
    short: ability.shortEffect,
    full: ability.effect,
  };

  // filter out texts that start with XXX as they are placeholders
  if (_.startsWith(result.short, 'XXX')) {
    delete result.short;
  }
  if (_.startsWith(result.full, 'XXX')) {
    delete result.full;
  }

  return result;
}

async function exportAll(target) {
  console.log('loading abilities...');
  let abilities = await Ability.all();

  console.log(`processing ${abilities.length} abilities...`);

  // skip non main series abilities
  abilities = _.filter(abilities, ability => ability.is_main_series);

  let effect, pokemon;

  abilities = _.map(abilities, ability => {
    effect = getEffect(ability);

    pokemon = _.map(ability.pokemon, item => {
      return {
        pokemon: item.name,
        hidden: !!item.is_hidden,
        slot: item.slot,
      };
    });
    pokemon = _.keyBy(pokemon, 'pokemon');
    pokemon = _.mapValues(pokemon, item => _.omit(item, 'pokemon'));

    return {
      id: ability.id,
      name: ability.name,
      caption: ability.caption,
      gen: ability.generation.name,
      effect,
      pokemon,
    };
  });

  abilities = _.orderBy(abilities, 'name');

  let index = _.map(abilities, ability => {
    return _.pick(ability, ['id', 'name', 'caption', 'gen']);
  });

  console.log(`writing ${index.length} abilities...`);

  await exportData(path.join(target, 'abilities.json'), index);

  console.log(`writing ${abilities.length} ability details...`);

  for (const ability of abilities) {
    await exportData(
      path.join(target, 'ability', ability.name + '.json'),
      ability
    );
  }

  console.log('done\n');
}

module.exports = exportAll;
