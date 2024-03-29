const path = require('path');
const _ = require('lodash');
const { config, exportData } = require('./utils');
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

function getPokemon(ability) {
  let result = _.map(ability.pokemon, item => {
    return {
      pokemon: item.name,
      hidden: !!item.is_hidden,
      slot: item.slot,
    };
  });
  result = _.keyBy(result, 'pokemon');
  result = _.mapValues(result, item => _.omit(item, 'pokemon'));

  // compactify
  result = _.mapValues(result, item => (item.hidden ? 'hidden' : item.slot));

  return result;
}

function getFlavorText(ability) {
  if (config.onlyLatestFlavorText) {
    return ability.flavorText.flavor_text;
  }
  return _.map(ability.flavorTexts, item => {
    return {
      text: item.flavor_text,
      versionGroup: item.versionGroup.name,
    };
  });
}

async function exportAll(target) {
  console.log('loading abilities...');
  let abilities = await Ability.all();

  console.log(`processing ${abilities.length} abilities...`);

  // skip non main series abilities
  abilities = _.filter(abilities, ability => ability.is_main_series);

  let effect, flavorText, pokemon;

  abilities = _.map(abilities, ability => {
    effect = getEffect(ability);
    flavorText = getFlavorText(ability);
    pokemon = getPokemon(ability);

    return {
      id: ability.id,
      name: ability.name,
      caption: ability.caption,
      gen: ability.generation.name,
      effect,
      flavorText,
      pokemon,
    };
  });

  abilities = _.orderBy(abilities, 'name');

  if (config.removeIds) {
    abilities = _.map(abilities, item => _.omit(item, 'id'));
  }

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
