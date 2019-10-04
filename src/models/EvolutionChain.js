const _ = require('lodash');
const Model = require('./BaseModel');

class EvolutionChain extends Model {
  static tableName = 'evolution_chains';

  static get relationMappings() {
    return {
      species: {
        relation: Model.HasManyRelation,
        modelClass: require('./PokemonSpecies'),
        join: {
          from: 'evolution_chains.id',
          to: 'pokemon_species.evolution_chain_id',
        },
      },
    };
  }

  static get hidden() {
    return ['species'];
  }

  static get virtualAttributes() {
    return ['chain'];
  }

  get firstSpecies() {
    return _.find(this.species, item => item.evolvesFromSpecies == null);
  }

  get chain() {
    let result = this.link(this.firstSpecies)[0];

    // skip empty evolution chains
    if (!result.evolvesTo.length) {
      return undefined;
    }
    return result;
  }

  link(species) {
    if (!species) {
      return [];
    }
    if (!_.isArray(species)) {
      species = [species];
    }
    if (!species.length) {
      return [];
    }

    return _.map(species, spec => {
      return {
        species: spec.name,
        // evolutionDetails: spec.evolutionDetails,
        triggers: _.map(spec.evolutionDetails, item => item.trigger.name),
        evolvesTo: this.link(this.nextSpecies(spec)),
      };
    });
  }

  nextSpecies(species) {
    return _.filter(
      this.species,
      item =>
        item.evolvesFromSpecies && item.evolvesFromSpecies.name === species.name
    );
  }

  static all() {
    return EvolutionChain.query().eager(
      '[species.[evolvesFromSpecies, evolutionDetails.trigger]]'
    );
  }
}

module.exports = EvolutionChain;
