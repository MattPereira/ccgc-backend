"use strict";

/** Routes for courses. */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureAdmin } = require("../middleware/auth");
const Course = require("../models/course");

const courseNewSchema = require("../schemas/courseNew.json");
// const courseUpdateSchema = require("../schemas/courseUpdate.json");

const router = new express.Router();

/** POST / { course } =>  { course }
 *
 * course should be { handle, name, rating, slope, pars, handicaps }
 *
 * Returns { handle, name, rating, slope, pars, handicaps }
 *
 * Authorization required: admin (TEMPORARILY TURNED OFF FOR TESTING)
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
 *   { courses: [ { handle, name, rating, slope, pars, handicaps }, ... ] }
 *    where pars and handicaps are {hole1, hole2, hole3, ...}
 *
 *  Returns a list of all courses.
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
 *   where pars is ... TODO
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

/** DELETE /[handle]  =>  { deleted: handle }
 *
 * Authorization: admin (!!!!!TEMPORARILY TURNED OFF FOR TESTING!!!!!!)
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
