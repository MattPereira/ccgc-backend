"use strict";
/** Database setup for ccgc. */
const { Client } = require("pg");
const { getDatabaseUri } = require("./config");

// Create a pg.Client instance
let db;

/**** Connect to db and handle errors ****/
// db.connect((err) => {
//   if (err) {
//     console.log("db connection error 💔", err.stack);
//     console.error("STACK", err.stack);
//   } else {
//     console.log("db connected 🚀");
//   }
// });

const connectClient = () => {
  try {
    db = new Client({
      connectionString: getDatabaseUri(),
      connectionTimeoutMillis: 10000,
      ssl: {
        rejectUnauthorized: false,
      },
    });

    db.connect((err) => {
      if (err) {
        console.log("db connection error 💔", err.stack);
        console.error("STACK", err.stack);
      } else {
        console.log("db connected 🚀");
      }
    });
  } catch (err) {
    console.error("Failed to connect to the database 💔", err);
    console.error("STACK", err.stack);
  }
};

// Catching errors with listener attatched to Client. https://node-postgres.com/apis/client#events
if (db) {
  db.on("error", async (err) => {
    console.error("Unexpected error on idle client 🫠", err.stack);

    console.log("Ending the database connection 🛑");
    await db.end();

    console.log("DB VAR", db);

    console.log("Reconnecting to the database 🤙");
    connectClient();
  });
}

connectClient();

module.exports = db;
