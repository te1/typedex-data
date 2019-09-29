const { Model } = require('objection');
const visibilityPlugin = require('objection-visibility').default;

class BaseModel extends visibilityPlugin(Model) {}

module.exports = BaseModel;
