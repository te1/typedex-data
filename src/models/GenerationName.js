const Model = require('./BaseModel');

class GenerationName extends Model {
  static tableName = 'generation_names';

  static relationMappings = {
    generation: {
      relation: Model.BelongsToOneRelation,
      modelClass: require('./Type'),
      join: {
        from: 'generation_names.generation_id',
        to: 'generations.id',
      },
    },

    language: {
      relation: Model.HasOneRelation,
      modelClass: require('./Language'),
      join: {
        from: 'generation_names.local_language_id',
        to: 'languages.id',
      },
    },
  };
}

module.exports = GenerationName;
