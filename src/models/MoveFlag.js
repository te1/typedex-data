const _ = require('lodash');
const Model = require('./BaseModel');

class MoveFlag extends Model {
  static tableName = 'move_flags';

  static relationMappings = {
    languages: {
      relation: Model.ManyToManyRelation,
      modelClass: require('./Language'),
      join: {
        from: 'move_flags.id',
        through: {
          from: 'move_flag_prose.move_flag_id',
          to: 'move_flag_prose.local_language_id',
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

  static all() {
    return MoveFlag.query().eager('languages');
  }
}

module.exports = MoveFlag;
