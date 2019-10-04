const _ = require('lodash');
const Model = require('./BaseModel');

class PokemonEvolution extends Model {
  static tableName = 'pokemon_evolution';

  static get relationMappings() {
    return {
      species: {
        relation: Model.HasOneRelation,
        modelClass: require('./PokemonSpecies'),
        join: {
          from: 'pokemon_evolution.evolved_species_id',
          to: 'pokemon_species.id',
        },
      },

      trigger: {
        relation: Model.HasOneRelation,
        modelClass: require('./EvolutionTrigger'),
        join: {
          from: 'pokemon_evolution.evolution_trigger_id',
          to: 'evolution_triggers.id',
        },
      },

      // TODO relations
    };
  }

  static get hidden() {
    return ['evolved_species_id', 'evolution_trigger_id'];
  }

  // static get virtualAttributes() {
  //   return ['chain'];
  // }
}

module.exports = PokemonEvolution;
