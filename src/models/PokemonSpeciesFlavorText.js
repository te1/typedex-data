const Model = require('./BaseModel');

class PokemonSpeciesFlavorText extends Model {
  static tableName = 'pokemon_species_flavor_text';

  static relationMappings = {
    species: {
      relation: Model.BelongsToOneRelation,
      modelClass: require('./PokemonSpecies'),
      join: {
        from: 'pokemon_species_flavor_text.species_id',
        to: 'pokemon_species.id',
      },
    },

    version: {
      relation: Model.HasOneRelation,
      modelClass: require('./Version'),
      join: {
        from: 'pokemon_species_flavor_text.version_id',
        to: 'versions.id',
      },
    },

    language: {
      relation: Model.HasOneRelation,
      modelClass: require('./Language'),
      join: {
        from: 'pokemon_species_flavor_text.language_id',
        to: 'languages.id',
      },
    },
  };

  static get hidden() {
    return ['species_id', 'version_id', 'language_id', 'language'];
  }
}

module.exports = PokemonSpeciesFlavorText;
