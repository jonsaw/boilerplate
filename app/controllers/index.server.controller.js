"use strict";

var config = require("../../config/config");

exports.index = function (req, res) {
    res.render("index", {
        title: config.app.title,
        user: req.user
    });
};

exports.login = function (req, res) {
    // redirect to index if logged in
    if (req.isAuthenticated()) {
        req.flash("info", "Welcome to " + config.app.title);
        res.redirect("/");
    }

    res.render("signin", {
        title: config.app.title + " | Sign In"
    });
};

exports.logout = function (req, res) {
    req.session.destroy(function () {
        res.redirect("/");
    });
};
