const Model = require('./BaseModel');

class MoveFlavorText extends Model {
  static tableName = 'move_flavor_text';

  static relationMappings = {
    move: {
      relation: Model.BelongsToOneRelation,
      modelClass: require('./Move'),
      join: {
        from: 'move_flavor_text.move_id',
        to: 'moves.id',
      },
    },

    versionGroup: {
      relation: Model.HasOneRelation,
      modelClass: require('./VersionGroup'),
      join: {
        from: 'move_flavor_text.version_group_id',
        to: 'version_groups.id',
      },
    },

    language: {
      relation: Model.HasOneRelation,
      modelClass: require('./Language'),
      join: {
        from: 'move_flavor_text.language_id',
        to: 'languages.id',
      },
    },
  };

  static get hidden() {
    return ['move_id', 'version_group_id', 'language_id', 'language'];
  }
}

module.exports = MoveFlavorText;
