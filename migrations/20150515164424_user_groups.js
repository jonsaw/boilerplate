"use strict";

exports.up = function(knex) {
    return knex.schema.createTable("user_groups", function (table) {
        table.increments().primary();
        table.integer("userId")
            .notNullable()
            .unsigned()
            .references("id")
            .inTable("users");
        table.integer("groupId")
            .notNullable()
            .unsigned()
            .references("id")
            .inTable("groups");
        table.unique(["userId", "groupId"]);
        table.timestamps();
    });
};

exports.down = function(knex) {
    return knex.schema.table("user_groups", function (table) {
        table.dropForeign("userId");
        table.dropForeign("groupId");
        table.dropUnique(["userId", "groupId"]);
    })
        .then(function () {
            return knex.schema.dropTable("user_groups");
        });
};
