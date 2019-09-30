const _ = require('lodash');
const Model = require('./BaseModel');

class PokemonMoveMethod extends Model {
  static tableName = 'pokemon_move_methods';

  static relationMappings = {
    languages: {
      relation: Model.ManyToManyRelation,
      modelClass: require('./Language'),
      join: {
        from: 'pokemon_move_methods.id',
        through: {
          from: 'pokemon_move_method_prose.pokemon_move_method_id',
          to: 'pokemon_move_method_prose.local_language_id',
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
    return PokemonMoveMethod.query().eager('languages');
  }
}

module.exports = PokemonMoveMethod;
