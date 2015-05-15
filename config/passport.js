"use strict";

var _ = require("lodash");
var User = require("../app/models/user.server.model");

/**
 * Generates random token
 * @returns {string}
 */
var generateRandomToken = function () {
    var count = 0, i,
        token = new Date().getTime() + "_",
        numeric = "0123456789",
        alphaLower = "abcdefghijklmnopqrstuvwxyz",
        alphaUpper = alphaLower.toUpperCase();

    var chars = "!_" + numeric + alphaUpper + alphaLower;

    while ((count += 1) <= 16) {
        i = Math.floor(Math.random() * 62);
        token += chars.charAt(i);
    }

    return token;
};

var createAccessToken = function (user, callback) {
    var token = generateRandomToken();
    User.where({accessToken: token})
        .fetch()
        .then(function (existingUser) {
            if (existingUser) {
                // run again for unique token
                return createAccessToken(user, callback);
            } else {
                return User.where({id: user.id})
                    .fetch()
                    .then(function (u) {
                        return u.save({accessToken: token}, {patch: true});
                    });
            }
        })
        .then(function (u) {
            callback(null, u.get("accessToken"));
        })
        .catch(callback);
};

exports.serializeUser = function (user, done) {
    createAccessToken(user, function (err, accessToken) {
        if (err) { return done(err); }
        done(null, accessToken);
    });
};

exports.deserializeUser = function (token, done) {
    User
        .where({accessToken: token})
        .fetch({
            withRelated: ["groups"]
        })
        .then(function (user) {
            // pick allowed attributes
            var userObject = _.pick(user.toJSON(), [
                "id", "username", "name", "email", "hasAccess", "groups"
            ]);
            done(null, userObject);
        }).catch(done);
};

exports.strategy = function (username, password, done) {
    User
        .where({username: username})
        .fetch({
            withRelated: ["groups"]
        })
        .then(function (user) {
            if (!user) {
                return done(null, false, {message: "Unknown username or password"});
            }

            user.authenticate(password)
                .then(function (isAuthenticated) {
                    if (!isAuthenticated) {
                        return done(null, false, {message: "Unknown username or password"});
                    }
                    // pick allowed attributes
                    var userObject = _.pick(user.toJSON(), [
                        "id", "username", "name", "email", "hasAccess", "groups"
                    ]);
                    done(null, userObject);
                })
                .catch(done);
        });
};
