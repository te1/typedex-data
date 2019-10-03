const _ = require('lodash');
const Model = require('./BaseModel');

class Ability extends Model {
  static tableName = 'abilities';

  static relationMappings = {
    allNames: {
      relation: Model.HasManyRelation,
      modelClass: require('./AbilityName'),
      join: {
        from: 'abilities.id',
        to: 'ability_names.ability_id',
      },
    },

    allFlavorTexts: {
      relation: Model.HasManyRelation,
      modelClass: require('./AbilityFlavorText'),
      join: {
        from: 'abilities.id',
        to: 'ability_flavor_text.ability_id',
      },
    },

    languages: {
      relation: Model.ManyToManyRelation,
      modelClass: require('./Language'),
      join: {
        from: 'abilities.id',
        through: {
          from: 'ability_prose.ability_id',
          to: 'ability_prose.local_language_id',
          extra: ['short_effect', 'effect'],
        },
        to: 'languages.id',
      },
    },

    generation: {
      relation: Model.HasOneRelation,
      modelClass: require('./Generation'),
      join: {
        from: 'abilities.generation_id',
        to: 'generations.id',
      },
    },

    pokemon: {
      relation: Model.ManyToManyRelation,
      modelClass: require('./Pokemon'),
      join: {
        from: 'abilities.id',
        through: {
          from: 'pokemon_abilities.ability_id',
          to: 'pokemon_abilities.pokemon_id',
          extra: ['is_hidden', 'slot'],
        },
        to: 'pokemon.id',
      },
    },
  };

  static get hidden() {
    return [
      'identifier',
      'generation_id',
      'allNames',
      'allFlavorTexts',
      'languages',
    ];
  }

  static get virtualAttributes() {
    return ['name', 'caption', 'flavorTexts', 'shortEffect', 'effect'];
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

  get flavorTexts() {
    let items = _.filter(this.allFlavorTexts, {
      language: { identifier: 'en' },
    });

    if (items.length) {
      items = _.orderBy(items, 'versionGroup.order', 'desc');

      return items;
    }
    return undefined;
  }

  get shortEffect() {
    let item = _.find(this.languages, { identifier: 'en' });

    if (item) {
      return item.short_effect;
    }
    return undefined;
  }

  get effect() {
    let item = _.find(this.languages, { identifier: 'en' });

    if (item) {
      return item.effect;
    }
    return undefined;
  }

  static all() {
    return Ability.query().eager(
      '[allNames.language, languages, allFlavorTexts.[versionGroup, language], ' +
        'generation, pokemon]'
    );
  }
}

module.exports = Ability;
