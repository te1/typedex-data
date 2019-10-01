const _ = require('lodash');
const Model = require('./BaseModel');

class Pokedex extends Model {
  static tableName = 'pokedexes';

  static relationMappings = {
    languages: {
      relation: Model.ManyToManyRelation,
      modelClass: require('./Language'),
      join: {
        from: 'pokedexes.id',
        through: {
          from: 'pokedex_prose.pokedex_id',
          to: 'pokedex_prose.local_language_id',
          extra: ['name', 'description'],
        },
        to: 'languages.id',
      },
    },

    region: {
      relation: Model.HasOneRelation,
      modelClass: require('./Region'),
      join: {
        from: 'pokedexes.region_id',
        to: 'regions.id',
      },
    },

    versionGroups: {
      relation: Model.ManyToManyRelation,
      modelClass: require('./VersionGroup'),
      join: {
        from: 'pokedexes.id',
        through: {
          from: 'pokedex_version_groups.pokedex_id',
          to: 'pokedex_version_groups.version_group_id',
        },
        to: 'version_groups.id',
      },
    },

    species: {
      relation: Model.ManyToManyRelation,
      modelClass: require('./PokemonSpecies'),
      join: {
        from: 'pokedexes.id',
        through: {
          from: 'pokemon_dex_numbers.pokedex_id',
          to: 'pokemon_dex_numbers.species_id',
          extra: ['pokedex_number'],
        },
        to: 'pokemon_species.id',
      },
    },
  };

  static get hidden() {
    return ['identifier', 'region_id', 'languages'];
  }

  static get virtualAttributes() {
    return ['name', 'caption', 'description'];
  }

  get name() {
    return this.identifier;
  }

  get caption() {
    let item = _.find(this.languages, { identifier: 'en' });

    if (item) {
      return item.name;
    }
    return undefined;
  }

  get description() {
    let item = _.find(this.languages, { identifier: 'en' });

    if (item) {
      return item.description;
    }
    return undefined;
  }

  static all() {
    return Pokedex.query().eager('[languages, region, versionGroups, species]');
  }
}

module.exports = Pokedex;
