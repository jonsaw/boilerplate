"use strict";

var knex = require("../../config/knex"),
    bcrypt = require("bcrypt"),
    Promise = require("bluebird");

var bookshelf = require("bookshelf")(knex);

var UserGroup = bookshelf.Model.extend({
  tableName: "user_groups"
});

var User = bookshelf.Model.extend({
  tableName: "users",

  groups: function () {
    return this.hasMany(UserGroup, "userId");
  }
});

User.TYPES = {
    SYSTEM_EARS: "SYSTEM_EARS"
};

User.prototype.authenticate = function (password) {
  var self = this;
  return new Promise(function (resolve, reject) {
    bcrypt.compare(password, self.get("password"), function (err, res) {
        if (err) { return reject(err); }
        resolve(res);
    });
  });
};

module.exports = User;
