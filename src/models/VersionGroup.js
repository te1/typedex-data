const Model = require('./BaseModel');

class VersionGroup extends Model {
  static tableName = 'version_groups';

  static relationMappings = {
    generation: {
      relation: Model.HasOneRelation,
      modelClass: require('./Generation'),
      join: {
        from: 'version_groups.generation_id',
        to: 'generations.id',
      },
    },
  };

  static get hidden() {
    return ['identifier', 'generation_id'];
  }

  static get virtualAttributes() {
    return ['name'];
  }

  get name() {
    return this.identifier;
  }
}

module.exports = VersionGroup;
