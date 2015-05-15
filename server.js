"use strict";

// run init
require("./config/init")();

var config = require("./config/config");

var server = require("./config/express")();

server.listen(config.port);
console.log(config.app.title + " started on port " + config.port);
