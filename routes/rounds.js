"use strict";

/** Routes for rounds:
 * create a round,
 * get all rounds for a specific tournament,
 * get a specific round,
 * update a specific round,
 * delete a specific round */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const {
  ensureAdmin,
  ensureCorrectUserOrAdmin,
  ensureLoggedIn,
} = require("../middleware/auth");
const Round = require("../models/round");
const Point = require("../models/point");

// const roundNewSchema = require("../schemas/roundNew.json");
// const roundUpdateSchema = require("../schemas/roundUpdate.json");

const router = new express.Router();

/** POST / { round } =>  { round }
 *
 * Creates a new round.
 *
 * req.body data should be { tournament_date, username, strokes, putts }
 *  where strokes is {hole1, hole2, ..., hole18}
 *  and putts is {hole1, hole2, ..., hole18}
 *
 * Returns { id, tournament_date, username, strokes, putts, total_strokes, net_strokes, total_putts, player_index, score_differential, course_handicap }
 *
 * Authorization required: admin (not sure how to handle this yet)
 *
 */

router.post("/", async function (req, res, next) {
  try {
    // const validator = jsonschema.validate(req.body, roundNewSchema);
    // if (!validator.valid) {
    //   const errs = validator.errors.map((e) => e.stack);
    //   throw new BadRequestError(errs);
    // }

    const round = await Round.create(req.body);

    //create a points row for the new round
    await Point.create(round);

    // update the strokes and putts points for the
    // corresponding tournament after adding a new round
    await Point.updateStrokes(round.tournamentDate);
    await Point.updatePutts(round.tournamentDate);

    return res.status(201).json({ round });
  } catch (err) {
    return next(err);
  }
});

/** GET /  =>
 *
 *   Returns a list of all rounds associated with a particular tournament.
 *
 * { rounds: [ { id, tournament_date, username, strokes, putts, total_strokes, net_strokes, total_putts, player_index, score_differential, course_handicap }, ... ] }
 *  where strokes is {hole1, hole2, ..., hole18}
 *  and putts is {hole1, hole2, ..., hole18}
 *
 *
 * Authorization required: none
 */

router.get("/", async function (req, res, next) {
  try {
    //how to pass some date to Round.findAll()?

    const rounds = await Round.findAll();
    return res.json({ rounds });
  } catch (err) {
    return next(err);
  }
});

/** GET /[handle]  =>  { round }
 *
 *  Returns data about a specific round by id.
 *
 *  Round is { id, tournament_date, username, strokes, putts, total_strokes, net_strokes, total_putts, player_index, score_differential, course_handicap }
 *  where strokes is {hole1, hole2, ..., hole18}
 *  and putts is {hole1, hole2, ..., hole18}
 *
 * Authorization required: none
 */

router.get("/:id", async function (req, res, next) {
  try {
    const round = await Round.get(req.params.id);
    return res.json({ round });
  } catch (err) {
    return next(err);
  }
});

/** PATCH /[handle] { fld1, fld2, ... } => { round }
 *
 * Patches round data (including strokes and putts) by id.
 *
 * fields can be: { strokes, putts }
 *
 * Returns { id, tournament_date, username, strokes, putts, total_strokes, net_strokes, total_putts, player_index, score_differential, course_handicap }
 *
 * Authorization: admin (not sure how to handle this yet)
 */

router.patch("/:id", async function (req, res, next) {
  try {
    // const validator = jsonschema.validate(req.body, roundUpdateSchema);
    // if (!validator.valid) {
    //   const errs = validator.errors.map((e) => e.stack);
    //   throw new BadRequestError(errs);
    // }

    const round = await Round.update(req.params.id, req.body);

    // UPDATE THE POINTS TABLE
    //await Point.update(round.id)
    //await Point.updateScores
    //await Point.updatePutts

    return res.json({ round });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /[id]  =>  { deleted: id }
 *
 * Deletes a round by id.
 *
 * Authorization: admin (not sure how to add owner of round auth?)
 */

router.delete("/:id", async function (req, res, next) {
  try {
    //sloppy but need to grab round data for Point.updates below
    const round = await Round.get(req.params.id);

    await Round.remove(req.params.id);

    //update the strokes and putts points after deleting a round
    // the pars, bird, eag, ace, participation is handled by cascade
    await Point.updateStrokes(round.tournamentDate);
    await Point.updatePutts(round.tournamentDate);

    return res.json({ deleted: req.params.id });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
