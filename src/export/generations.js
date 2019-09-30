const path = require('path');
const _ = require('lodash');
const {
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

  return versionGroups;
}

async function exportGenerations() {
  console.log('loading generations...');
  let generations = await Generation.all();

  console.log(`processing ${generations.length} generations...`);

  let versionGroups;

  generations = _.map(generations, generation => {
    versionGroups = _.reject(generation.versionGroups, item =>
      _.includes(ignoredVersionGroupNames, item.name)
    );
    versionGroups = _.orderBy(versionGroups, 'order');
    versionGroups = _.map(versionGroups, 'name');

    return {
      id: generation.id,
      name: generation.name,
      caption: generation.caption,
      caption2: generation.caption.replace(/Generation/, 'Gen'),
      caption3: generation.caption.replace(/Generation /, ''),
      versionGroups,
      mainRegion: generation.mainRegion.name,
    };
  });

  generations = _.orderBy(generations, 'name');

  return generations;
}

async function exportAll(target) {
  let generations = await exportGenerations();
  let versionGroups = await exportVersionGroups();
  let versions = await exportVersions();
  let regions = await exportRegions();

  let data = {
    generations,
    versionGroups,
    versions,
    regions,
  };

  console.log(
    `writing ${generations.length} generations, ${versionGroups.length} version groups, ${versions.length} versions, ${regions.length} regions...`
  );

  await exportData(path.join(target, 'generations.json'), data);

  console.log('done\n');
}

module.exports = exportAll;
