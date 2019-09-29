const Model = require('./BaseModel');

class VersionGroup extends Model {
  static tableName = 'version_groups';

  static relationMappings = {
    generation: {
      relation: Model.HasOneRelation,
      modelClass: require('./Generation'),
      join: {
        from: 'version_groups.generation_id',
        to: 'generations.id',
      },
    },

    regions: {
      relation: Model.ManyToManyRelation,
      modelClass: require('./Region'),
      join: {
        from: 'version_groups.id',
        through: {
          from: 'version_group_regions.version_group_id',
          to: 'version_group_regions.region_id',
        },
        to: 'regions.id',
      },
    },

    moveMethods: {
      relation: Model.ManyToManyRelation,
      modelClass: require('./PokemonMoveMethod'),
      join: {
        from: 'version_groups.id',
        through: {
          from: 'version_group_pokemon_move_methods.version_group_id',
          to: 'version_group_pokemon_move_methods.pokemon_move_method_id',
        },
        to: 'pokemon_move_methods.id',
      },
    },

    versions: {
      relation: Model.HasManyRelation,
      modelClass: require('./Version'),
      join: {
        from: 'version_groups.id',
        to: 'versions.version_group_id',
      },
    },
  };

  static get hidden() {
    return ['identifier', 'generation_id'];
  }

  static get virtualAttributes() {
    return ['name'];
  }

  get name() {
    return this.identifier;
  }

  static all() {
    return VersionGroup.query().eager('[regions, moveMethods, versions]');
  }
}

module.exports = VersionGroup;
