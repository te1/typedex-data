module.exports = {
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
