const path = require('path');
const _ = require('lodash');
const { exportData, ignoredVersionGroupNames } = require('./utils');
const Pokedex = require('../models/Pokedex');

async function exportAll(target) {
  console.log('loading pokedex...');
  let pokedex = await Pokedex.all();

  console.log(`processing ${pokedex.length} pokedex...`);

  // skip non main series pokedex
  pokedex = _.filter(pokedex, dex => dex.is_main_series);

  let region, versionGroups, species;

  pokedex = _.map(pokedex, dex => {
    region = dex.region ? dex.region.name : null;

    versionGroups = _.reject(dex.versionGroups, item =>
      _.includes(ignoredVersionGroupNames, item.name)
    );
    versionGroups = _.orderBy(versionGroups, 'order');
    versionGroups = _.map(versionGroups, 'name');

    species = _.orderBy(dex.species, 'pokedex_number');
    species = _.map(species, spec => {
      return {
        number: spec.pokedex_number,
        name: spec.name,
      };
    });

    return {
      id: dex.id,
      name: dex.name,
      caption: dex.caption,
      description: dex.description,
      region,
      versionGroups,
      species,
    };
  });

  pokedex = _.orderBy(pokedex, 'id');

  let index = _.map(pokedex, dex => {
    return _.pick(dex, [
      'id',
      'name',
      'caption',
      'description',
      'region',
      'versionGroups',
    ]);
  });

  console.log(`writing ${index.length} pokedex...`);

  await exportData(path.join(target, 'pokedex.json'), index);

  console.log(`writing ${pokedex.length} pokedex details...`);

  for (const dex of pokedex) {
    await exportData(path.join(target, 'pokedex', dex.name + '.json'), dex);
  }

  console.log('done\n');
}

module.exports = exportAll;
