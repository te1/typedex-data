const _ = require('lodash');
const Model = require('./BaseModel');

class Type extends Model {
  static tableName = 'types';

  static relationMappings = {
    names: {
      relation: Model.HasManyRelation,
      modelClass: require('./TypeName'),
      join: {
        from: 'types.id',
        to: 'type_names.type_id',
      },
    },
  };

  static get hidden() {
    return ['generation_id', 'damage_class_id', 'names'];
  }

  static get virtualAttributes() {
    return ['name'];
  }

  name() {
    let item = _.find(this.names, { language: { identifier: 'en' } });

    if (item) {
      return item.name;
    }
  }

  static all() {
    return Type.query().eager('names.language');
  }
}

module.exports = Type;
