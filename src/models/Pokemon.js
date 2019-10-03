const Model = require('./BaseModel');

class Pokemon extends Model {
  static tableName = 'pokemon';

  static get relationMappings() {
    return {
      species: {
        relation: Model.HasOneRelation,
        modelClass: require('./PokemonSpecies'),
        join: {
          from: 'pokemon.species_id',
          to: 'pokemon_species.id',
        },
      },

      types: {
        relation: Model.ManyToManyRelation,
        modelClass: require('./Type'),
        join: {
          from: 'pokemon.id',
          through: {
            from: 'pokemon_types.pokemon_id',
            to: 'pokemon_types.type_id',
            extra: ['slot'],
          },
          to: 'types.id',
        },
      },

      // TODO forms

      baseStats: {
        relation: Model.ManyToManyRelation,
        modelClass: require('./Stat'),
        join: {
          from: 'pokemon.id',
          through: {
            from: 'pokemon_stats.pokemon_id',
            to: 'pokemon_stats.stat_id',
            extra: ['base_stat', 'effort'],
          },
          to: 'stats.id',
        },
      },

      pokemonMoves: {
        relation: Model.HasManyRelation,
        modelClass: require('./PokemonMove'),
        join: {
          from: 'pokemon.id',
          to: 'pokemon_moves.pokemon_id',
        },
      },

      abilities: {
        relation: Model.ManyToManyRelation,
        modelClass: require('./Ability'),
        join: {
          from: 'pokemon.id',
          through: {
            from: 'pokemon_abilities.pokemon_id',
            to: 'pokemon_abilities.ability_id',
            extra: ['is_hidden', 'slot'],
          },
          to: 'abilities.id',
        },
      },
    };
  }

  static get hidden() {
    return ['identifier', 'species_id'];
  }

  static get virtualAttributes() {
    return ['name'];
  }

  get name() {
    return this.identifier;
  }

  static all() {
    return Pokemon.query().eager(
      '[species, baseStats, abilities, types, ' +
        'pokemonMoves.[move, versionGroup, moveMethod]]'
    );
  }
}

module.exports = Pokemon;
