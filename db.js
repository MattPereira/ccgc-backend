"use strict";
/** Database setup for ccgc. */
const { Client } = require("pg");
const { getDatabaseUri } = require("./config");

let db;

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
  });
}

/** npm pg package node-postgres docs for handling error on connection */
db.connect((err) => {
  if (err) {
    console.error("connection error", err.stack);
  } else {
    console.log("connected 🎉");
  }
});

/** Chat GPT suggestion for handling pg connect error*/
// db.on("error", (err) => {
//   console.error("Unexpected error on idle client", err);
// });

module.exports = db;
