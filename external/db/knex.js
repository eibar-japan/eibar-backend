const knexConfig = require("./knexfile");
const knex = require("knex");

const getKnexDb = (env) => {
  return knex(knexConfig[env]);
};

module.exports = getKnexDb;
