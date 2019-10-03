const _ = require('lodash');
const Model = require('./BaseModel');

class Pokemon extends Model {
  static tableName = 'pokemon';

  static relationMappings = {
    // TODO relations
  };

  static get hidden() {
    return ['identifier'];
  }

  static get virtualAttributes() {
    return ['name'];
  }

  get name() {
    return this.identifier;
  }

  static all() {
    return Pokemon.query();
  }
}

module.exports = Pokemon;
