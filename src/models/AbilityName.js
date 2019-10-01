const Model = require('./BaseModel');

class AbilityName extends Model {
  static tableName = 'ability_names';

  static relationMappings = {
    type: {
      relation: Model.BelongsToOneRelation,
      modelClass: require('./Ability'),
      join: {
        from: 'ability_names.ability_id',
        to: 'abilities.id',
      },
    },

    language: {
      relation: Model.HasOneRelation,
      modelClass: require('./Language'),
      join: {
        from: 'ability_names.local_language_id',
        to: 'languages.id',
      },
    },
  };
}

module.exports = AbilityName;
