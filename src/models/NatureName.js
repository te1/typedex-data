const Model = require('./BaseModel');

class NatureName extends Model {
  static tableName = 'nature_names';

  static relationMappings = {
    nature: {
      relation: Model.BelongsToOneRelation,
      modelClass: require('./Nature'),
      join: {
        from: 'nature_names.nature_id',
        to: 'natures.id',
      },
    },

    language: {
      relation: Model.HasOneRelation,
      modelClass: require('./Language'),
      join: {
        from: 'nature_names.local_language_id',
        to: 'languages.id',
      },
    },
  };
}

module.exports = NatureName;
