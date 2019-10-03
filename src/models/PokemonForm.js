const _ = require('lodash');
const Model = require('./BaseModel');

class PokemonForm extends Model {
  static tableName = 'pokemon_forms';

  static relationMappings = {
    allNames: {
      relation: Model.HasManyRelation,
      modelClass: require('./PokemonFormName'),
      join: {
        from: 'pokemon_forms.id',
        to: 'pokemon_form_names.pokemon_form_id',
      },
    },

    pokemon: {
      relation: Model.HasOneRelation,
      modelClass: require('./Pokemon'),
      join: {
        from: 'pokemon_forms.id',
        to: 'pokemon.id',
      },
    },

    introducedInVersionGroup: {
      relation: Model.HasOneRelation,
      modelClass: require('./VersionGroup'),
      join: {
        from: 'pokemon_forms.introduced_in_version_group_id',
        to: 'version_groups.id',
      },
    },

    generations: {
      relation: Model.ManyToManyRelation,
      modelClass: require('./Generation'),
      join: {
        from: 'pokemon_forms.id',
        through: {
          from: 'pokemon_form_generations.pokemon_form_id',
          to: 'pokemon_form_generations.generation_id',
        },
        to: 'generations.id',
      },
    },
  };

  static get hidden() {
    return [
      'identifier',
      'form_identifier',
      'pokemon_id',
      'introduced_in_version_group_id',
      'allNames',
    ];
  }

  static get virtualAttributes() {
    return ['name', 'formName', 'caption', 'pokemonCaption', 'formCaption'];
  }

  get name() {
    return this.identifier;
  }

  get formName() {
    return this.form_identifier;
  }

  get caption() {
    if (this.pokemonCaption) {
      return this.pokemonCaption;
    }
    if (this.pokemon && this.pokemon.species) {
      return this.pokemon.species.caption;
    }
    return undefined;
  }

  get pokemonCaption() {
    let item = _.find(this.allNames, { language: { identifier: 'en' } });

    if (item) {
      return item.pokemon_name;
    }
    return undefined;
  }

  get formCaption() {
    let item = _.find(this.allNames, { language: { identifier: 'en' } });

    if (item) {
      return item.form_name;
    }
    return undefined;
  }
}

module.exports = PokemonForm;
