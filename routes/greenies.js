"use strict";

/** Routes for greenies:
 * create a greenie,
 * get all greenies (optionally: for a specific tournament),
 * get a greenie,
 * update a greenie,
 * delete a greenie */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureAdmin, ensureLoggedIn } = require("../middleware/auth");
const Greenie = require("../models/greenie");
const Point = require("../models/point");

// const greenieNewSchema = require("../schemas/greenieNew.json");
// const greenieUpdateSchema = require("../schemas/greenieUpdate.json");

const router = new express.Router();

/** POST / { greenie } =>  { greenie }
 *
 * Creates a new greenie.
 *
 * req.body data should be { roundId, holeNumber, feet, inches }
 *
 * Returns { id, roundId, holeNumber, feet, inches }
 *
 * Authorization required: logged in user
 *
 */

router.post("/", async function (req, res, next) {
  try {
    //     const validator = jsonschema.validate(req.body, tournamentNewSchema);
    //     if (!validator.valid) {
    //       const errs = validator.errors.map((e) => e.stack);
    //       throw new BadRequestError(errs);
    //     }

    const greenie = await Greenie.create(req.body);

    //add points to the greenies column in the points table
    await Point.updateGreenies(greenie);

    return res.status(201).json({ greenie });
  } catch (err) {
    return next(err);
  }
});

/** GET /  =>
 *
 *   Returns a list of all greenies.
 *
 * { greenies: [ { id, roundId, holeNumber, feet, inches }, ... ] }
 *
 *
 * Authorization required: none
 */

router.get("/", async function (req, res, next) {
  try {
    const date = req.query.date;

    const greenies = await Greenie.findAll(date);
    return res.json({ greenies });
  } catch (err) {
    return next(err);
  }
});

/** GET /[id]  =>  { greenie }
 *
 *  Returns data about a specific greenie by id.
 *
 *  { greenie: { id, roundId, holeNumber, feet, inches } }
 *
 * Authorization required: none
 */

router.get("/:id", async function (req, res, next) {
  try {
    const greenie = await Greenie.get(req.params.id);
    return res.json({ greenie });
  } catch (err) {
    return next(err);
  }
});

/** PATCH /[id] { holeNumber, feet, inches } => { greenie }
 *
 * Patches greenie data by id.
 *
 * fields must include: { holeNumber, feet, inches }
 *
 * Returns { id, roundId, holeNumber, feet, inches }
 *
 * Authorization: logged in user
 */

router.patch("/:id", async function (req, res, next) {
  try {
    // const validator = jsonschema.validate(req.body, tournamentUpdateSchema);
    // if (!validator.valid) {
    //   const errs = validator.errors.map((e) => e.stack);
    //   throw new BadRequestError(errs);
    // }

    const greenie = await Greenie.update(req.params.id, req.body);

    //update the greenies points incase newly updated greenie is worth more or less points
    await Point.updateGreenies(greenie);

    return res.json({ greenie });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /[date]  =>  { deleted: date }
 *
 * Deletes a tournament by date.
 *
 * this works but still kinda gross
 *
 * Authorization: logged in user
 */

router.delete("/:id", async function (req, res, next) {
  try {
    //remove the points first because you need the id to still exist
    await Point.removeGreenie(req.params.id);

    //then remove the greenie
    await Greenie.remove(req.params.id);

    return res.json({ deleted: req.params.id });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
