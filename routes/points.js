"use strict";

/** Routes for points:
 * create a points row for each round in a tournament,
 * get points for all rounds in a tournament,
 * get points for a specific user in a tournament,
 * update points for a specific tournament,
 * delete points for a specific tournament */

const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureAdmin } = require("../middleware/auth");
const Point = require("../models/point");

const router = new express.Router();

/** Updates points for a specific tournament
 *  using data that already exists in the rounds and greenies tables
 *
 *
 *
 * Authorization required: none
 *
 */

router.get("/:date", async function (req, res, next) {
  try {
    const points = await Point.update(req.params.date);
    return res.status(201).json({ points });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
