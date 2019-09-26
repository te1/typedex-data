const fs = require('fs-extra');
const Knex = require('knex');
const knexConfig = require('../knexfile');

function createTables(knex) {
  return knex.schema.createTable('test', function(table) {
    table.increments();
    table.string('name');
  });
}

async function init() {
  await fs.remove(knexConfig.connection.filename);
  await fs.ensureFile(knexConfig.connection.filename);

  const knex = Knex(knexConfig);

  await createTables(knex);

  return knex;
}

module.exports = init;
