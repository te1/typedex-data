const Model = require('./BaseModel');

class TypeName extends Model {
  static tableName = 'type_names';

  static relationMappings = {
    type: {
      relation: Model.BelongsToOneRelation,
      modelClass: require('./Type'),
      join: {
        from: 'type_names.type_id',
        to: 'types.id',
      },
    },

    language: {
      relation: Model.HasOneRelation,
      modelClass: require('./Language'),
      join: {
        from: 'type_names.local_language_id',
        to: 'languages.id',
      },
    },
  };
}

module.exports = TypeName;
