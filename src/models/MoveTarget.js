const _ = require('lodash');
const Model = require('./BaseModel');

class MoveTarget extends Model {
  static tableName = 'move_targets';

  static relationMappings = {
    languages: {
      relation: Model.ManyToManyRelation,
      modelClass: require('./Language'),
      join: {
        from: 'move_targets.id',
        through: {
          from: 'move_target_prose.move_target_id',
          to: 'move_target_prose.local_language_id',
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
    return undefined;
  }

  get description() {
    let item = _.find(this.languages, { identifier: 'en' });

    if (item) {
      return item.description;
    }
    return undefined;
  }
}

module.exports = MoveTarget;
