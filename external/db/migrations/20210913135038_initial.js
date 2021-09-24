exports.up = function (knex) {
  return knex.schema.createTable("user", function (table) {
    table.increments("id");
    table.uuid("eid").notNullable();
    table.string("email", 50).notNullable();
    table.string("first_name", 50).notNullable();
    table.string("last_name", 50).notNullable();
    // timestamps: datatype = timestamp, do not default To Now (JS server controls time)
    table.timestamp("created_at", { precision: 0 }).notNullable();
    table.timestamp("updated_at", { precision: 0 }).notNullable();
    table.timestamp("deleted_at", { precision: 0 }).nullable();

    table.index("eid");
    table.index("deleted_at");
    table.unique(["email", "deleted_at"]);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("user");
};
