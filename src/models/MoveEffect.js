const _ = require('lodash');
const Model = require('./BaseModel');

class MoveEffect extends Model {
  static tableName = 'move_effects';

  static relationMappings = {
    languages: {
      relation: Model.ManyToManyRelation,
      modelClass: require('./Language'),
      join: {
        from: 'move_effects.id',
        through: {
          from: 'move_effect_prose.move_effect_id',
          to: 'move_effect_prose.local_language_id',
          extra: ['short_effect', 'effect'],
        },
        to: 'languages.id',
      },
    },
  };

  static get hidden() {
    return ['languages'];
  }

  static get virtualAttributes() {
    return ['shortEffect', 'effect'];
  }

  get shortEffect() {
    let item = _.find(this.languages, { identifier: 'en' });

    if (item) {
      return item.short_effect;
    }
    return undefined;
  }

  get effect() {
    let item = _.find(this.languages, { identifier: 'en' });

    if (item) {
      return item.effect;
    }
    return undefined;
  }
}

module.exports = MoveEffect;
