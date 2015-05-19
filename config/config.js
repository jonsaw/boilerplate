"use strict";

/**
 * Module dependencies.
 */
var _ = require("lodash");

/**
 * Load app configurations
 */
module.exports = _.merge(
  require("./env/all"),
  require("./env/" + process.env.NODE_ENV)
);
