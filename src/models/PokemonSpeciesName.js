const Model = require('./BaseModel');

class PokemonSpeciesName extends Model {
  static tableName = 'pokemon_species_names';

  static relationMappings = {
    species: {
      relation: Model.BelongsToOneRelation,
      modelClass: require('./PokemonSpecies'),
      join: {
        from: 'pokemon_species_names.pokemon_species_id',
        to: 'pokemon_species.id',
      },
    },

    language: {
      relation: Model.HasOneRelation,
      modelClass: require('./Language'),
      join: {
        from: 'pokemon_species_names.local_language_id',
        to: 'languages.id',
      },
    },
  };
}

module.exports = PokemonSpeciesName;
