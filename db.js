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

// Handle connection error
db.connect((err) => {
  if (err) {
    console.log("db connection error 💔", err.stack);
    console.error("STACK", err.stack);
  } else {
    console.log("db connected 🚀");
  }
});

// Catching errors with listener attatched to Client. https://node-postgres.com/apis/client#events
db.on("error", (err) => {
  console.error("Unexpected error on idle client 🫠", err.stack);
  console.log("MESSAGE", err?.message);
});

module.exports = db;
