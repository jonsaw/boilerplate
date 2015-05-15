"use strict";

var config = require("./config");

module.exports = require("knex")({
    client: "mysql",
    connection: {
        "host": config.database.connection.host,
        "user": config.database.connection.user,
        "password": config.database.connection.password,
        "database": config.database.connection.database
    }
});
