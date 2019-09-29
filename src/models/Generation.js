const _ = require('lodash');
const Model = require('./BaseModel');

class Generation extends Model {
  static tableName = 'generations';

  static relationMappings = {
    allNames: {
      relation: Model.HasManyRelation,
      modelClass: require('./GenerationName'),
      join: {
        from: 'generations.id',
        to: 'generation_names.generation_id',
      },
    },
  };

  static get hidden() {
    return ['identifier', 'allNames'];
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
    return Generation.query().eager('allNames.language');
  }
}

module.exports = Generation;
