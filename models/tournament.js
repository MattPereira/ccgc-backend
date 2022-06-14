"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for tournaments. */

class Tournament {
  /** Create a tournament (from data), update db, return new tournament data.
   *
   * data should be { date, course_handle, season_end_year }
   *
   * Returns { date, course_handle, season_end_year }
   *
   * Throws BadRequestError if tournament already in database.
   * */

  static async create({ date, courseHandle, seasonEndYear }) {
    // ADD VALIDATION FOR DATE TO MAKE SURE IT LOOKS LIKE "2022-05-15" !!!!!
    // OR DOES THAT BELONG IN SCHEMAS FOLDER?

    const duplicateCheck = await db.query(
      `SELECT date
           FROM tournaments
           WHERE date = $1`,
      [date]
    );

    if (duplicateCheck.rows[0])
      throw new BadRequestError(`Duplicate tournament date: ${date}`);

    const tournamentRes = await db.query(
      `INSERT INTO tournaments
           (date, course_handle, season_end_year)
           VALUES ($1, $2, $3)
           RETURNING date, course_handle AS "courseHandle", season_end_year AS "seasonEndYear"`,
      [date, course_handle, season_end_year]
    );

    const tournament = tournamentRes.rows[0];

    return tournament;
  }

  /** Find all tournaments
   *
   *
   * Returns [{  date, courseName, season_end_year }, ...]

   * */

  static async findAll() {
    const tournamentsRes = await db.query(
      `SELECT date, course_handle AS "courseHandle", name AS "courseName", season_end_year AS "seasonEndYear"
                 FROM tournaments
                 JOIN courses 
                 ON tournaments.course_handle = courses.handle
                 ORDER BY date DESC`
    );

    const tournaments = tournamentsRes.rows;

    return tournaments;
  }

  /** Given a tournament date, return data about that tournament.
   *
   * Returns { date, course_handle, season_end_year }
   *
   *
   * Throws NotFoundError if not found.
   **/

  static async get(date) {
    const tournamentRes = await db.query(
      `SELECT date, course_handle AS "courseHandle", season_end_year AS "seasonEndYear"
                 FROM tournaments
           WHERE date = $1`,
      [date]
    );

    const tournament = tournamentRes.rows[0];

    return tournament;
  }

  /** Update tournament data with `data`.
   *
   *
   * This is a "partial update" --- it's fine if data doesn't contain all the
   * fields; this only changes provided ones.
   *
   * Data can include: {courseHandle, seasonEndYear}
   *
   * Returns {date, courseHandle, seasonEndYear}
   *
   * Throws NotFoundError if not found.
   */

  static async update(date, data) {
    const { setCols, values } = sqlForPartialUpdate(data, {
      courseHandle: "course_handle",
      seasonEndYear: "season_end_year",
    });

    const dateVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE tournaments 
                        SET ${setCols} 
                        WHERE date = ${dateVarIdx} 
                        RETURNING date,
                                   course_handle AS "courseHandle,
                                   season_end_year AS "seasonEndYear"`;
    const result = await db.query(querySql, [...values, date]);
    const tournament = result.rows[0];

    if (!tournament) throw new NotFoundError(`No tournament on date: ${date}`);

    return tournament;
  }

  static async remove(date) {
    const result = await db.query(
      `DELETE
           FROM tournaments
           WHERE date = $1
           RETURNING date`,
      [date]
    );
    const tournament = result.rows[0];

    if (!tournament) throw new NotFoundError(`No tournament on date: ${date}`);
  }
}

module.exports = Tournament;
