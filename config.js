"use strict";

// exports.DATABASE_URL = process.env.DATABASE_URL;
var env = {DATABASE_URL: process.env.DATABASE_URL, PORT:process.env.PORT || 8080};
// exports.PORT = process.env.PORT || 8080;
module.exports = env;