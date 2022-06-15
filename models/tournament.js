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

  /** Given a tournament date, return all the strokes data about that tournament
   *  ordered by netStrokes ascending so that lowest score displays first.
   *
   * Returns { date, courseHandle, seasonEndYear, rounds }
   *  where rounds is [{ username, strokes, totalStrokes, netStrokes, playerIndex, scoreDifferential, courseHandicap }, ...]
   *  where strokes is {hole1, hole2, ...}
   * Throws NotFoundError if not found.
   **/

  static async getStrokes(date) {
    const tournamentRes = await db.query(
      `SELECT date, name AS "courseName", season_end_year AS "seasonEndYear"
                 FROM tournaments JOIN courses ON tournaments.course_handle = courses.handle
           WHERE date = $1`,
      [date]
    );

    const tournament = tournamentRes.rows[0];

    if (!tournament) throw new NotFoundError(`No tournament on date: ${date}`);

    const roundsRes = await db.query(
      `SELECT id, username, total_strokes AS "totalStrokes", net_strokes AS "netStrokes", total_putts AS "totalPutts", player_index AS "playerIndex", score_differential AS "scoreDifferential", course_handicap AS "courseHandicap"
          FROM rounds
          WHERE tournament_date = $1
          ORDER BY net_strokes ASC`,
      [date]
    );

    const strokesRes = await db.query(
      `SELECT round_id AS "roundId",
                hole1, hole2, hole3, hole4, hole5, hole6, hole7, hole8, hole9,
                hole10, hole11, hole12, hole13, hole14, hole15, hole16, hole17, hole18
                FROM strokes`
    );

    const rounds = roundsRes.rows;
    const strokes = strokesRes.rows;

    // associate strokes with each round based on roundId
    rounds.map((r) => {
      strokes.map((s) => {
        if (s.roundId === r.id) {
          delete s.roundId;
          r.strokes = s;
        }
      });
    });

    tournament.rounds = rounds;

    return tournament;
  }

  /** Given a tournament date, return all the putts data about that tournament.
   *
   * Returns { date, course_handle, season_end_year, rounds }
   *  where rounds is [{ username, putts, total_putts }, ...]
   *  where putts is {hole1, hole2, ...}
   *
   * Throws NotFoundError if not found.
   **/

  static async getPutts(date) {
    const tournamentRes = await db.query(
      `SELECT date, course_handle AS "courseHandle", season_end_year AS "seasonEndYear"
                   FROM tournaments
             WHERE date = $1`,
      [date]
    );

    const tournament = tournamentRes.rows[0];

    if (!tournament) throw new NotFoundError(`No tournament on date: ${date}`);

    const roundsRes = await db.query(
      `SELECT id, username, total_putts AS "totalPutts"
            FROM rounds
            WHERE tournament_date = $1
            ORDER BY total_putts ASC`,
      [date]
    );

    const puttsRes = await db.query(
      `SELECT round_id AS "roundId",
                  hole1, hole2, hole3, hole4, hole5, hole6, hole7, hole8, hole9,
                  hole10, hole11, hole12, hole13, hole14, hole15, hole16, hole17, hole18
                  FROM putts`
    );

    const rounds = roundsRes.rows;
    const putts = puttsRes.rows;

    // associate putts with each round based on roundId
    rounds.map((r) => {
      putts.map((p) => {
        if (p.roundId === r.id) {
          delete p.roundId;
          r.putts = p;
        }
      });
    });

    tournament.rounds = rounds;

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
