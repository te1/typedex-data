const _ = require('lodash');
const Model = require('./BaseModel');

class EvolutionTrigger extends Model {
  static tableName = 'evolution_triggers';

  static relationMappings = {
    languages: {
      relation: Model.ManyToManyRelation,
      modelClass: require('./Language'),
      join: {
        from: 'evolution_triggers.id',
        through: {
          from: 'evolution_trigger_prose.evolution_trigger_id',
          to: 'evolution_trigger_prose.local_language_id',
          extra: ['name'],
        },
        to: 'languages.id',
      },
    },
  };

  static get hidden() {
    return ['identifier', 'languages'];
  }

  static get virtualAttributes() {
    return ['name', 'caption'];
  }

  get name() {
    return this.identifier;
  }

  get caption() {
    let item = _.find(this.languages, { identifier: 'en' });

    if (item) {
      return item.name;
    }
    return undefined;
  }

  static all() {
    return EvolutionTrigger.query().eager('languages');
  }
}

module.exports = EvolutionTrigger;
