const _ = require('lodash');
const Model = require('./BaseModel');

class Version extends Model {
  static tableName = 'versions';

  static relationMappings = {
    versionGroup: {
      relation: Model.HasOneRelation,
      modelClass: require('./VersionGroup'),
      join: {
        from: 'versions.version_group_id',
        to: 'version_groups.id',
      },
    },

    allNames: {
      relation: Model.HasManyRelation,
      modelClass: require('./VersionName'),
      join: {
        from: 'versions.id',
        to: 'version_names.version_id',
      },
    },
  };

  static get hidden() {
    return ['identifier', 'version_group_id', 'allNames'];
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
    return Version.query().eager('allNames.language');
  }
}

module.exports = Version;
