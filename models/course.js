"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for courses. */

class Course {
  /** Create a course (from data), update db, return new course data.
   *
   * data should be { handle, name, rating, slope, pars, handicaps }
   *  where pars is {hole1, hole2, hole3, ..., total}
   *  and handicaps is {hole1, hole2, hole3, ...}
   *
   * Returns { handle, name, rating, slope, pars, handicaps }
   *
   * Throws BadRequestError if course already in database.
   * */

  static async create({ handle, name, rating, slope, pars, handicaps }) {
    const duplicateCheck = await db.query(
      `SELECT handle
           FROM courses
           WHERE handle = $1`,
      [handle]
    );

    if (duplicateCheck.rows[0])
      throw new BadRequestError(`Duplicate course: ${handle}`);

    const courseResult = await db.query(
      `INSERT INTO courses
           (handle, name, rating, slope)
           VALUES ($1, $2, $3, $4)
           RETURNING handle, name, rating, slope`,
      [handle, name, rating, slope]
    );

    //sum the pars object values to get the total
    const total = Object.values(pars).reduce((a, b) => a + b, 0);

    const parsResult = await db.query(
      `INSERT INTO pars
        (course_handle, hole1, hole2, hole3, hole4, hole5, hole6, hole7, hole8, hole9, hole10, hole11, hole12, hole13, hole14, hole15, hole16, hole17, hole18, total)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19,$20)
        RETURNING hole1, hole2, hole3, hole4, hole5, hole6, hole7, hole8, hole9, hole10, hole11, hole12, hole13, hole14, hole15, hole16, hole17, hole18`,
      [
        handle,
        pars.hole1,
        pars.hole2,
        pars.hole3,
        pars.hole4,
        pars.hole5,
        pars.hole6,
        pars.hole7,
        pars.hole8,
        pars.hole9,
        pars.hole10,
        pars.hole11,
        pars.hole12,
        pars.hole13,
        pars.hole14,
        pars.hole15,
        pars.hole16,
        pars.hole17,
        pars.hole18,
        total,
      ]
    );

    const handicapResult = await db.query(
      `INSERT INTO handicaps
        (course_handle, hole1, hole2, hole3, hole4, hole5, hole6, hole7, hole8, hole9, hole10, hole11, hole12, hole13, hole14, hole15, hole16, hole17, hole18)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
        RETURNING hole1, hole2, hole3, hole4, hole5, hole6, hole7, hole8, hole9, hole10, hole11, hole12, hole13, hole14, hole15, hole16, hole17, hole18`,
      [
        handle,
        handicaps.hole1,
        handicaps.hole2,
        handicaps.hole3,
        handicaps.hole4,
        handicaps.hole5,
        handicaps.hole6,
        handicaps.hole7,
        handicaps.hole8,
        handicaps.hole9,
        handicaps.hole10,
        handicaps.hole11,
        handicaps.hole12,
        handicaps.hole13,
        handicaps.hole14,
        handicaps.hole15,
        handicaps.hole16,
        handicaps.hole17,
        handicaps.hole18,
      ]
    );

    const course = courseResult.rows[0];

    course.pars = parsResult.rows[0];
    course.handicaps = handicapResult.rows[0];

    return course;
  }

  /** Find all courses
   *
   *
   * Returns [{ handle, name, rating, slope, pars, handicaps }, ...]
   *  where pars is {hole1, hole2, hole3, ...}
   *  and handicaps is {hole1, hole2, hole3, ...}
   * */

  static async findAll() {
    const coursesResult = await db.query(
      `SELECT handle, name, rating, slope
                 FROM courses
                 ORDER BY handle`
    );

    const parsResult = await db.query(
      `SELECT course_handle AS "courseHandle", 
              hole1, hole2, hole3, hole4, hole5, hole6, hole7, hole8, hole9, 
              hole10, hole11, hole12, hole13, hole14, hole15, hole16, hole17, hole18, total 
              FROM pars`
    );

    const handicapResult = await db.query(
      `SELECT course_handle AS "courseHandle", 
              hole1, hole2, hole3, hole4, hole5, hole6, hole7, hole8, hole9, 
              hole10, hole11, hole12, hole13, hole14, hole15, hole16, hole17, hole18 
              FROM handicaps`
    );

    const courses = coursesResult.rows;
    const pars = parsResult.rows;
    const handicaps = handicapResult.rows;

    // associate pars and handicaps with course based on courseHandle
    courses.map((c) => {
      pars.map((p) => {
        if (p.courseHandle === c.handle) {
          delete p.courseHandle;
          c.pars = p;
        }
      });
      handicaps.map((h) => {
        if (h.courseHandle === c.handle) {
          delete h.courseHandle;
          c.handicaps = h;
        }
      });
    });

    return courses;
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
      `SELECT handle, name, rating, slope
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

  // /** Update pars data with `data`.
  //  *
  //  * This is a "partial update" --- it's fine if data doesn't contain all the
  //  * fields; this only changes provided ones.
  //  *
  //  * Data can include: {hole1, hole2, hole3, ...}
  //  *
  //  * Returns {course_handle, hole1, hole2, hole3, ...}
  //  *
  //  * Throws NotFoundError if not found.
  //  */

  // static async updatePars(handle, data) {
  //   const { setCols, values } = sqlForPartialUpdate(data, {});

  //   const handleVarIdx = "$" + (values.length + 1);

  //   const querySql = `UPDATE pars
  //                       SET ${setCols}
  //                       WHERE course_handle = ${handleVarIdx}
  //                       RETURNING course_handle,
  //                                 hole1,
  //                                 hole2,
  //                                 hole3,
  //                                 hole4,
  //                                 hole5,
  //                                 hole6,
  //                                 hole7,
  //                                 hole8,
  //                                 hole9,
  //                                 hole10,
  //                                 hole11,
  //                                 hole12,
  //                                 hole13,
  //                                 hole14,
  //                                 hole15,
  //                                 hole16,
  //                                 hole17,
  //                                 hole18`;
  //   const result = await db.query(querySql, [...values, handle]);
  //   const pars = result.rows[0];

  //   if (!pars) throw new NotFoundError(`No course handle: ${handle}`);

  //   return pars;
  // }

  // /** Update handicaps data with `data`.
  //  *
  //  * This is a "partial update" --- it's fine if data doesn't contain all the
  //  * fields; this only changes provided ones.
  //  *
  //  * Data can include: {hole1, hole2, hole3, ...}
  //  *
  //  * Returns {course_handle, hole1, hole2, hole3, ...}
  //  *
  //  * Throws NotFoundError if not found.
  //  */

  // static async updateHandicaps(handle, data) {
  //   const { setCols, values } = sqlForPartialUpdate(data, {});

  //   const handleVarIdx = "$" + (values.length + 1);

  //   const querySql = `UPDATE handicaps
  //                         SET ${setCols}
  //                         WHERE course_handle = ${handleVarIdx}
  //                         RETURNING course_handle,
  //                                   hole1,
  //                                   hole2,
  //                                   hole3,
  //                                   hole4,
  //                                   hole5,
  //                                   hole6,
  //                                   hole7,
  //                                   hole8,
  //                                   hole9,
  //                                   hole10,
  //                                   hole11,
  //                                   hole12,
  //                                   hole13,
  //                                   hole14,
  //                                   hole15,
  //                                   hole16,
  //                                   hole17,
  //                                   hole18`;
  //   const result = await db.query(querySql, [...values, handle]);
  //   const handicaps = result.rows[0];

  //   if (!handicaps) throw new NotFoundError(`No course handle: ${handle}`);

  //   return handicaps;
  // }

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

module.exports = Course;
