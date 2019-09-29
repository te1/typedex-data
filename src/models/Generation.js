const _ = require('lodash');
const Model = require('./BaseModel');

class Generation extends Model {
  static tableName = 'generations';

  static relationMappings = {
    names: {
      relation: Model.HasManyRelation,
      modelClass: require('./GenerationName'),
      join: {
        from: 'generations.id',
        to: 'generation_names.generation_id',
      },
    },
  };

  static get hidden() {
    return ['identifier', 'names'];
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
    return Generation.query().eager('names.language');
  }
}

module.exports = Generation;
