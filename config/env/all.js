"use strict";

module.exports = {
    app: {
        title: "Boilerplate",
        description: "Boilerplate",
        codename: null,
        version: "0.0.1"
    },
    port: process.env.PORT || 3000,
    sessionSecret: "s3ssion-s3cret",
    database: {
        client: "mysql",
        connection: {
            host: "localhost",
            user: "root",
            password: "root",
            database: "boilerplate_" + process.env.NODE_ENV
        }
    }
};
