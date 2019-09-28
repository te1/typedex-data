const Knex = require('knex');

const debug = false;

const config = {
  client: 'sqlite3',
  useNullAsDefault: true,
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

module.exports.knex = knex;
module.exports.config = config;
module.exports.debug = debug;
