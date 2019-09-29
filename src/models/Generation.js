const _ = require('lodash');
const Model = require('./BaseModel');

class Generation extends Model {
  static tableName = 'generations';

  static relationMappings = {
    mainRegion: {
      relation: Model.HasOneRelation,
      modelClass: require('./Region'),
      join: {
        from: 'generations.main_region_id',
        to: 'regions.id',
      },
    },

    allNames: {
      relation: Model.HasManyRelation,
      modelClass: require('./GenerationName'),
      join: {
        from: 'generations.id',
        to: 'generation_names.generation_id',
      },
    },

    versionGroups: {
      relation: Model.HasManyRelation,
      modelClass: require('./VersionGroup'),
      join: {
        from: 'generations.id',
        to: 'version_groups.generation_id',
      },
    },
  };

  static get hidden() {
    return ['identifier', 'main_region_id', 'allNames'];
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
    return Generation.query().eager(
      '[allNames.language, mainRegion, versionGroups]'
    );
  }
}

module.exports = Generation;
