"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for greenies. */

class Greenie {
  /** Create a greenie (from data), update db, return new greenie data.
   *
   * data should be { roundId, holeNumber, feet, inches}
   *
   * Returns { id, roundId, holeNumber, feet, inches }
   *
   * */
  static async create({ roundId, holeNumber, feet, inches }) {
    const greenieRes = await db.query(
      `INSERT INTO greenies
           (round_id, hole_number, feet, inches)
           VALUES ($1, $2, $3, $4)
           RETURNING roundId, holeNumber, feet, inches`,
      [roundId, holeNumber, feet, inches]
    );

    const greenie = greenieRes.rows[0];

    return greenie;
  }

  /** Find all greenies
   * sorted by feet and inches
   * from shortest to longest distance
   *
   *  STRETCH GOAL: figure out a way to optionally pass in a tournament_date
   *   to get only the greenies for that tournament
   *
   * Returns [{ roundId, holeNumber, feet, inches }, ...]
   *
   *
   * */

  static async findAll() {
    const greeniesRes = await db.query(
      `SELECT id, round_id AS "roundId", hole_number AS "holeNumber", feet, inches
      FROM greenies
      ORDER BY feet, inches`
    );

    const greenies = greeniesRes.rows;

    return greenies;
  }

  /** Given a course handle, return data about that course
   * including all the rounds played at the particular course.
   *
   * Returns { handle, name, rating, slope, pars, handicaps }
   *   where pars is { hole1, hole2, hole3... }
   *  and handicaps is { hole1, hole2, hole3... }
   *
   * Throws NotFoundError if not found.
   **/

  static async get(handle) {
    const courseRes = await db.query(
      `SELECT handle, name, rating, slope, img_url AS "imgUrl"
                 FROM courses
           WHERE handle = $1`,
      [handle]
    );

    const course = courseRes.rows[0];

    if (!course) throw new NotFoundError(`No course: ${handle}`);

    const parsRes = await db.query(
      `SELECT hole1, hole2, hole3, hole4, hole5, hole6, hole7, hole8, hole9, hole10, hole11, hole12, hole13, hole14, hole15, hole16, hole17, hole18, total
           FROM pars
           WHERE course_handle = $1`,
      [handle]
    );

    const handicapsRes = await db.query(
      `SELECT hole1, hole2, hole3, hole4, hole5, hole6, hole7, hole8, hole9, hole10, hole11, hole12, hole13, hole14, hole15, hole16, hole17, hole18
           FROM handicaps
           WHERE course_handle = $1`,
      [handle]
    );

    course.pars = parsRes.rows[0];
    course.handicaps = handicapsRes.rows[0];

    return course;
  }

  /** Update course, pars, and, handicaps data with `data`.
   *
   * More specifically, dynamically update the course, pars,
   * and handicaps tables depending on which are present in `data`
   *
   *
   * This is a "partial update" --- it's fine if data doesn't contain all the
   * fields; this only changes provided ones.
   *
   * Data can include: {name, rating, slope, pars, handicaps}
   *  where pars could be any of {hole1, hole2, ..., hole18}
   *  and handicaps could be any of {hole1, hole2, ..., hole18}
   *
   * Returns {handle, name, rating, slope, pars, handicaps}
   *
   * Throws NotFoundError if not found.
   */

  /////////////// COULD PROBABLY BE REFACTORED TO BE MORE DRY //////////////////////
  static async update(handle, data) {
    //Throw bad request error if data is empty
    if (Object.keys(data).length === 0) throw new BadRequestError("No data");

    //destructure and rename and spread object properties from data lol
    const { pars: parsData, handicaps: handicapsData, ...basicData } = data;

    // update the pars table if data.pars is provided
    if (parsData) {
      const { setCols, values } = sqlForPartialUpdate(parsData, {});

      const handleVarIdx = "$" + (values.length + 1);

      const querySql = `UPDATE pars 
                        SET ${setCols} 
                        WHERE course_handle = ${handleVarIdx} 
                        RETURNING *`;
      const result = await db.query(querySql, [...values, handle]);
      const pars = result.rows[0];

      if (!pars) throw new NotFoundError(`No course handle: ${handle}`);
    }

    // update the handicaps table if data.handicaps is provided
    if (handicapsData) {
      const { setCols, values } = sqlForPartialUpdate(handicapsData, {});

      const handleVarIdx = "$" + (values.length + 1);

      const querySql = `UPDATE handicaps 
                        SET ${setCols} 
                        WHERE course_handle = ${handleVarIdx} 
                        RETURNING *`;
      const result = await db.query(querySql, [...values, handle]);
      const handicaps = result.rows[0];

      if (!handicaps) throw new NotFoundError(`No course handle: ${handle}`);
    }

    // update the basic course data if data.basicData is provided
    if (Object.keys(basicData).length > 0) {
      const { setCols, values } = sqlForPartialUpdate(basicData, {});

      const handleVarIdx = "$" + (values.length + 1);

      const querySql = `UPDATE courses 
                        SET ${setCols} 
                        WHERE handle = ${handleVarIdx} 
                        RETURNING handle, 
                                  name, 
                                  rating, 
                                  slope`;
      const result = await db.query(querySql, [...values, handle]);
      const course = result.rows[0];

      if (!course) throw new NotFoundError(`No course: ${handle}`);
    }

    //call the get method to return the updated course data
    return Course.get(handle);
  }

  /** Delete given course from database; returns undefined.
   *
   * Throws NotFoundError if course not found.
   **/

  static async remove(handle) {
    const result = await db.query(
      `DELETE
           FROM courses
           WHERE handle = $1
           RETURNING handle`,
      [handle]
    );
    const course = result.rows[0];

    if (!course) throw new NotFoundError(`No course: ${handle}`);
  }
}

module.exports = Greenie;
