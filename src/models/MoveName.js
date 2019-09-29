const Model = require('./BaseModel');

class MoveName extends Model {
  static tableName = 'move_names';

  static relationMappings = {
    move: {
      relation: Model.BelongsToOneRelation,
      modelClass: require('./Move'),
      join: {
        from: 'move_names.move_id',
        to: 'moves.id',
      },
    },

    language: {
      relation: Model.HasOneRelation,
      modelClass: require('./Language'),
      join: {
        from: 'move_names.local_language_id',
        to: 'languages.id',
      },
    },
  };
}

module.exports = MoveName;
