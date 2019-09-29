const _ = require('lodash');
const Model = require('./BaseModel');

class Region extends Model {
  static tableName = 'regions';

  static relationMappings = {
    allNames: {
      relation: Model.HasManyRelation,
      modelClass: require('./RegionName'),
      join: {
        from: 'regions.id',
        to: 'region_names.region_id',
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

  static all() {
    return Region.query().eager('allNames.language');
  }
}

module.exports = Region;
