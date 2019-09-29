const Model = require('./BaseModel');

class VersionName extends Model {
  static tableName = 'version_names';

  static relationMappings = {
    version: {
      relation: Model.BelongsToOneRelation,
      modelClass: require('./Version'),
      join: {
        from: 'version_names.version_id',
        to: 'versions.id',
      },
    },

    language: {
      relation: Model.HasOneRelation,
      modelClass: require('./Language'),
      join: {
        from: 'version_names.local_language_id',
        to: 'languages.id',
      },
    },
  };
}

module.exports = VersionName;
