const _ = require('lodash');
const Model = require('./BaseModel');

class PokemonSpecies extends Model {
  static tableName = 'pokemon_species';

  static relationMappings = {
    allNames: {
      relation: Model.HasManyRelation,
      modelClass: require('./PokemonSpeciesName'),
      join: {
        from: 'pokemon_species.id',
        to: 'pokemon_species_names.pokemon_species_id',
      },
    },

    languages: {
      relation: Model.ManyToManyRelation,
      modelClass: require('./Language'),
      join: {
        from: 'pokemon_species.id',
        through: {
          from: 'pokemon_species_prose.pokemon_species_id',
          to: 'pokemon_species_prose.local_language_id',
          extra: ['form_description'],
        },
        to: 'languages.id',
      },
    },

    allFlavorTexts: {
      relation: Model.HasManyRelation,
      modelClass: require('./PokemonSpeciesFlavorText'),
      join: {
        from: 'pokemon_species.id',
        to: 'pokemon_species_flavor_text.species_id',
      },
    },

    generation: {
      relation: Model.HasOneRelation,
      modelClass: require('./Generation'),
      join: {
        from: 'pokemon_species.generation_id',
        to: 'generations.id',
      },
    },

    color: {
      relation: Model.HasOneRelation,
      modelClass: require('./PokemonColor'),
      join: {
        from: 'pokemon_species.color_id',
        to: 'pokemon_colors.id',
      },
    },

    evolvesFromSpecies: {
      relation: Model.HasOneRelation,
      modelClass: PokemonSpecies,
      join: {
        from: 'pokemon_species.evolves_from_species_id',
        to: 'pokemon_species.id',
      },
    },

    evolutionChain: {
      relation: Model.HasOneRelation,
      modelClass: require('./EvolutionChain'),
      join: {
        from: 'pokemon_species.evolution_chain_id',
        to: 'evolution_chains.id',
      },
    },

    evolutionDetails: {
      relation: Model.HasManyRelation,
      modelClass: require('./PokemonEvolution'),
      join: {
        from: 'pokemon_species.id',
        to: 'pokemon_evolution.evolved_species_id',
      },
    },

    // unused: shapes, habitats, growth_rates, egg_groups
  };

  static get hidden() {
    return [
      'identifier',
      'generation_id',
      'color_id',
      'evolves_from_species_id',
      'evolution_chain_id',
      'conquest_order',
      'allNames',
      'languages',
      'allFlavorTexts',
    ];
  }

  static get virtualAttributes() {
    return ['name', 'caption', 'formDescription', 'flavorTexts'];
  }

  get name() {
    return this.identifier;
  }

  get caption() {
    let item = _.find(this.allNames, { language: { identifier: 'en' } });

    if (item) {
      return item.name;
    }
    return undefined;
  }

  get formDescription() {
    let item = _.find(this.languages, { identifier: 'en' });

    if (item) {
      return item.form_description;
    }
    return undefined;
  }

  get flavorTexts() {
    let items = _.filter(this.allFlavorTexts, {
      language: { identifier: 'en' },
    });

    if (items.length) {
      items = _.orderBy(items, 'version.versionGroup.order', 'desc');

      return items;
    }
    return undefined;
  }

  static all() {
    return PokemonSpecies.query().eager(
      '[allNames.language, languages, allFlavorTexts.[version.versionGroup, language]]'
    );
  }
}

module.exports = PokemonSpecies;
