"use strict";

function UnauthorizedError (message) {
  this.message = message;
  this.stack = new Error().stack;
  this.code = 401;
  this.type = this.name;
}

UnauthorizedError.prototype = Object.create(Error.prototype);
UnauthorizedError.prototype.name = "UnauthorizedError";

module.exports = UnauthorizedError;
