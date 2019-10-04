const _ = require('lodash');
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

      forms: {
        relation: Model.HasManyRelation,
        modelClass: require('./PokemonForm'),
        join: {
          from: 'pokemon.id',
          to: 'pokemon_forms.pokemon_id',
        },
      },

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
    return ['identifier', 'caption', 'species_id'];
  }

  static get virtualAttributes() {
    return ['name', 'caption', 'moves'];
  }

  get name() {
    return this.identifier;
  }

  get caption() {
    if (this.species && _.some(this.forms, form => !form.is_default)) {
      return this.species.caption;
    }
    if (this.defaultForm && this.defaultForm.pokemonCaption) {
      return this.defaultForm.pokemonCaption;
    }
    if (this.species) {
      return this.species.caption;
    }
    return undefined;
  }

  get defaultForm() {
    return _.find(this.forms, form => form.is_default);
  }

  get moves() {
    let result = _.groupBy(this.pokemonMoves, 'move.name');
    result = _.mapValues(result, group =>
      _.orderBy(group, 'versionGroup.order', 'desc')
    );

    return result;
  }

  static async all() {
    return Pokemon.query()
      .eagerAlgorithm(Model.NaiveEagerAlgorithm) // work around SQLITE_MAX_VARIABLE_NUMBER
      .eager(
        '[species.[allNames.language, languages, allFlavorTexts.[version.versionGroup, language], ' +
          'generation, color, evolutionChain.[species.[evolvesFromSpecies, evolutionDetails.trigger]]], ' +
          'baseStats, abilities, types, forms.allNames.language, ' +
          'pokemonMoves.[move, versionGroup, moveMethod]]'
      );
  }
}

module.exports = Pokemon;
