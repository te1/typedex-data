const path = require('path');
const _ = require('lodash');
const { config, exportData, ignoredTypeNames } = require('./utils');
const Type = require('../models/Type');
const TypeEfficacy = require('../models/TypeEfficacy');
const MoveDamageClass = require('../models/MoveDamageClass');

function getDamageFactors(efficacies, prop) {
  let result = _.map(efficacies, item => {
    return {
      type: item[prop].name,
      factor: item.damage_factor / 100,
    };
  });

  result = _.orderBy(result, 'factor');

  if (!config.keepDamageFactorOne) {
    result = _.reject(result, item => item.factor === 1);
  }

  // compactify
  result = _.keyBy(result, 'type');
  result = _.mapValues(result, 'factor');

  return result;
}

function getTypeColor(typeName) {
  switch (typeName) {
    case 'normal':
      return '#9a9da1';

    case 'fire':
      return '#f8a54f';

    case 'water':
      return '#559edf';

    case 'electric':
      return '#edd53f';

    case 'grass':
      return '#5dbe62';

    case 'ice':
      return '#7ed4c9';

    case 'fighting':
      return '#d94256';

    case 'poison':
      return '#b563ce';

    case 'ground':
      return '#d78555';

    case 'flying':
      return '#9bb4e8';

    case 'psychic':
      return '#f87c7a';

    case 'bug':
      return '#9dc130';

    case 'rock':
      return '#cec18c';

    case 'ghost':
      return '#6970c5';

    case 'dragon':
      return '#0773c7';

    case 'dark':
      return '#5f606d';

    case 'steel':
      return '#5596a4';

    case 'fairy':
      return '#ef97e6';

    default:
      return '#999999';
  }
}

async function exportTypes() {
  console.log('loading types...');

  let types = await Type.all();
  let efficacies = await TypeEfficacy.all();

  console.log(
    `processing ${types.length} types, ${efficacies.length} efficacies...`
  );

  types = _.reject(types, type => _.includes(ignoredTypeNames, type.name));

  let damageTaken, damageDone;

  types = _.map(types, type => {
    damageTaken = _.filter(efficacies, { targetType: { name: type.name } });
    damageDone = _.filter(efficacies, { damageType: { name: type.name } });

    damageTaken = getDamageFactors(damageTaken, 'damageType');
    damageDone = getDamageFactors(damageDone, 'targetType');

    return {
      id: type.id,
      name: type.name,
      caption: type.caption,
      color: getTypeColor(type.name),
      damageTaken,
      damageDone,
    };
  });

  types = _.orderBy(types, 'name');

  if (config.removeIds) {
    types = _.map(types, item => _.omit(item, 'id'));
  }

  return types;
}

function getCategoryColor(categoryName) {
  switch (categoryName) {
    case 'physical':
      return '#d76753';

    case 'special':
      return '#6483b6';

    case 'status':
      return '#b8b1a2';

    default:
      return '#999999';
  }
}

async function exportCategories() {
  console.log('loading categories...');

  let categories = await MoveDamageClass.all();

  console.log(`processing ${categories.length} categories...`);

  categories = _.map(categories, category => {
    return {
      id: category.id,
      name: category.name,
      caption: _.upperFirst(category.caption),
      description: category.description,
      color: getCategoryColor(category.name),
    };
  });

  categories = _.orderBy(categories, 'name');

  if (config.removeIds) {
    categories = _.map(categories, item => _.omit(item, 'id'));
  }

  return categories;
}

async function exportAll(target) {
  let types = await exportTypes();
  let categories = await exportCategories();

  let data = {
    types,
    categories,
  };

  console.log(
    `writing ${types.length} types, ${categories.length} categories...`
  );

  await exportData(path.join(target, 'types.json'), data.types);

  console.log('done\n');
}

module.exports = exportAll;
