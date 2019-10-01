const path = require('path');
const _ = require('lodash');
const { exportData } = require('./utils');
const Ability = require('../models/Ability');

async function exportAll(target) {
  console.log('loading abilities...');
  let abilities = await Ability.all();

  console.log(`processing ${abilities.length} abilities...`);

  // skip non main series abilities
  abilities = _.filter(abilities, ability => ability.is_main_series);

  let effect;

  abilities = _.map(abilities, ability => {
    // TODO handle markdown syntax
    effect = {
      short: ability.shortEffect,
      full: ability.effect,
    };

    return {
      id: ability.id,
      name: ability.name,
      caption: ability.caption,
      effect,
    };
  });

  abilities = _.orderBy(abilities, 'name');

  let index = _.map(abilities, ability => {
    return _.pick(ability, ['id', 'name', 'caption']);
  });

  console.log(`writing ${index.length} abilities...`);

  await exportData(path.join(target, 'abilities.json'), index);

  console.log(`writing ${abilities.length} ability details...`);

  for (const ability of abilities) {
    await exportData(
      path.join(target, 'abilities', ability.name + '.json'),
      ability
    );
  }

  console.log('done\n');
}

module.exports = exportAll;
