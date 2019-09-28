const Knex = require('knex');

const config = {
  client: 'sqlite3',
  useNullAsDefault: true,
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
