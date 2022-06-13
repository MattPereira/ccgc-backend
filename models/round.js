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
   * Returns { tournament_date, username, strokes, putts }
   *
   * Throws BadRequestError if round already in database.
   * */

  static async create({ tournament_date, username, strokes, putts }) {
    //BLOCKS USER FROM INPUTTING MORE THAN ONE ROUND PER TOURNAMENT DATE
    const duplicateCheck = await db.query(
      `SELECT tournament_date, username
           FROM rounds
           WHERE tournament_date = $1 AND username = $2`,
      [tournament_date, username]
    );

    if (duplicateCheck.rows[0])
      throw new BadRequestError(
        `Members are only allowed to submit one round per tournament!`
      );

    // Insert into rounds table first and grabe the round_id
    const roundRes = await db.query(
      `INSERT INTO rounds
           (tournament_date, username)
           VALUES ($1, $2)
           RETURNING id, tournament_date, username`,
      [tournament_date, username]
    );

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

    const round = roundRes.rows[0];

    round.strokes = strokesRes.rows[0];
    round.putts = puttsRes.rows[0];

    return round;
  }

  /** Find all rounds for a tournament using tournament_date.
   *
   *
   * Returns [{ tournament_date, username, strokes, putts }, ...]
   *  where strokes is {hole1, hole2, hole3, ...}
   *  and putts is {hole1, hole2, hole3, ...}
   * */

  static async findAll(tournamentDate) {
    const roundsRes = await db.query(
      `SELECT id, tournament_date, username
                   FROM rounds
                   WHERE tournament_date = $1`,
      [tournamentDate]
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
      `SELECT id, tournament_date, username
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
