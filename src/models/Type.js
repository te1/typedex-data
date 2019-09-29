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
    let name = _.find(this.names, { language: { identifier: 'en' } });

    if (name) {
      return name.name;
    }
  }
}

module.exports = Type;
