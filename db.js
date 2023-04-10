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
    console.log("db connection error 💔", err.stack);
    console.error("STACK", err.stack);
  } else {
    console.log("db connected 🚀");
  }
});

/** Chat GPT suggestion for handling pg connect error*/
db.on("error", (err) => {
  console.error("Unexpected error on idle client 🫠", err.stack);
  console.log("MESSAGE", err?.message);

  //Disconnect client
  db.end((err) => {
    console.log("client has disconnected successfully");
    if (err) {
      console.log("error during disconnection", err.stack);
    }
  });
});

module.exports = db;
