"use strict";

var core = require("../../app/controllers/index.server.controller"),
    users = require("../../app/controllers/users.server.controller"),
    User = require("../../app/models/user.server.model");

var ALLOWED_USERS = [User.TYPES.ADMIN];

module.exports = function (app) {
    app.route("/")
        .get(users.requiresLogin, users.hasAccess.bind(this, ALLOWED_USERS), core.index);

    app.route("/signin")
        .get(core.login)
        .post(users.signin);

    app.route("/signout")
        .get(core.logout);

    // Load routing files here

};
