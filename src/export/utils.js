const fs = require('fs-extra');

const spaces = 2;

async function exportData(file, data) {
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

module.exports.exportData = exportData;
module.exports.ignoredTypeNames = ignoredTypeNames;
module.exports.ignoredVersionGroupNames = ignoredVersionGroupNames;
module.exports.ignoredMoveMethodNames = ignoredMoveMethodNames;
