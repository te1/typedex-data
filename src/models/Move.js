const _ = require('lodash');
const Model = require('./BaseModel');

class Move extends Model {
  static tableName = 'moves';

  static relationMappings = {
    allNames: {
      relation: Model.HasManyRelation,
      modelClass: require('./MoveName'),
      join: {
        from: 'moves.id',
        to: 'move_names.move_id',
      },
    },

    allFlavorTexts: {
      relation: Model.HasManyRelation,
      modelClass: require('./MoveFlavorText'),
      join: {
        from: 'moves.id',
        to: 'move_flavor_text.move_id',
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

    target: {
      relation: Model.HasOneRelation,
      modelClass: require('./MoveTarget'),
      join: {
        from: 'moves.target_id',
        to: 'move_targets.id',
      },
    },

    effect: {
      relation: Model.HasOneRelation,
      modelClass: require('./MoveEffect'),
      join: {
        from: 'moves.effect_id',
        to: 'move_effects.id',
      },
    },

    flags: {
      relation: Model.ManyToManyRelation,
      modelClass: require('./MoveFlag'),
      join: {
        from: 'moves.id',
        through: {
          from: 'move_flag_map.move_id',
          to: 'move_flag_map.move_flag_id',
        },
        to: 'move_flags.id',
      },
    },
  };

  static get hidden() {
    return [
      'identifier',
      'type_id',
      'damage_class_id',
      'generation_id',
      'target_id',
      'effect_id',
      'contest_type_id',
      'contest_effect_id',
      'super_contest_effect_id',
      'allNames',
      'allFlavorTexts',
    ];
  }

  static get virtualAttributes() {
    return ['name', 'caption', 'flavorTexts'];
  }

  get name() {
    return this.identifier;
  }

  get caption() {
    let item = _.find(this.allNames, { language: { identifier: 'en' } });

    if (item) {
      return item.name;
    }
    return undefined;
  }

  get flavorTexts() {
    let items = _.filter(this.allFlavorTexts, {
      language: { identifier: 'en' },
    });

    if (items.length) {
      items = _.orderBy(items, 'versionGroup.order', 'desc');

      return items;
    }
    return undefined;
  }

  static all() {
    return Move.query().eager(
      '[allNames.language, allFlavorTexts.[versionGroup, language], type, damageClass, generation, target, effect.languages, flags]'
    );
  }
}

module.exports = Move;
