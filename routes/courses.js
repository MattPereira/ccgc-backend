"use strict";

/** Routes for courses. */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureAdmin } = require("../middleware/auth");
const Course = require("../models/course");

const courseNewSchema = require("../schemas/courseNew.json");
const courseUpdateSchema = require("../schemas/courseUpdate.json");

const router = new express.Router();

/** POST / { course } =>  { course }
 *
 * Creates a new course.
 *
 * req.body data should be { handle, name, rating, slope, pars, handicaps }
 *  where pars is {hole1, hole2, ..., hole18}
 *  and handicaps is {hole1, hole2, ..., hole18}
 *
 * Returns { handle, name, rating, slope, pars, handicaps }
 *
 * Authorization required: admin (TEMPORARILY TURNED OFF FOR TESTING!!!!!!!!!!!!!!!!!)
 *
 */

router.post("/", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, courseNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    const course = await Course.create(req.body);
    return res.status(201).json({ course });
  } catch (err) {
    return next(err);
  }
});

/** GET /  =>
 *
 *   Returns a list of all courses.
 *
 * { courses: [ { handle, name, rating, slope, pars, handicaps }, ... ] }
 *  where pars is {hole1, hole2, ..., hole18}
 *  and handicaps is {hole1, hole2, ..., hole18}
 *
 *
 * Authorization required: none
 */

router.get("/", async function (req, res, next) {
  try {
    const courses = await Course.findAll();
    return res.json({ courses });
  } catch (err) {
    return next(err);
  }
});

/** GET /[handle]  =>  { course }
 *
 *  Course is { handle, name, rating, slope, pars, handicaps }
 *  where pars is {hole1, hole2, ..., hole18}
 *  and handicaps is {hole1, hole2, ..., hole18}
 *
 * Authorization required: none
 */

router.get("/:handle", async function (req, res, next) {
  try {
    const course = await Course.get(req.params.handle);
    return res.json({ course });
  } catch (err) {
    return next(err);
  }
});

/** PATCH /[handle] { fld1, fld2, ... } => { course }
 *
 * Patches course data.
 *
 * fields can be: { name, rating, slope }
 *
 * Returns { handle, name, rating, slope }
 *
 * Authorization: admin (TEMPORARILY TURNED OFF FOR TESTING!!!!!!!!!!!!!!!!!!!!!!!)
 */

router.patch("/:handle", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, courseUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    if (req.body.pars) {
      const pars = await Course.updatePars(req.params.handle, req.body.pars);
      delete req.body.pars;
    }
    if (req.body.handicaps) {
      const handicaps = await Course.updateHandicaps(
        req.params.handle,
        req.body.handicaps
      );
      delete req.body.handicaps;
    }

    const course = await Course.update(req.params.handle, req.body);

    course.pars = pars;
    course.handicaps = handicaps;

    return res.json({ course });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /[handle]  =>  { deleted: handle }
 *
 * Authorization: admin (TEMPORARILY TURNED OFF FOR TESTING!!!!!!!!!!!!!!!!!!!!!!!)
 */

router.delete("/:handle", async function (req, res, next) {
  try {
    await Course.remove(req.params.handle);
    return res.json({ deleted: req.params.handle });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
