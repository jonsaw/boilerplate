"use strict";

/**
 * Module dependencies.
 */
var _ = require("lodash"),
    passport = require("passport"),
    config = require("../../config/config");

var handleError = function (req, res, message) {
  req.flash("error", message);
  return res.redirect("/signin");
};

/**
* Handle signin
*/
exports.signin = function (req, res, next) {
  passport.authenticate("local", function (err, user, info) {
    if (err || !user) {
      return handleError(req, res, info.message);
    } else {
      req.login(user, function (_err) {
        if (_err) {
          return handleError(req, res, "Error signing in");
        } else {
          module.exports.requiresLogin(req, res, function (__err) {
            if (err) { return next(__err); }
            req.flash("info", "Welcome to " + config.app.title);
            res.redirect("/");
          });
        }
      });
    }
  })(req, res, next);
};

/**
* Handle signout
*/
exports.signout = function (req, res) {
  req.logout();
  res.redirect("/signin");
};

/**
* Requires login routing middleware
*/
exports.requiresLogin = function (req, res, next) {
  if (!req.isAuthenticated()) {
    return handleError(req, res, "Please sign in");
  }
  if (!req.user.has_access) {
    return handleError(req, res, "Access Denied");
  }
  next();
};

/**
* Check if user has access middleware.
*/
exports.hasAccess = function (groups, req, res, next) {
  var hasAccess = false;

  groups.every(function (group) {
    if (req.user.groups) {
      var i = _.findIndex(req.user.groups, function (uGroup) {
        return uGroup.group_code === group;
      });
      if (i >= 0) {
        hasAccess = true;
        return false;
      }
      return true;
    } else {
      return false;
    }
  });

  if (!hasAccess) {
    req.logout();
    return handleError(req, res, "User does not have access");
  }
  next();
};
