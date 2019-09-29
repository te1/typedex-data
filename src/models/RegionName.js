const Model = require('./BaseModel');

class RegionName extends Model {
  static tableName = 'region_names';

  static relationMappings = {
    region: {
      relation: Model.BelongsToOneRelation,
      modelClass: require('./Region'),
      join: {
        from: 'region_names.region_id',
        to: 'region.id',
      },
    },

    language: {
      relation: Model.HasOneRelation,
      modelClass: require('./Language'),
      join: {
        from: 'region_names.local_language_id',
        to: 'languages.id',
      },
    },
  };
}

module.exports = RegionName;
