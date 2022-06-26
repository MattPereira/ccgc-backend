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
           RETURNING round_id AS "roundId", hole_number AS "holeNumber", feet, inches`,
      [roundId, holeNumber, feet, inches]
    );

    const greenie = greenieRes.rows[0];

    return greenie;
  }

  /** Find all greenies
   * sorted by feet and inches
   * from shortest to longest distance
   *
   *  Optionally pass in a tournament_date
   *   to get only the greenies for a specific tournament
   *
   * Returns [{ roundId, holeNumber, feet, inches }, ...]
   *
   *
   * */

  static async findAll(date) {
    let query = `SELECT greenies.id, 
                  round_id AS "roundId", 
                  first_name AS "firstName",
                  last_name AS "lastName",
                  tournament_date AS "tournamentDate",
                  name AS "courseName",
                  img_url AS "courseImg",
                  hole_number AS "holeNumber", 
                  feet, 
                  inches
              FROM greenies
              JOIN rounds ON greenies.round_id = rounds.id
              JOIN tournaments ON rounds.tournament_date = tournaments.date
              JOIN courses ON tournaments.course_handle = courses.handle
              JOIN users ON rounds.username=users.username`;
    let queryValues = [];

    if (date !== undefined) {
      //order by hole_number if looking at a particular tournament
      query += " WHERE tournament_date = $1";
      queryValues.push(date);
      query += " ORDER BY hole_number, feet, inches";
    } else {
      //order by distance only if looking at all greenies
      query += " ORDER BY feet, inches";
    }

    const greeniesRes = await db.query(query, queryValues);

    return greeniesRes.rows;
  }

  /** Given a greenie id, return data about that particular greenie
   *
   * Returns { id, roundId, tournamentDate, courseName, holeNumber, feet, inches }
   *
   * Throws NotFoundError if not found.
   **/

  static async get(id) {
    const greenieRes = await db.query(
      `SELECT greenies.id, 
              round_id AS "roundId", 
              first_name AS "firstName",
              last_name AS "lastName",
              tournament_date AS "tournamentDate", 
              name AS "courseName", 
              hole_number AS "holeNumber", 
              img_url AS "courseImg",
              feet, 
              inches
          FROM greenies
          JOIN rounds ON greenies.round_id = rounds.id
          JOIN tournaments ON rounds.tournament_date = tournaments.date
          JOIN courses ON tournaments.course_handle = courses.handle
          JOIN users ON rounds.username=users.username
          WHERE greenies.id = $1`,
      [id]
    );

    const greenie = greenieRes.rows[0];

    return greenie;
  }

  /** Update a greenie with `data`.
   *
   * Data must include: {holeNumber, feet, inches}
   *
   * Returns {id, roundId, holeNumber, feet, inches}
   *
   * Throws NotFoundError if not found.
   */

  static async update(id, data) {
    const greenieRes = await db.query(
      `UPDATE greenies
      SET hole_number=$1, feet=$2, inches=$3
      WHERE id=$4
      RETURNING id, round_id AS "roundId", hole_number AS "holeNumber", feet, inches`,
      [data.holeNumber, data.feet, data.inches, id]
    );

    const greenie = greenieRes.rows[0];

    if (!greenie) throw new NotFoundError(`No greenie with id: ${id}`);

    return greenie;
  }

  /** Delete given greenie from the database; returns undefined.
   *
   * Throws NotFoundError if greenie not found.
   **/

  static async remove(id) {
    const result = await db.query(
      `DELETE
           FROM greenies
           WHERE id = $1
           RETURNING id`,
      [id]
    );
    const greenie = result.rows[0];

    if (!greenie) throw new NotFoundError(`No greenie with id: ${id}`);
  }
}

module.exports = Greenie;
