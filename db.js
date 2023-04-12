"use strict";
/** Database setup for ccgc. */
const { Pool } = require("pg");
const { getDatabaseUri } = require("./config");

// Create a pg.Pool instance
const db = new Pool({
  connectionString: getDatabaseUri(),
  connectionTimeoutMillis: 10000,
  ssl: {
    rejectUnauthorized: false,
  },
});

const connectClient = async () => {
  try {
    await db.connect();
    console.log("Connected to the database 🚀");
  } catch (err) {
    console.error("Failed to connect to the database 💔", err);
    console.error("STACK", err.stack);
  }
};

// // Handle connection error
// db.connect((err) => {
//   if (err) {
//     console.log("db connection error 💔", err.stack);
//     console.error("STACK", err.stack);
//   } else {
//     console.log("db connected 🚀");
//   }
// });

// Catching errors with listener attatched to Client. https://node-postgres.com/apis/client#events
db.on("error", async (err) => {
  console.error("Unexpected error on idle client 🫠", err.stack);

  if (db) {
    console.log("Ending the database connection 🛑");
    await db.end();
  }

  console.log("Reconnecting to the database 🤙");
  connectClient();
});

connectClient();

module.exports = db;
