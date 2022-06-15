"use strict";

/** Routes for courses:
 * create a tournament,
 * get all tournament,
 * get a specific tournament,
 * update a specific tournament,
 * delete a specific tournament */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureAdmin } = require("../middleware/auth");
const Tournament = require("../models/tournament");

// const tournamentNewSchema = require("../schemas/tournamentNew.json");
// const tournamentUpdateSchema = require("../schemas/tournamentUpdate.json");

const router = new express.Router();

/** POST / { tournament } =>  { tournament }
 *
 * Creates a new tournament.
 *
 * req.body data should be { date, courseHandle, seasonEndYear }
 *
 * Returns { date, courseHandle, seasonEndYear }
 *
 * Authorization required: admin
 *
 */

router.post("/", ensureAdmin, async function (req, res, next) {
  try {
    //     const validator = jsonschema.validate(req.body, tournamentNewSchema);
    //     if (!validator.valid) {
    //       const errs = validator.errors.map((e) => e.stack);
    //       throw new BadRequestError(errs);
    //     }

    const tournament = await Tournament.create(req.body);
    return res.status(201).json({ tournament });
  } catch (err) {
    return next(err);
  }
});

/** GET /  =>
 *
 *   Returns a list of all tournaments.
 *
 * { tournaments: [ { date, courseName, seasonEndYear }, ... ] }
 *
 *
 * Authorization required: none
 */

router.get("/", async function (req, res, next) {
  try {
    const tournaments = await Tournament.findAll();
    return res.json({ tournaments });
  } catch (err) {
    return next(err);
  }
});

/** GET /[date]  =>  { tournament }
 *
 *  Returns data about a specific tournament by date.
 *
 *  strokesLeaderboard orders rounds by net_strokes ascending
 *
 *  strokesLeaderboard is { date, course_handle, season_end_year, rounds }
 *  where rounds is [{ username, strokes, total_strokes, net_strokes, player_index, score_differential, course_handicap }, ...]
 *  where strokes is {hole1, hole2, ...}
 *
 * puttsLeaderboard orders rounds by total_putts ascending
 *
 * puttsLeaderboard is { date, courseHandle, seasonEndYear, rounds}
 *
 *
 *
 *
 * Authorization required: none
 */

router.get("/:date", async function (req, res, next) {
  try {
    const strokesLeaderboard = await Tournament.getStrokes(req.params.date);
    const puttsLeaderboard = await Tournament.getPutts(req.params.date);
    return res.json({ tournament: { strokesLeaderboard, puttsLeaderboard } });
  } catch (err) {
    return next(err);
  }
});

/** PATCH /[date] { fld1, fld2, ... } => { tournament }
 *
 * Patches course data (including pars and handicaps) by handle.
 *
 * fields can be: { course_handle, season_end_year }
 *
 * Returns { date, course_handle, season_end_year }
 *
 * Authorization: admin
 */

router.patch("/:date", ensureAdmin, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, tournamentUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    const tournament = await Tournament.update(req.params.handle, req.body);

    return res.json({ tournament });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /[handle]  =>  { deleted: handle }
 *
 * Deletes a course by handle.
 *
 * Authorization: admin
 */

router.delete("/:handle", ensureAdmin, async function (req, res, next) {
  try {
    await Course.remove(req.params.handle);
    return res.json({ deleted: req.params.handle });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
