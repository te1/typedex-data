const path = require('path');
const _ = require('lodash');
const roman = require('romans');
const {
  config,
  exportData,
  ignoredVersionGroupNames,
  ignoredMoveMethodNames,
} = require('./utils');
const Generation = require('../models/Generation');
const VersionGroup = require('../models/VersionGroup');
const Version = require('../models/Version');
const Region = require('../models/Region');

async function exportRegions() {
  console.log('loading regions...');
  let regions = await Region.all();

  console.log(`processing ${regions.length} regions...`);

  regions = _.map(regions, region => {
    return {
      id: region.id,
      name: region.name,
      caption: region.caption,
    };
  });

  regions = _.orderBy(regions, 'id');

  if (config.removeIds) {
    regions = _.map(regions, item => _.omit(item, 'id'));
  }

  return regions;
}

async function exportVersions() {
  console.log('loading versions...');
  let versions = await Version.all();

  console.log(`processing ${versions.length} versions...`);

  versions = _.map(versions, version => {
    return {
      id: version.id,
      name: version.name,
      caption: version.caption,
    };
  });

  versions = _.orderBy(versions, 'id');

  if (config.removeIds) {
    versions = _.map(versions, item => _.omit(item, 'id'));
  }

  return versions;
}

async function exportVersionGroups() {
  console.log('loading version groups...');
  let versionGroups = await VersionGroup.all();

  console.log(`processing ${versionGroups.length} version groups...`);

  versionGroups = _.reject(versionGroups, item =>
    _.includes(ignoredVersionGroupNames, item.name)
  );

  let versions, regions, moveMethods;

  versionGroups = _.map(versionGroups, versionGroup => {
    versions = _.orderBy(versionGroup.versions, 'id');
    versions = _.map(versions, 'name');

    regions = _.orderBy(versionGroup.regions, 'id');
    regions = _.map(regions, 'name');

    moveMethods = _.reject(versionGroup.moveMethods, item =>
      _.includes(ignoredMoveMethodNames, item.name)
    );
    moveMethods = _.orderBy(moveMethods, 'id');
    moveMethods = _.map(moveMethods, 'name');

    return {
      id: versionGroup.id,
      name: versionGroup.name,
      versions,
      regions,
      moveMethods,
    };
  });

  versionGroups = _.orderBy(versionGroups, 'order');

  if (config.removeIds) {
    versionGroups = _.map(versionGroups, item => _.omit(item, 'id'));
  }

  if (config.removeRegions) {
    versionGroups = _.map(versionGroups, item => _.omit(item, 'regions'));
  }

  return versionGroups;
}

async function exportGenerations() {
  console.log('loading generations...');
  let generations = await Generation.all();

  console.log(`processing ${generations.length} generations...`);

  let versionGroups, numRoman, num;

  generations = _.map(generations, generation => {
    versionGroups = _.reject(generation.versionGroups, item =>
      _.includes(ignoredVersionGroupNames, item.name)
    );
    versionGroups = _.orderBy(versionGroups, 'order');
    versionGroups = _.map(versionGroups, 'name');

    numRoman = generation.caption.split(' ')[1];
    num = roman.deromanize(numRoman);

    return {
      id: generation.id,
      name: generation.name,
      caption: generation.caption,
      numRoman,
      num,
      versionGroups,
      mainRegion: generation.mainRegion.name,
    };
  });

  generations = _.orderBy(generations, 'name');

  if (config.removeIds) {
    generations = _.map(generations, item => _.omit(item, 'id'));
  }

  if (config.removeRegions) {
    generations = _.map(generations, item => _.omit(item, 'mainRegion'));
  }

  if (config.shortenGenerationInfo) {
    generations = _.map(generations, item =>
      _.omit(item, ['caption', 'numRoman'])
    );
  }

  return generations;
}

async function exportAll(target) {
  let generations = await exportGenerations();
  let versionGroups = await exportVersionGroups();
  let versions = await exportVersions();
  let regions = [];

  let data = {
    generations,
    versionGroups,
    versions,
  };

  if (!config.removeRegions) {
    regions = await exportRegions();

    data.regions = regions;
  }

  console.log(
    `writing ${generations.length} generations, ${versionGroups.length} version groups, ` +
      `${versions.length} versions, ${regions.length} regions...`
  );

  await exportData(path.join(target, 'generations.json'), data);

  console.log('done\n');
}

module.exports = exportAll;
