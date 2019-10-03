const Model = require('./BaseModel');

class AbilityFlavorText extends Model {
  static tableName = 'ability_flavor_text';

  static relationMappings = {
    move: {
      relation: Model.BelongsToOneRelation,
      modelClass: require('./Ability'),
      join: {
        from: 'ability_flavor_text.ability_id',
        to: 'abilities.id',
      },
    },

    versionGroup: {
      relation: Model.HasOneRelation,
      modelClass: require('./VersionGroup'),
      join: {
        from: 'ability_flavor_text.version_group_id',
        to: 'version_groups.id',
      },
    },

    language: {
      relation: Model.HasOneRelation,
      modelClass: require('./Language'),
      join: {
        from: 'ability_flavor_text.language_id',
        to: 'languages.id',
      },
    },
  };

  static get hidden() {
    return ['ability_id', 'version_group_id', 'language_id', 'language'];
  }
}

module.exports = AbilityFlavorText;
