const _ = require('lodash');
const Model = require('./BaseModel');

class Type extends Model {
  static tableName = 'types';

  static relationMappings = {
    allNames: {
      relation: Model.HasManyRelation,
      modelClass: require('./TypeName'),
      join: {
        from: 'types.id',
        to: 'type_names.type_id',
      },
    },
  };

  static get hidden() {
    return ['identifier', 'generation_id', 'damage_class_id', 'allNames'];
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
    return Type.query().eager('allNames.language');
  }
}

module.exports = Type;
