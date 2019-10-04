const path = require('path');
const _ = require('lodash');
const {
  config,
  exportData,
  ignoredMoveMethodNames,
  ignoredVersionGroupNames,
} = require('./utils');
const Stat = require('../models/Stat');
const Nature = require('../models/Nature');
const Pokemon = require('../models/Pokemon');
const PokemonMoveMethod = require('../models/PokemonMoveMethod');
const Evolutiontrigger = require('../models/Evolutiontrigger');

async function exportStats() {
  console.log('loading stats...');
  let stats = await Stat.all();

  console.log(`processing ${stats.length} stats...`);

  let damageCategory;

  stats = _.map(stats, stat => {
    damageCategory = stat.damageClass ? stat.damageClass.name : null;

    return {
      id: stat.id,
      name: stat.name,
      caption: stat.caption,
      damageCategory,
      battleOnly: !!stat.is_battle_only,
    };
  });

  stats = _.orderBy(stats, 'id');

  if (config.removeIds) {
    stats = _.map(stats, item => _.omit(item, 'id'));
  }

  if (config.simpleStats) {
    stats = _.map(stats, item =>
      _.omit(item, ['damageCategory', 'battleOnly'])
    );
  }

  return stats;
}

async function exportNatures() {
  console.log('loading natures...');
  let natures = await Nature.all();

  console.log(`processing ${natures.length} natures...`);

  natures = _.map(natures, nature => {
    return {
      id: nature.id,
      name: nature.name,
      caption: nature.caption,
      plus: nature.decreasedStat.name,
      minus: nature.increasedStat.name,
    };
  });

  natures = _.orderBy(natures, 'id');

  if (config.removeIds) {
    natures = _.map(natures, item => _.omit(item, 'id'));
  }

  return natures;
}

async function exportEvolutionTriggers() {
  console.log('loading evolution triggers...');
  let triggers = await Evolutiontrigger.all();

  console.log(`processing ${triggers.length} evolution triggers...`);

  triggers = _.map(triggers, trigger => {
    return {
      id: trigger.id,
      name: trigger.name,
      caption: trigger.caption,
    };
  });

  triggers = _.orderBy(triggers, 'id');

  if (config.removeIds) {
    triggers = _.map(triggers, item => _.omit(item, 'id'));
  }

  return triggers;
}

async function exportMoveMethods() {
  console.log('loading move methods...');
  let moveMethods = await PokemonMoveMethod.all();

  console.log(`processing ${moveMethods.length} move methods...`);

  moveMethods = _.reject(moveMethods, item =>
    _.includes(ignoredMoveMethodNames, item.name)
  );

  moveMethods = _.map(moveMethods, moveMethod => {
    return {
      id: moveMethod.id,
      name: moveMethod.name,
      caption: moveMethod.caption,
      description: moveMethod.description, // TODO handle markdown syntax
    };
  });

  moveMethods = _.orderBy(moveMethods, 'id');

  if (config.removeIds) {
    moveMethods = _.map(moveMethods, item => _.omit(item, 'id'));
  }

  return moveMethods;
}

function getMoves(pkmn) {
  let result = _.mapValues(pkmn.moves, group => {
    let move = _.map(group, item => {
      return {
        versionGroup: item.versionGroup.name,
        method: item.moveMethod.name,
        level: item.level,
      };
    });

    move = _.reject(move, item =>
      ignoredVersionGroupNames.includes(item.versionGroup)
    );
    move = _.reject(move, item => ignoredMoveMethodNames.includes(item.method));

    if (config.targetVersionGroup) {
      move = _.filter(move, { versionGroup: config.targetVersionGroup });
    }

    if (config.simplePokemonMoves) {
      move = _.map(move, 'method');
      move = _.uniq(move);
    }

    return move;
  });

  result = _.omitBy(result, item => item.length === 0);

  return result;
}

function getAbilities(pkmn) {
  let result = _.filter(pkmn.abilities, item => item.is_main_series);
  result = _.map(result, item => {
    return {
      ability: item.name,
      hidden: !!item.is_hidden,
      slot: item.slot,
    };
  });
  result = _.keyBy(result, 'ability');
  result = _.mapValues(result, item => _.omit(item, 'ability'));

  // compactify
  result = _.mapValues(result, item => (item.hidden ? 'hidden' : item.slot));

  return result;
}

function getFlavorText(species) {
  if (config.onlyLatestFlavorText) {
    return species.flavorText.flavor_text;
  }
  return _.map(species.flavorTexts, item => {
    return {
      text: item.flavor_text,
      versionGroup: item.versionGroup.name,
    };
  });
}

async function exportPokemon() {
  console.log('loading pokemon...');
  let pokemon = await Pokemon.all();

  // console.log(pokemon[0].species.toJSON());

  console.log(`processing ${pokemon.length} pokemon...`);

  // return {
  //   details: [],
  //   index: [],
  // };

  let height, weight, baseStats, isDefault, types, moves, abilities;
  let isMega, formCaption;
  let gen, color, flavorText;

  pokemon = _.map(pokemon, pkmn => {
    height = pkmn.height / 10; // convert to m
    weight = pkmn.weight / 10; // convert to kg

    baseStats = _.keyBy(pkmn.baseStats, 'name');
    baseStats = _.mapValues(baseStats, 'base_stat');

    types = _.orderBy(pkmn.types, 'slot');
    types = _.map(types, 'name');

    moves = getMoves(pkmn);
    abilities = getAbilities(pkmn);

    isDefault = !!pkmn.is_default;

    isMega = !!pkmn.defaultForm.is_mega;
    formCaption = isMega ? undefined : pkmn.defaultForm.formCaption;

    gen = pkmn.species.generation.name;
    color = pkmn.species.color.name;
    flavorText = getFlavorText(pkmn.species);

    return {
      id: pkmn.id,
      name: pkmn.name,
      caption: pkmn.caption,
      order: pkmn.order,
      types,
      species: pkmn.species.name,
      gen,
      color,
      default: isDefault,
      alternate: !isDefault && !isMega,
      mega: isMega,
      form: formCaption,
      height,
      weight,
      baseStats,
      evolutionChain: pkmn.species.evolutionChain.chain,
      flavorText,
      moves,
      abilities,
    };
  });

  pokemon = _.orderBy(pokemon, 'order');

  if (config.removeIds) {
    pokemon = _.map(pokemon, item => _.omit(item, 'id'));
  }

  pokemon = _.map(pokemon, item => _.omit(item, ['order', '']));

  let result;

  let index = _.map(pokemon, pkmn => {
    result = _.pick(pkmn, [
      'id',
      'name',
      'caption',
      'order',
      'species',
      'types',
      'gen',
      'alternate',
      'mega',
      'form',
    ]);

    // drop undefined, null and false values
    result = _.pickBy(result, value => value != null && value !== false);

    return result;
  });

  return {
    index,
    details: pokemon,
  };
}

async function exportAll(target) {
  let pokemon = await exportPokemon();
  let moveMethods = await exportMoveMethods();
  let evolutionTriggers = await exportEvolutionTriggers();
  let stats = await exportStats();
  let natures = await exportNatures();

  let data = {
    pokemon: pokemon.index,
    moveMethods,
    evolutionTriggers,
    stats,
    natures,
  };

  console.log(
    `writing ${pokemon.index.length} pokemon, ${moveMethods.length} move methods, ` +
      `${evolutionTriggers.length} evolution triggers, ${stats.length} stats, ` +
      `${natures.length} natures...`
  );

  await exportData(path.join(target, 'pokemon.json'), data);

  console.log(`writing ${pokemon.details.length} pokemon details...`);

  for (const pkmn of pokemon.details) {
    await exportData(path.join(target, 'pokemon', pkmn.name + '.json'), pkmn);
  }

  console.log('done\n');
}

module.exports = exportAll;
