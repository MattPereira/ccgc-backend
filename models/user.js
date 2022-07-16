"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config.js");

/** Related functions for users. */

class User {
  /** authenticate user with email, password.
   *
   * Returns { username, email, first_name, last_name, bio, is_admin }
   *
   * Throws UnauthorizedError is user not found or wrong password.
   **/

  static async authenticate(email, password) {
    // try to find the user first
    const result = await db.query(
      `SELECT email,
                  password,
                  first_name AS "firstName",
                  last_name AS "lastName",
                  username,
                  bio,
                  is_admin AS "isAdmin"
           FROM users
           WHERE email = $1`,
      [email]
    );

    const user = result.rows[0];

    if (user) {
      // compare hashed password to a new hash from password
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid === true) {
        //remove user's password before sending back user
        delete user.password;
        return user;
      }
    }

    throw new UnauthorizedError("Invalid email/password");
  }

  /** Register user with data.
   *
   * Returns { username, email, firstName, lastName, bio, isAdmin }
   *
   * Throws BadRequestError on duplicates.
   **/

  static async register({ email, password, firstName, lastName, isAdmin }) {
    // Set username to be lowercase firstName-lastName to use for primary key
    const username = `${firstName}-${lastName}`.toLowerCase();

    const duplicateCheck = await db.query(
      `SELECT username
           FROM users
           WHERE username = $1`,
      [username]
    );

    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Duplicate email: ${email}`);
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    const result = await db.query(
      `INSERT INTO users
           (username,
            email,
            password,
            first_name,
            last_name,
            is_admin)
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING username, email, first_name AS "firstName", last_name AS "lastName", bio, is_admin AS "isAdmin"`,
      [username, email, hashedPassword, firstName, lastName, isAdmin]
    );

    const user = result.rows[0];

    return user;
  }

  /** Find all users.
   *
   * Returns [{ username, email, first_name, last_name, bio, is_admin }, ...]
   **/

  static async findAll() {
    const result = await db.query(
      `SELECT username,
                  email,
                  first_name AS "firstName",
                  last_name AS "lastName",
                  bio,
                  is_admin AS "isAdmin"
           FROM users
           ORDER BY username`
    );

    return result.rows;
  }

  /** Given a username, return basic data about user.
   *
   *  Returns { username, email, first_name, last_name, bio, is_admin }
   *
   *
   */

  static async get(username) {
    const userRes = await db.query(
      `SELECT username,
                  first_name AS "firstName",
                  last_name AS "lastName",
                  email,
                  bio,
                  is_admin AS "isAdmin"
           FROM users
           WHERE username = $1`,
      [username]
    );

    const user = userRes.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);

    return user;
  }

  /** Given a username, return data about user including all rounds played.
   *
   * Returns { username, first_name, last_name, is_admin, rounds}
   *   where rounds is [{ id, tournamentDate, pars, strokes, putts, greenies, totalStrokes, netStrokes, totalPutts }]
   *   where pars is { hole1, hole2, ..., hole18 }
   *   where strokes is { hole1, hole2, ..., hole18 }
   *   where putts is { hole1, hole2, ..., hole18 }
   *   where greenies is [{ id, roundId, tournamentDate, holeNumber, feet, inches, courseImg, courseName, firstName, lastName}, ...]
   *
   * Throws NotFoundError if user not found.
   **/

  static async getRounds(username) {
    const userRes = await db.query(
      `SELECT username,
                  first_name AS "firstName",
                  last_name AS "lastName",
                  email,
                  bio,
                  is_admin AS "isAdmin"
           FROM users
           WHERE username = $1`,
      [username]
    );

    const user = userRes.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);

    const userRoundsRes = await db.query(
      `SELECT id, 
              tournament_date AS "tournamentDate",
              course_handle AS "courseHandle",
              courses.name AS "courseName",
              total_strokes AS "totalStrokes",
              course_handicap AS "courseHandicap",
              player_index AS "playerIndex",
              net_strokes AS "netStrokes",
              total_putts AS "totalPutts"
           FROM rounds
           JOIN tournaments ON rounds.tournament_date = tournaments.date
           JOIN courses ON tournaments.course_handle = courses.handle
           WHERE username = $1
           ORDER BY tournament_date DESC`,
      [username]
    );

    //handles a user that has not played any rounds yet
    if (userRoundsRes.rows.length === 0) {
      return user;
    }

    user.rounds = userRoundsRes.rows;

    //map an array of roundIds and courseHandles to efficiently query strokes and putts and pars
    const roundsIds = user.rounds.map((r) => r.id);
    const courseHandles = user.rounds.map((r) => `'${r.courseHandle}'`);

    const strokesRes = await db.query(
      `SELECT *
          FROM strokes
          WHERE round_id IN (${roundsIds.join(", ")})`
    );

    const puttsRes = await db.query(
      `SELECT *
          FROM putts
          WHERE round_id IN (${roundsIds.join(", ")})`
    );
    const parsRes = await db.query(
      `SELECT *
          FROM pars
          WHERE course_handle IN (${courseHandles.join(", ")})`
    );

    const greeniesRes = await db.query(
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
            WHERE round_id IN (${roundsIds.join(", ")})
            ORDER BY hole_number`
    );

    const strokes = strokesRes.rows;
    const putts = puttsRes.rows;
    const pars = parsRes.rows;
    const greenies = greeniesRes.rows;

    //map strokes and putts data to user.rounds
    user.rounds.map((r) => {
      strokes.map((s) => {
        if (s.round_id === r.id) {
          delete s.round_id;
          r.strokes = s;
        }
      });
      putts.map((p) => {
        if (p.round_id === r.id) {
          delete p.round_id;
          r.putts = p;
        }
      });
      pars.map((p) => {
        if (p.course_handle === r.courseHandle) {
          // delete p.course_handle;
          r.pars = p;
        }
      });

      //make an array to push each greenie into
      r.greenies = [];
      greenies.map((g) => {
        if (g.roundId === r.id) {
          r.greenies.push(g);
        }
      });
    });

    //Had to wait to delete the course handles after the above map to avoid bug with
    //user playing more than one round at same course
    user.rounds.map((r) => {
      delete r.pars.course_handle;
    });

    return user;
  }

  /** Update user data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain
   * all the fields; this only changes provided ones.
   *
   * Data can include:
   *   { firstName, lastName, password, email, bio }
   *
   * Returns { username, firstName, lastName, email,bio, isAdmin }
   *
   * Throws NotFoundError if not found.
   *
   * WARNING: this function can set a new password or make a user an admin.
   * Callers of this function must be certain they have validated inputs to this
   * or a serious security risks are opened.
   */

  static async update(username, data) {
    if (Object.keys(data).length === 0) {
      throw new BadRequestError(`No data to update!`);
    }

    if (data.password) {
      data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
    }

    const { setCols, values } = sqlForPartialUpdate(data, {
      firstName: "first_name",
      lastName: "last_name",
      isAdmin: "is_admin",
    });
    const usernameVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE users 
                      SET ${setCols} 
                      WHERE username = ${usernameVarIdx} 
                      RETURNING username,
                                first_name AS "firstName",
                                last_name AS "lastName",
                                email,
                                bio,
                                is_admin AS "isAdmin"`;
    const result = await db.query(querySql, [...values, username]);
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);

    delete user.password;
    return user;
  }

  /** Delete given user from database; returns undefined. */

  static async remove(username) {
    let result = await db.query(
      `DELETE
           FROM users
           WHERE username = $1
           RETURNING username`,
      [username]
    );
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);
  }
}

module.exports = User;
