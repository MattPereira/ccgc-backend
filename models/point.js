"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for tour points.
 *
 *
 * UHHHHHHHHHH ???
 *
 *
 * should i do everything in one massive method
 * or split up
 *
 * if i split, i have to worry about update points table instead of insert
 * which means i will have to know if the points row exists or not
 * or if i somehow create a points row with all columns defaulted to 0
 * then i only have to worry about updating the points rows?
 *
 * do i even need a seperate points model? or should i hang this all in one method
 * on the tournaments model?
 *
 * if wee keep all the point generation tied to each specific tournament_date
 * i think i can display a points leaderboard for each tournament
 *
 * HOW TO TRIGGER POINT GENERATION?
 * best idea i can think of is a button for admin user to push on
 * tournament details page?
 */

class Point {
  /**
   * handle adding points to strokes_position column of points table
   * */
  static async strokesPosition(tournamentDate) {
    // feed in some tournament date
    // select all the rounds for that date
    // order by net_strokes from lowest to highest
    // look at the first 5 rows and map the round ids into an array
    // insert into points that round id and however many points the finishing position should get?
  }

  /**
   * handle adding points to putts_position column of points table
   * */
  static async puttsPosition(tournamentDate) {
    // feed in some tournament date
    // select all the rounds for that date
    // order by total_putts from lowest to highest
    // look at the first 3 rows and map the round ids into an array
    // insert into points that round id and however many points the finishing position should get?
  }

  /**
   * handle adding points to participation column of points table
   * */
  static async participation(tournamentDate) {
    // feed in some tournament date
    // select all the rounds for that date
    // look at all the rows and map the round ids into an array
    // insert into points table that round id and 5 points for participation
    // OR JUST DEFAULT THE PARTICIPATION COLUMN TO 5???
  }

  /**
   * handle adding points to greenies column of points table
   * */
  static async greenies(tournamentDate) {
    // feed in some tournament date
    // select all the rounds for that date joined with the greenies table?
    const result = await db.query(
      `SELECT * FROM rounds 
      JOIN greenies ON rounds.id=greenies.id WHERE tournament_date='2021-09-12'`
    );

    //go through each row that is returned
    //and calculate how many greenie points each round_id should receive?
  }
}

module.exports = Point;
