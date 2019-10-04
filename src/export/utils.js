const fs = require('fs-extra');

const config = {
  prettyPrintJson: true,
  removeIds: true,
  removeRegions: true,
  shortenGenerationInfo: true,
  keepDamageFactorOne: false,
  onlyLatestFlavorText: true,
  simpleStats: true,
  simplePokemonMoves: true,
  targetVersionGroup: 'ultra-sun-ultra-moon',
};

async function exportData(file, data) {
  let spaces = config.prettyPrintJson ? 2 : 0;

  return await fs.outputJson(file, data, { spaces });
}

const ignoredTypeNames = ['shadow', 'unknown'];

const ignoredVersionGroupNames = ['colosseum', 'xd'];

const ignoredMoveMethodNames = [
  'stadium-surfing-pikachu',
  'colosseum-purification',
  'xd-shadow',
  'xd-purification',
];

module.exports.config = config;
module.exports.exportData = exportData;
module.exports.ignoredTypeNames = ignoredTypeNames;
module.exports.ignoredVersionGroupNames = ignoredVersionGroupNames;
module.exports.ignoredMoveMethodNames = ignoredMoveMethodNames;
