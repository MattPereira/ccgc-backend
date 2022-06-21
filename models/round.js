"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for courses. */

class Round {
  /** Create a round (from data), update db, return new round data.
   *
   * data should be { tournament_date, username, strokes, putts }
   *  where strokes is {hole1, hole2, hole3, ...}
   *  and putts is {hole1, hole2, hole3, ...}
   *
   * Returns { tournamentDate, username, strokes, putts }
   *
   * Throws BadRequestError if round already in database.
   * */

  //////////////// NEEDS SO MUCH WORK TO CREATE A ROUND ////////////////

  static async create({ tournamentDate, username, strokes, putts }) {
    //block a user from inputing more than one round per tournament date
    const duplicateCheck = await db.query(
      `SELECT tournament_date, username
           FROM rounds
           WHERE tournament_date = $1 AND username = $2`,
      [tournamentDate, username]
    );

    if (duplicateCheck.rows[0])
      throw new BadRequestError(
        `Members are only allowed to submit one round per tournament!`
      );

    /**  Sum the strokes and putts objects to get total_strokes and total_putts */
    const totalStrokes = Object.values(strokes).reduce((a, b) => a + b, 0);
    const totalPutts = Object.values(putts).reduce((a, b) => a + b, 0);
    console.log("TOTAL STROKES", totalStrokes);
    console.log("TOTAL PUTTS", totalPutts);

    /** Compute the score_differential for the round (113 / course_slope) * (total_strokes - course_rating) */

    const courseRes = await db.query(
      `SELECT date, course_handle AS "courseHandle", name AS "courseName", rating AS "courseRating", slope AS "courseSlope"
        FROM tournaments 
        JOIN courses ON tournaments.course_handle = courses.handle
        WHERE date = $1`,
      [tournamentDate]
    );

    const { courseRating, courseSlope } = courseRes.rows[0];

    const scoreDifferential = (
      (113 / courseSlope) *
      (totalStrokes - courseRating)
    ).toFixed(1);
    console.log("SCORE DIFFERENTIAL", scoreDifferential);

    /** Compute the player_index by querying the last 4 rounds for the player and taking the average of the lowest 2
     *  score_differentials (includes the current round scoring_differential) */
    const roundsRes = await db.query(
      `SELECT tournament_date AS "tournamentDate",
              score_differential AS "scoreDifferential" 
              FROM rounds 
              WHERE username=$1 
              ORDER BY tournament_date DESC LIMIT 4`,
      [username]
    );

    // make array of scoreDifferentials
    const scoreDiffs = roundsRes.rows.map((r) => +r.scoreDifferential);
    console.log("SCORE DIFFS", scoreDiffs);
    //sort from lowest to highest and slice to get the two lowest
    const lowestDiffs = scoreDiffs.sort((a, b) => a - b).slice(0, 2);
    console.log("LOWEST DIFFS", lowestDiffs);

    const playerIndex = (
      lowestDiffs.reduce((a, b) => a + b, 0) / lowestDiffs.length
    ).toFixed(1);
    console.log("PLAYER INDEX", playerIndex);

    /** Compute the course_handicap
     * (player_index * (course_slope)) / 113
     *
     */
    const courseHandicap = Math.round((playerIndex * courseSlope) / 113);
    console.log("COURSE HANDICAP", courseHandicap);

    /** Compute the net_strokes :
     * (total_strokes - course_handicap)
     */

    const netStrokes = totalStrokes - courseHandicap;
    console.log("NET STROKES", netStrokes);

    // Insert into rounds table first and grab the round_id
    const roundRes = await db.query(
      `INSERT INTO rounds
           (tournament_date, username, total_strokes, total_putts, score_differential, player_index, course_handicap, net_strokes)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           RETURNING id, tournament_date, username, total_strokes AS "totalStrokes", total_putts AS "totalPutts" `,
      [
        tournamentDate,
        username,
        totalStrokes,
        totalPutts,
        scoreDifferential,
        playerIndex,
        courseHandicap,
        netStrokes,
      ]
    );
    console.log("ROUND ID", roundRes.rows[0].id);

    const roundId = roundRes.rows[0].id;

    const strokesRes = await db.query(
      `INSERT INTO strokes
        (round_id, hole1, hole2, hole3, hole4, hole5, hole6, hole7, hole8, hole9, hole10, hole11, hole12, hole13, hole14, hole15, hole16, hole17, hole18)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
        RETURNING hole1, hole2, hole3, hole4, hole5, hole6, hole7, hole8, hole9, hole10, hole11, hole12, hole13, hole14, hole15, hole16, hole17, hole18`,
      [
        roundId,
        strokes.hole1,
        strokes.hole2,
        strokes.hole3,
        strokes.hole4,
        strokes.hole5,
        strokes.hole6,
        strokes.hole7,
        strokes.hole8,
        strokes.hole9,
        strokes.hole10,
        strokes.hole11,
        strokes.hole12,
        strokes.hole13,
        strokes.hole14,
        strokes.hole15,
        strokes.hole16,
        strokes.hole17,
        strokes.hole18,
      ]
    );

    const puttsRes = await db.query(
      `INSERT INTO putts
        (round_id, hole1, hole2, hole3, hole4, hole5, hole6, hole7, hole8, hole9, hole10, hole11, hole12, hole13, hole14, hole15, hole16, hole17, hole18)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
        RETURNING hole1, hole2, hole3, hole4, hole5, hole6, hole7, hole8, hole9, hole10, hole11, hole12, hole13, hole14, hole15, hole16, hole17, hole18`,
      [
        roundId,
        putts.hole1,
        putts.hole2,
        putts.hole3,
        putts.hole4,
        putts.hole5,
        putts.hole6,
        putts.hole7,
        putts.hole8,
        putts.hole9,
        putts.hole10,
        putts.hole11,
        putts.hole12,
        putts.hole13,
        putts.hole14,
        putts.hole15,
        putts.hole16,
        putts.hole17,
        putts.hole18,
      ]
    );

    const round = roundRes.rows[0];

    round.strokes = strokesRes.rows[0];
    round.putts = puttsRes.rows[0];

    return round;
  }

  /** Find all rounds in database.
   *
   *
   * Returns [{ tournament_date, username, strokes, putts }, ...]
   *  where strokes is {hole1, hole2, hole3, ...}
   *  and putts is {hole1, hole2, hole3, ...}
   * */

  static async findAll() {
    const roundsRes = await db.query(
      `SELECT id, tournament_date, username, total_strokes, net_strokes, total_putts, player_index, score_differential, course_handicap
                   FROM rounds
                   ORDER BY net_strokes ASC`
    );

    const strokesRes = await db.query(
      `SELECT round_id AS "roundId",
                hole1, hole2, hole3, hole4, hole5, hole6, hole7, hole8, hole9,
                hole10, hole11, hole12, hole13, hole14, hole15, hole16, hole17, hole18
                FROM strokes`
    );

    const puttsRes = await db.query(
      `SELECT round_id AS "roundId",
                hole1, hole2, hole3, hole4, hole5, hole6, hole7, hole8, hole9,
                hole10, hole11, hole12, hole13, hole14, hole15, hole16, hole17, hole18
                FROM putts`
    );

    const rounds = roundsRes.rows;
    const strokes = strokesRes.rows;
    const putts = puttsRes.rows;

    // associate strokes and putts with each round based on roundId
    rounds.map((r) => {
      strokes.map((s) => {
        if (s.roundId === r.id) {
          //   delete s.roundId;
          r.strokes = s;
        }
      });
      putts.map((p) => {
        if (p.roundId === r.id) {
          //   delete p.roundId;
          r.putts = p;
        }
      });
    });

    return rounds;
  }

  /** Given a round_id, return data about that round.
   *
   * Returns { tournament_date, username, strokes, putts }
   *  where strokes is {hole1, hole2, hole3, ...}
   *  and putts is {hole1, hole2, hole3, ...}
   *
   * Throws NotFoundError if not found.
   **/

  static async get(id) {
    const roundRes = await db.query(
      `SELECT id, tournament_date AS "tournamentDate",
                  username, 
                  total_strokes AS "totalStrokes", 
                  net_strokes AS "netStrokes", 
                  total_putts AS "totalPutts", 
                  player_index AS "playerIndex", 
                  score_differential AS "scoreDifferential", 
                  course_handicap AS "courseHandicap"
            FROM rounds
            WHERE id = $1`,
      [id]
    );

    const round = roundRes.rows[0];

    if (!round) throw new NotFoundError(`No round: ${id}`);

    const strokesRes = await db.query(
      `SELECT hole1, hole2, hole3, hole4, hole5, hole6, hole7, hole8, hole9, hole10, hole11, hole12, hole13, hole14, hole15, hole16, hole17, hole18
             FROM strokes
             WHERE round_id = $1`,
      [id]
    );

    const puttsRes = await db.query(
      `SELECT hole1, hole2, hole3, hole4, hole5, hole6, hole7, hole8, hole9, hole10, hole11, hole12, hole13, hole14, hole15, hole16, hole17, hole18
             FROM putts
             WHERE round_id = $1`,
      [id]
    );

    round.strokes = strokesRes.rows[0];
    round.putts = puttsRes.rows[0];

    return round;
  }

  /** Update a round's strokes and putts `data`.
   *
   * More specifically, dynamically update the stokes and putts
   * for a round depending on which holes are present in `data`
   *
   *
   * This is a "partial update" --- it's fine if data doesn't contain all the
   * fields; this only changes provided ones.
   *
   * Data can include: {strokes, putts}
   *  where strokes could be any of {hole1, hole2, ..., hole18}
   *  and putts could be any of {hole1, hole2, ..., hole18}
   *
   * Returns { id, tournament_date, username, strokes, putts }
   *
   * Throws NotFoundError if not found.
   */

  static async update(id, data) {
    //Throw bad request error if data is empty
    if (Object.keys(data).length === 0) throw new BadRequestError("No data");

    const { strokes, putts } = data;

    // update the strokes table if data.strokes is provided
    if (strokes) {
      const { setCols, values } = sqlForPartialUpdate(strokes, {});

      const idVarIdx = "$" + (values.length + 1);

      const querySql = `UPDATE strokes
                          SET ${setCols}
                          WHERE round_id = ${idVarIdx}
                          RETURNING *`;
      const result = await db.query(querySql, [...values, id]);
      const strokes = result.rows[0];

      if (!strokes) throw new NotFoundError(`No round id: ${id}`);
    }

    // update the putts table if data.putts is provided
    if (putts) {
      const { setCols, values } = sqlForPartialUpdate(putts, {});

      const idVarIdx = "$" + (values.length + 1);

      const querySql = `UPDATE putts
                          SET ${setCols}
                          WHERE round_id = ${idVarIdx}
                          RETURNING *`;
      const result = await db.query(querySql, [...values, id]);
      const putts = result.rows[0];

      if (!putts) throw new NotFoundError(`No course handle: ${handle}`);
    }

    //call the get method to return the updated round data
    return Round.get(id);
  }

  static async remove(id) {
    const result = await db.query(
      `DELETE
             FROM rounds
             WHERE id = $1
             RETURNING id`,
      [handle]
    );
    const round = result.rows[0];

    if (!round) throw new NotFoundError(`No round id: ${id}`);
  }
}

module.exports = Round;
