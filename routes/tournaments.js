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
 *  Course is { handle, name, rating, slope, pars, handicaps }
 *  where pars is {hole1, hole2, ..., hole18}
 *  and handicaps is {hole1, hole2, ..., hole18}
 *
 * Authorization required: none
 */

router.get("/:date", async function (req, res, next) {
  try {
    const tournament = await Tournament.get(req.params.date);
    return res.json({ tournament });
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

    const course = await Course.update(req.params.handle, req.body);

    return res.json({ course });
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
