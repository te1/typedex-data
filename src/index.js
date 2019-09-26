const init = require('./schema');

async function main() {
  let knex;

  try {
    knex = await init();
  } catch (err) {
    console.error(err);
  }

  if (knex) {
    knex.destroy();
  }
}

main();
