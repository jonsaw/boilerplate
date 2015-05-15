"use strict";

exports.up = function(knex) {
    return knex.schema.createTable("users", function (table) {
        table.increments().primary();
        table.string("username", 55).unique().notNullable();
        table.string("name").notNullable();
        table.string("email", 55).notNullable();
        table.string("password").notNullable();
        table.boolean("hasAccess").default(false);
        table.timestamps();
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable("users");
};
