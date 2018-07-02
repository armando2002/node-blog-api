"use strict";

exports.DATABASE_URL = process.env.DATABASE_URL;


// commenting out DATABASE_URL to test
// exports.DATABASE_URL =
  // process.env.DATABASE_URL || "mongodb://localhost/nodeBlogAPIDb";
exports.TEST_DATABASE_URL =
  process.env.TEST_DATABASE_URL || "mongodb://localhost/nodeBlogAPIDb";
exports.PORT = process.env.PORT || 8080;