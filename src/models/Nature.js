const _ = require('lodash');
const Model = require('./BaseModel');

class Nature extends Model {
  static tableName = 'natures';

  static relationMappings = {
    allNames: {
      relation: Model.HasManyRelation,
      modelClass: require('./NatureName'),
      join: {
        from: 'natures.id',
        to: 'nature_names.nature_id',
      },
    },

    decreasedStat: {
      relation: Model.HasOneRelation,
      modelClass: require('./Stat'),
      join: {
        from: 'natures.decreased_stat_id',
        to: 'stats.id',
      },
    },

    increasedStat: {
      relation: Model.HasOneRelation,
      modelClass: require('./Stat'),
      join: {
        from: 'natures.increased_stat_id',
        to: 'stats.id',
      },
    },
  };

  static get hidden() {
    return ['identifier', 'decreased_stat_id', 'increased_stat_id', 'allNames'];
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
    return Nature.query().eager(
      '[allNames.language, decreasedStat, increasedStat]'
    );
  }
}

module.exports = Nature;
