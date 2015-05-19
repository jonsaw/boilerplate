"use strict";

exports.up = function(knex) {
  return knex.schema.createTable("groups", function (table) {
    table.increments().primary();
    table.string("name", 55)
      .unique()
      .notNullable();
    table.text("notes");
    table.timestamps();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("groups");
};
