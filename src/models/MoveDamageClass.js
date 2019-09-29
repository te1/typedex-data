const _ = require('lodash');
const Model = require('./BaseModel');

class MoveDamageClass extends Model {
  static tableName = 'move_damage_classes';

  static relationMappings = {
    languages: {
      relation: Model.ManyToManyRelation,
      modelClass: require('./Language'),
      join: {
        from: 'move_damage_classes.id',
        through: {
          from: 'move_damage_class_prose.move_damage_class_id',
          to: 'move_damage_class_prose.local_language_id',
          extra: ['name', 'description'],
        },
        to: 'languages.id',
      },
    },
  };

  static get hidden() {
    return ['identifier', 'languages'];
  }

  static get virtualAttributes() {
    return ['name', 'caption', 'description'];
  }

  get name() {
    return this.identifier;
  }

  get caption() {
    let item = _.find(this.languages, { identifier: 'en' });

    if (item) {
      return item.name;
    }
  }

  get description() {
    let item = _.find(this.languages, { identifier: 'en' });

    if (item) {
      return item.description;
    }
  }

  static all() {
    return MoveDamageClass.query().eager('languages');
  }
}

module.exports = MoveDamageClass;
