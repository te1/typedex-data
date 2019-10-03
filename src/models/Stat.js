const _ = require('lodash');
const Model = require('./BaseModel');

class Stat extends Model {
  static tableName = 'stats';

  static relationMappings = {
    allNames: {
      relation: Model.HasManyRelation,
      modelClass: require('./StatName'),
      join: {
        from: 'stats.id',
        to: 'stat_names.stat_id',
      },
    },

    damageClass: {
      relation: Model.HasOneRelation,
      modelClass: require('./MoveDamageClass'),
      join: {
        from: 'stats.damage_class_id',
        to: 'move_damage_classes.id',
      },
    },
  };

  static get hidden() {
    return ['identifier', 'damage_class_id', 'allNames'];
  }

  static get virtualAttributes() {
    return ['name', 'caption'];
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

  static all() {
    return Stat.query().eager('[allNames.language, damageClass]');
  }
}

module.exports = Stat;
