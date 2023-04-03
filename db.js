"use strict";
/** Database setup for ccgc. */
const { Client } = require("pg");
const { getDatabaseUri } = require("./config");

let db;
try {
  if (process.env.NODE_ENV === "production") {
    db = new Client({
      connectionString: getDatabaseUri(),
      ssl: {
        rejectUnauthorized: false,
      },
    });
  } else {
    db = new Client({
      connectionString: getDatabaseUri(),
      //trying to fix ssl error. remove if it doesn't work
      ssl: {
        rejectUnauthorized: false,
      },
      // end fix attempt
    });
  }
} catch (err) {
  console.log("THIS IS CREATING NEW DB CLIENT INSTANCE: ", err);
}

console.log("HELLO WORLD");

try {
  db.connect();
} catch (e) {
  console.log("THIS IS CRASHING SERVER ERROR: ", err);
}

module.exports = db;
