const _ = require('lodash');
const Model = require('./BaseModel');

class Move extends Model {
  static tableName = 'moves';

  static relationMappings = {
    names: {
      relation: Model.HasManyRelation,
      modelClass: require('./MoveName'),
      join: {
        from: 'moves.id',
        to: 'move_names.move_id',
      },
    },

    type: {
      relation: Model.HasOneRelation,
      modelClass: require('./Type'),
      join: {
        from: 'moves.type_id',
        to: 'types.id',
      },
    },

    damageClass: {
      relation: Model.HasOneRelation,
      modelClass: require('./MoveDamageClass'),
      join: {
        from: 'moves.damage_class_id',
        to: 'move_damage_classes.id',
      },
    },

    generation: {
      relation: Model.HasOneRelation,
      modelClass: require('./Generation'),
      join: {
        from: 'moves.generation_id',
        to: 'generations.id',
      },
    },
  };

  static get hidden() {
    return [
      'identifier',
      'type_id',
      'damage_class_id',
      'generation_id',
      'contest_type_id',
      'contest_effect_id',
      'super_contest_effect_id',
      'names',
    ];
  }

  static get virtualAttributes() {
    return ['name', 'caption'];
  }

  get name() {
    return this.identifier;
  }

  get caption() {
    let item = _.find(this.names, { language: { identifier: 'en' } });

    if (item) {
      return item.name;
    }
  }

  static all() {
    return Move.query().eager(
      '[names.language, type, damageClass, generation]'
    );
  }
}

module.exports = Move;
