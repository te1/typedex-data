# typedex-data

Generates JSON files from [Veekun](https://github.com/veekun/pokedex) CSV files for use in [typedex](https://github.com/te1/typedex), a Pokemon type calculator.


## Setup

```
npm install
```

- Installs dependencies


## Import

```
npm run import
```

- Creates tables in a SQLite database using [knex](https://github.com/tgriesser/knex)
- Parses CSV files using [csv-parse](https://github.com/adaltas/node-csv-parse)
- Data is taken directly from [veekun/pokedex](https://github.com/veekun/pokedex/tree/master/pokedex/data/csv)
- Inserts data into database (again using knex)
- Resulting database is created in the root directory as `pokedex.sqlite`
- If you already have a Veekun SQLite database you can use it and skip the import
- Veekun is included as a Git submodule so can be updated accordingly
- Note that not all files from Veekun will be imported (e.g. no Pokemon Conquest data)
- This is basically a very bare-bones version of [veekun/pokedex/db](https://github.com/veekun/pokedex/blob/master/pokedex/db/tables.py)
- Why bother with all this? So you don't need to setup Veekun's dependencies to get the data


## Export

```npm run export```

- Uses [Objection.js](https://github.com/Vincit/objection.js) to query the database
- Uses [lodash](https://github.com/lodash/lodash) to transform the data
- Exports a lot of JSON files (see [typedex](https://github.com/te1/typedex/tree/master/public/data) for examples)
- There are index files suitable for lists and autocompletion for Pokemon, moves and abilities
- There is also a dedicated file for every single Pokemon, move and ability that contains enough information to power a simple Pokedex
- Note that not all tables and not every bit of data is exported
- The primary purpose is to provide data for [typedex](https://github.com/te1/typedex) not to be as complete as possible
- There is no documentation for the data schema but hopefully it's pretty self-explanatory
- When in doubt refer to [veekun/pokedex/db](https://github.com/veekun/pokedex/blob/master/pokedex/db/tables.py)


## Misc
- Since this is using knex and Objection.js you should be able to use any other supported database instead of SQLite
- Knex configuration can be found in [src/knex.js](https://github.com/te1/typedex-data/blob/master/src/knex.js)


## Disclaimer

Pokémon © 2002-2019 Pokémon. © 1995-2019 Nintendo/Creatures Inc./GAME FREAK inc. Pokémon and Pokémon character names are trademarks of Nintendo. No copyright or trademark infringement is intended in using Pokémon data.
