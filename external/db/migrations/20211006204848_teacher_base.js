exports.up = function (knex) {
  return knex.schema.createTable("teacher_profile", function (table) {
    table.increments("id");
    table.uuid("eid").notNullable();
    table.integer("user_id").unsigned();
    table.string("display_name", 20).notNullable();
    table.string("language_code", 2).notNullable(); // ISO-639-1 2-character code
    table.json("default_rate").notNullable(); // JSON containing amount, currency, precision
    // timestamps: datatype = timestamp, do not default To Now (JS server controls time)
    table.timestamp("created_at", { precision: 0 }).notNullable();
    table.timestamp("updated_at", { precision: 0 }).notNullable();
    table.timestamp("deleted_at", { precision: 0 }).nullable();

    table.foreign("user_id", "eibarusers.id");
    table.unique(["display_name", "deleted_at"]);

    table.index("eid");
    table.index("deleted_at");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("teacher_profile");
};
