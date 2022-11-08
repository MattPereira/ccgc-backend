"use strict";

/** Express app for ccgc. */

const express = require("express");
const cors = require("cors");

const { NotFoundError } = require("./expressError");

const { authenticateJWT } = require("./middleware/auth");
const authRoutes = require("./routes/auth");
const usersRoutes = require("./routes/users");
const coursesRoutes = require("./routes/courses");
const roundsRoutes = require("./routes/rounds");
const tournamentsRoutes = require("./routes/tournaments");
const greeniesRoutes = require("./routes/greenies");
const pointsRoutes = require("./routes/points");

const morgan = require("morgan");

const app = express();

/** Access to XMLHttpRequest at 'https://ccgc.up.railway.app/greenies'
 *  from origin 'https://ccgc.surge.sh' has been blocked by
 * CORS policy: Response to preflight request doesn't pass access
 *  control check: No 'Access-Control-Allow-Origin' header is present
 * on the requested resource.
 */

app.use(cors({ origin: "https://ccgc.surge.sh" }));

app.use(express.json());
app.use(morgan("tiny"));
app.use(authenticateJWT);

app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/courses", coursesRoutes);
app.use("/rounds", roundsRoutes);
app.use("/tournaments", tournamentsRoutes);
app.use("/greenies", greeniesRoutes);
app.use("/points", pointsRoutes);

/** GET / =>
 * display info on all the available routes
 */

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the Contra Costa Golf Club API!",
    github: "https://github.com/MattPereira/ccgc-backend",
    linkedIn: "https://www.linkedin.com/in/matt-pereira-32428a63/",
    sampleGetRoutes: ["/courses", "/rounds", "/tournaments", "/greenies"],
  });
});

/** Handle 404 errors -- this matches everything */
app.use(function (req, res, next) {
  return next(new NotFoundError());
});

/** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = app;
