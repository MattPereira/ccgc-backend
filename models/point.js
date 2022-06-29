"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for tour points.
 *
 *
 * ALL POINT MODEL METHODS ARE SQL UPDATES (NO CREATE OR DELETE)
 * because points row for each round is created with the Round model
 * .create method
 *
 * do i even need a seperate points model? or should i hang this all in one method
 * on the tournaments model?
 *
 * if wee keep all the point generation tied to each specific tournament_date
 * i think i can display a points leaderboard for each tournament
 *
 * HOW TO TRIGGER POINT GENERATION?
 *
 * Considering loop to manually trigger for seeded data
 * then copy db and push to heroku
 *
 * but after that update will only be called each time a new round is created?
 *
 */

class Point {
  /** Find all points
   *
   * sum the column values and group by username
   *
   * */
  static async getStandings() {
    const standingsRes = await db.query(
      `SELECT rounds.username,
              first_name AS "firstName",
              last_name AS "lastName",
            SUM(participation) AS "participations",
            SUM(strokes) AS "strokes", 
            SUM(putts) AS "putts", 
            SUM(greenies) AS "greenies", 
            SUM(pars) AS "pars", 
            SUM(birdies) AS "birdies", 
            SUM(eagles) AS "eagles", 
            SUM(aces) AS "aces",
            (SUM(strokes) + SUM(putts) + SUM(greenies) + SUM(participation) + SUM(pars) + SUM(birdies) + SUM(eagles) + SUM(aces)) AS "total"
          FROM points 
          JOIN rounds ON points.round_id=rounds.id
          JOIN users ON rounds.username=users.username
          GROUP BY rounds.username, last_name, first_name
          ORDER BY total DESC;`
    );

    return standingsRes.rows;
  }

  /** Find all points for a specific tournament_date
   *
   * sum the columns
   *
   *
   *
   * */
  static async getByTournament(tournamentDate) {
    const result = await db.query(
      `SELECT first_name AS "firstName",
              last_name AS "lastName",
              participation,
              strokes,
              putts,
              greenies,
              pars,
              birdies, 
              eagles, 
              aces,
              (strokes + putts + greenies + participation + pars + birdies + eagles + aces) AS "total"
            FROM points 
            JOIN rounds ON points.round_id=rounds.id 
            JOIN users ON rounds.username=users.username
            WHERE tournament_date = $1
            ORDER BY total DESC`,
      [tournamentDate]
    );

    return result.rows;
  }

  /**
   * handle updating points table by tournament_date?
   * */
  static async update(tournamentDate) {
    /********* Update the points table column "strokes" **************/

    // insert into points the roundIds and appropriate number of points based on finishing position
    // select all the roundIds for that date ordered by net_strokes from lowest to highest
    const strokesPosRes = await db.query(
      `SELECT id, net_strokes FROM rounds WHERE tournament_date=$1 ORDER BY net_strokes ASC`,
      [tournamentDate]
    );

    //make array of roundIds ordered from lowest to highest net_strokes
    const strokesIds = strokesPosRes.rows.map((r) => r.id);
    //array of points to be awarded for each roundId by finishing position
    const strokesPoints = [25, 20, 15, 10, 5];

    for (let i = 0; i < strokesIds.length; i++) {
      if (i < strokesPoints.length) {
        await db.query(`UPDATE points SET strokes=$1 WHERE round_id=$2`, [
          strokesPoints[i],
          strokesIds[i],
        ]);
      } else {
        //else block will handle removal of points from roundIds that are not longer top 5
        await db.query(`UPDATE points SET strokes=$1 WHERE round_id=$2`, [
          0,
          strokesIds[i],
        ]);
      }
    }

    /*********Update the points table column "putts" **************/
    const puttsPosRes = await db.query(
      `SELECT id, total_putts FROM rounds WHERE tournament_date=$1 ORDER BY total_putts ASC`,
      [tournamentDate]
    );

    //make array of roundIds ordered from lowest to highest total_putts
    const puttsIds = puttsPosRes.rows.map((r) => r.id);
    //array of points to be awarded for each roundId by finishing position
    const puttsPoints = [6, 4, 2];

    for (let i = 0; i < puttsIds.length; i++) {
      if (i < puttsPoints.length) {
        await db.query(`UPDATE points SET putts=$1 WHERE round_id=$2`, [
          puttsPoints[i],
          puttsIds[i],
        ]);
      } else {
        //else block will handle removal of points from roundIds that are not longer top 5
        await db.query(`UPDATE points SET putts=$1 WHERE round_id=$2`, [
          0,
          puttsIds[i],
        ]);
      }
    }

    /*********Update the points table column "greenies" **************/

    //have to figure out some way to sum greenies points before updating points column greenies

    const greeniesRes = await db.query(
      `SELECT rounds.id AS "roundId", username, feet FROM rounds
        JOIN greenies ON rounds.id=greenies.round_id
        WHERE tournament_date=$1`,
      [tournamentDate]
    );

    //now we have an array of objects containing roundId and feet
    //need to insert into points table at roundId the appropriate number of points based on feet
    //trying to build nested array like [[1,3], [4, 1], [10, 5]]
    //where the first index of the nested array is the roundId and the second index is the total number of greenie points
    const greenieIdsAndPoints = greeniesRes.rows.map((g) => {
      let total = 1;
      if (g.feet < 20 && g.feet >= 10) total += 1;
      if (g.feet < 10 && g.feet >= 2) total += 2;
      if (g.feet < 2) total += 3;
      return { roundId: g.roundId, points: total };
    });
    console.log(greenieIdsAndPoints);

    //THIS DOES NOT HANDLE DELETION OF A GREENIE TO TAKE AWAY POINTS!!!
    //THIS DOES NOT HANDLE MULTIPLE GREENIES NEEDING TO BE SUMMED UP
    for (let greenie of greenieIdsAndPoints) {
      await db.query(`UPDATE points SET greenies=$1 WHERE round_id=$2`, [
        greenie.points,
        greenie.roundId,
      ]);
    }

    /*********Query points table for the return statement**************/
    const pointsRes = await db.query(
      `SELECT round_id, username, participation, strokes, putts, greenies, pars, birdies, eagles 
          FROM points JOIN rounds 
          ON rounds.id=points.round_id 
          WHERE tournament_date=$1`,
      [tournamentDate]
    );

    return pointsRes.rows;
  }
}

module.exports = Point;
