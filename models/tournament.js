"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for tournaments. */

class Tournament {
  /** Create a tournament (from data), update db, return new tournament data.
   *
   * data should be { date, courseHandle, tourYears }
   *
   * Returns { date, courseHandle, tourYears }
   *
   * Throws BadRequestError if tournament already in database.
   * */

  static async create({ date, courseHandle, tourYears }) {
    //dont need to validate date because magic of input type date does that

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
           (date, course_handle, tour_years)
           VALUES ($1, $2, $3)
           RETURNING date, course_handle AS "courseHandle", tour_years AS "tourYears"`,
      [date, courseHandle, tourYears]
    );

    const tournament = tournamentRes.rows[0];

    return tournament;
  }

  /** Find all tournaments
   *
   *
   * Returns [{  date, courseName, tourYears }, ...]

   * */

  static async findAll() {
    const tournamentsRes = await db.query(
      `SELECT date, course_handle AS "courseHandle", name AS "courseName", img_url AS "imgUrl", tour_years AS "tourYears"
                 FROM tournaments
                 JOIN courses 
                 ON tournaments.course_handle = courses.handle
                 ORDER BY date DESC`
    );

    const tournaments = tournamentsRes.rows;

    return tournaments;
  }

  /** Given a tournament date, return basic information about that tournament
   *
   * Returns { date, courseName, tourYears}
   *
   * Throws NotFoundError if not found.
   **/

  static async get(date) {
    const tournamentRes = await db.query(
      `SELECT date, course_handle AS "courseHandle", name AS "courseName", tour_years AS "tourYears"
                   FROM tournaments JOIN courses ON tournaments.course_handle = courses.handle
             WHERE date = $1`,
      [date]
    );

    const tournament = tournamentRes.rows[0];

    const parsRes = await db.query(
      `SELECT hole1, hole2, hole3, hole4, hole5, hole6, hole7, hole8, hole9, hole10, hole11, hole12, hole13, hole14, hole15, hole16, hole17, hole18
         FROM pars
         JOIN courses ON courses.handle=pars.course_handle
         JOIN tournaments ON courses.handle=tournaments.course_handle
         WHERE tournaments.date=$1`,
      [date]
    );

    tournament.pars = parsRes.rows[0];

    return tournament;
  }

  /** Given a tournament date, return all the strokes data about that tournament
   *  ordered by netStrokes ascending so that lowest score displays first.
   *
   * Returns { date, courseHandle, tourYears, rounds }
   *  where rounds is [{ username, strokes, totalStrokes, netStrokes, playerIndex, scoreDifferential, courseHandicap }, ...]
   *  where strokes is {hole1, hole2, ...}
   * Throws NotFoundError if not found.
   **/

  static async getStrokes(date) {
    const tournamentRes = await db.query(
      `SELECT date, course_handle AS "courseHandle", tour_years AS "tourYears"
                 FROM tournaments JOIN courses ON tournaments.course_handle = courses.handle
           WHERE date = $1`,
      [date]
    );

    const tournament = tournamentRes.rows[0];

    if (!tournament) throw new NotFoundError(`No tournament on date: ${date}`);

    const roundsRes = await db.query(
      `SELECT id, users.username, first_name AS "firstName", last_name AS "lastName", total_strokes AS "totalStrokes", net_strokes AS "netStrokes", course_handicap AS "courseHandicap"
          FROM rounds 
          JOIN users ON rounds.username = users.username
          WHERE tournament_date = $1
          ORDER BY net_strokes, total_strokes ASC`,
      [date]
    );
    const rounds = roundsRes.rows;

    if (rounds.length > 0) {
      //map an array of roundIds to more efficiently query the strokes and points tables
      const roundsIds = rounds.map((r) => r.id);

      const strokesRes = await db.query(
        `SELECT round_id AS "roundId",
                hole1, hole2, hole3, hole4, hole5, hole6, hole7, hole8, hole9,
                hole10, hole11, hole12, hole13, hole14, hole15, hole16, hole17, hole18
                FROM strokes
                WHERE round_id IN (${roundsIds.join(",")})`
      );

      const strokes = strokesRes.rows;

      const pointsRes = await db.query(
        `SELECT round_id AS "roundId",
                strokes
                FROM points
                WHERE round_id IN (${roundsIds.join(",")})`
      );

      const points = pointsRes.rows;

      // associate strokes and points with each round based on roundId
      rounds.map((r) => {
        strokes.map((s) => {
          if (s.roundId === r.id) {
            delete s.roundId;
            r.strokes = s;
          }
        });
        points.map((p) => {
          if (p.roundId === r.id) {
            delete p.roundId;
            r.points = p.strokes;
          }
        });
      });
    }

    tournament.rounds = rounds;

    return tournament;
  }

  /** Given a tournament date, return all the putts data about that tournament.
   *
   * Returns { date, courseHandle, tourYears, rounds }
   *  where rounds is [{ username, putts, total_putts }, ...]
   *  where putts is {hole1, hole2, ...}
   *
   * Throws NotFoundError if not found.
   **/

  static async getPutts(date) {
    const tournamentRes = await db.query(
      `SELECT date, course_handle AS "courseHandle", tour_years AS "tourYears"
                   FROM tournaments
             WHERE date = $1`,
      [date]
    );

    const tournament = tournamentRes.rows[0];

    if (!tournament) throw new NotFoundError(`No tournament on date: ${date}`);

    const roundsRes = await db.query(
      `SELECT id, users.username, first_name AS "firstName", last_name AS "lastName", total_putts AS "totalPutts"
            FROM rounds
            JOIN users ON rounds.username = users.username
            WHERE tournament_date = $1
            ORDER BY total_putts ASC`,
      [date]
    );

    const rounds = roundsRes.rows;

    if (rounds.length > 0) {
      const roundsIds = rounds.map((r) => r.id);

      const puttsRes = await db.query(
        `SELECT round_id AS "roundId",
                  hole1, hole2, hole3, hole4, hole5, hole6, hole7, hole8, hole9,
                  hole10, hole11, hole12, hole13, hole14, hole15, hole16, hole17, hole18
                  FROM putts
                  WHERE round_id IN (${roundsIds.join(",")})`
      );
      const putts = puttsRes.rows;

      //add putt points to each round object
      const pointsRes = await db.query(
        `SELECT round_id as "roundId",
              putts
              FROM points
              WHERE round_id IN (${roundsIds.join(",")})`
      );
      const points = pointsRes.rows;

      // associate putts and points with each round based on roundId
      rounds.map((r) => {
        putts.map((p) => {
          if (p.roundId === r.id) {
            delete p.roundId;
            r.putts = p;
          }
        });
        points.map((p) => {
          if (p.roundId === r.id) {
            delete p.roundId;
            r.points = p.putts;
          }
        });
      });
    }
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
      tourYears: "tour_years",
    });

    const dateVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE tournaments 
                        SET ${setCols} 
                        WHERE date = ${dateVarIdx} 
                        RETURNING date,
                                   course_handle AS "courseHandle",
                                   tour_years AS "tourYears"`;

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
