"use strict";

/**
 * Module init function.
 */
module.exports = function () {
    if (!process.env.NODE_ENV) {
        console.error("NODE_ENV is not defined! Using development environment.");
        process.env.NODE_ENV = "development";
    }
};
