const Model = require('./BaseModel');

class PokemonColorName extends Model {
  static tableName = 'pokemon_color_names';

  static relationMappings = {
    color: {
      relation: Model.BelongsToOneRelation,
      modelClass: require('./PokemonColor'),
      join: {
        from: 'pokemon_color_names.pokemon_color_id',
        to: 'pokemon_colors.id',
      },
    },

    language: {
      relation: Model.HasOneRelation,
      modelClass: require('./Language'),
      join: {
        from: 'pokemon_color_names.local_language_id',
        to: 'languages.id',
      },
    },
  };
}

module.exports = PokemonColorName;
