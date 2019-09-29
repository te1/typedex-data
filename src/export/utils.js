const fs = require('fs-extra');

const spaces = 2;

async function exportData(file, data) {
  return await fs.outputJson(file, data, { spaces });
}

module.exports.exportData = exportData;
