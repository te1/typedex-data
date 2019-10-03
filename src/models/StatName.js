const Model = require('./BaseModel');

class StatName extends Model {
  static tableName = 'stat_names';

  static relationMappings = {
    type: {
      relation: Model.BelongsToOneRelation,
      modelClass: require('./Stat'),
      join: {
        from: 'stat_names.stat_id',
        to: 'stats.id',
      },
    },

    language: {
      relation: Model.HasOneRelation,
      modelClass: require('./Language'),
      join: {
        from: 'stat_names.local_language_id',
        to: 'languages.id',
      },
    },
  };
}

module.exports = StatName;
