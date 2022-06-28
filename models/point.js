"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for tour points.
 *
 *
 * ALL POINTS METHODS ARE SQL UPDATES (NO CREATE OR DELETE)
 * because points row for each round is created upon Round.create method
 *
 * do i even need a seperate points model? or should i hang this all in one method
 * on the tournaments model?
 *
 * if wee keep all the point generation tied to each specific tournament_date
 * i think i can display a points leaderboard for each tournament
 *
 * HOW TO TRIGGER POINT GENERATION?
 *
 */

class Point {
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

    // for (let greenie of greenieIdsAndPoints) {
    //   await db.query(`UPDATE points SET greenies=$1 WHERE round_id=$2`, [
    //     greenie[1],
    //     greenie[0],
    //   ]);
    // }

    const pointsRes = await db.query(
      `SELECT round_id, username, strokes, putts, tournament_date 
          FROM points JOIN rounds 
          ON rounds.id=points.round_id 
          WHERE tournament_date=$1`,
      [tournamentDate]
    );

    return greeniesRes.rows;
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
      `SELECT id FROM rounds 
      JOIN greenies ON rounds.id=greenies.id WHERE tournament_date='2021-09-12'`
    );

    //go through each row that is returned
    //and calculate how many greenie points each round_id should receive?
  }
}

module.exports = Point;
