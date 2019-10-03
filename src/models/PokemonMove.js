const Model = require('./BaseModel');

class PokemonMove extends Model {
  static tableName = 'pokemon_moves';

  static get relationMappings() {
    return {
      pokemon: {
        relation: Model.HasOneRelation,
        modelClass: require('./Pokemon'),
        join: {
          from: 'pokemon_moves.pokemon_id',
          to: 'pokemon.id',
        },
      },

      move: {
        relation: Model.HasOneRelation,
        modelClass: require('./Move'),
        join: {
          from: 'pokemon_moves.move_id',
          to: 'moves.id',
        },
      },

      versionGroup: {
        relation: Model.HasOneRelation,
        modelClass: require('./VersionGroup'),
        join: {
          from: 'pokemon_moves.version_group_id',
          to: 'version_groups.id',
        },
      },

      moveMethod: {
        relation: Model.HasOneRelation,
        modelClass: require('./PokemonMoveMethod'),
        join: {
          from: 'pokemon_moves.pokemon_move_method_id',
          to: 'pokemon_move_methods.id',
        },
      },
    };
  }

  static get hidden() {
    return [
      'pokemon_id',
      'move_id',
      'version_group_id',
      'pokemon_move_method_id',
    ];
  }
}

module.exports = PokemonMove;
