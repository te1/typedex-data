const _ = require('lodash');
const Model = require('./BaseModel');

class PokemonColor extends Model {
  static tableName = 'pokemon_colors';

  static relationMappings = {
    allNames: {
      relation: Model.HasManyRelation,
      modelClass: require('./PokemonColorName'),
      join: {
        from: 'pokemon_colors.id',
        to: 'pokemon_color_names.pokemon_color_id',
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
}

module.exports = PokemonColor;
