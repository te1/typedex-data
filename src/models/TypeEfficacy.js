const Model = require('./BaseModel');

class TypeEfficacy extends Model {
  static tableName = 'type_efficacy';

  static relationMappings = {
    damageType: {
      relation: Model.HasOneRelation,
      modelClass: require('./Type'),
      join: {
        from: 'type_efficacy.damage_type_id',
        to: 'types.id',
      },
    },

    targetType: {
      relation: Model.HasOneRelation,
      modelClass: require('./Type'),
      join: {
        from: 'type_efficacy.target_type_id',
        to: 'types.id',
      },
    },
  };

  static get hidden() {
    return ['damage_type_id', 'target_type_id'];
  }

  static all() {
    return TypeEfficacy.query().eager(
      '[damageType.names.language, targetType.names.language]'
    );
  }
}

module.exports = TypeEfficacy;
