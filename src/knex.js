const Knex = require('knex');
const { Model } = require('objection');

const debug = false;

const config = {
  client: 'sqlite3',
  useNullAsDefault: false,
  asyncStackTraces: debug,
  connection: {
    filename: './pokedex.db',
  },
  pool: {
    afterCreate: (conn, cb) => {
      conn.run('PRAGMA foreign_keys = ON', cb);
    },
  },
};

const knex = Knex(config);

Model.knex(knex);

module.exports.knex = knex;
module.exports.config = config;
module.exports.debug = debug;
