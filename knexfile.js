"use strict";

require("./config/init")();

/**
 * Module dependencies.
 */
var config = require("./config/config");

var knexConfig = {};

knexConfig[process.env.NODE_ENV] = config.database;

module.exports = knexConfig;
