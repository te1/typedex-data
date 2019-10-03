const Model = require('./BaseModel');

class PokemonFormName extends Model {
  static tableName = 'pokemon_form_names';

  static relationMappings = {
    form: {
      relation: Model.BelongsToOneRelation,
      modelClass: require('./PokemonForm'),
      join: {
        from: 'pokemon_form_names.pokemon_form_id',
        to: 'pokemon_forms.id',
      },
    },

    language: {
      relation: Model.HasOneRelation,
      modelClass: require('./Language'),
      join: {
        from: 'pokemon_form_names.local_language_id',
        to: 'languages.id',
      },
    },
  };
}

module.exports = PokemonFormName;
