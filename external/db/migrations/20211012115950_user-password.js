exports.up = function (knex) {
  return knex.schema.table("eibaruser", function (table) {
    table.string("password_hash", 100).notNullable().defaultTo("");
  });
};

exports.down = function (knex) {
  return knex.schema.table("eibaruser", function (table) {
    table.dropColumn("password_hash");
  });
};
