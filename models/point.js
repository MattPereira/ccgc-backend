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
  /** Create a points table row for a round
   *
   *  called when a new round is created
   *
   */
  static async create(round) {
    //figure out pars, birdies, eagles, aces

    const parsRes = await db.query(
      `SELECT hole1, hole2, hole3, hole4, hole5, hole6, hole7, hole8, hole9, hole10, hole11, hole12, hole13, hole14, hole15, hole16, hole17, hole18
         FROM pars
         JOIN courses ON courses.handle=pars.course_handle
         JOIN tournaments ON courses.handle=tournaments.course_handle
         WHERE tournaments.date=$1`,
      [round.tournamentDate]
    );

    //create array of 18 par values from the parsRes
    const parsArr = Object.values(parsRes.rows[0]);

    console.log("PARS ARR", parsArr);

    const pars = 1;
    const birdies = 2;
    const eagles = 3;
    const aces = 4;

    const pointsRes = await db.query(
      `INSERT INTO points 
          (round_id, 
          participation, 
          pars, 
          birdies, 
          eagles, 
          aces)
            VALUES ($1, $2, $3, $4, $5, $6)`,
      [round.id, 3, pars, birdies, eagles, aces]
    );

    return pointsRes.rows[0];
  }

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
      `SELECT users.username,
              first_name AS "firstName",
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
   * handle updating all the strokes points for a given tournamentDate
   *
   * call it on each round create/update?
   *
   * what happens when a round is deleted?
   * */

  static async updateStrokes(tournamentDate) {
    /********* Update the points table column "strokes" **************/

    // insert into points the roundIds with corresponding point values based on finishing position
    // select all the roundIds for that date ordered by net_strokes from lowest to highest
    const strokesPosRes = await db.query(
      `SELECT id, net_strokes FROM rounds WHERE tournament_date=$1 ORDER BY net_strokes, total_strokes ASC`,
      [tournamentDate]
    );

    //make array of roundIds ordered from lowest to highest net_strokes
    const strokesIds = strokesPosRes.rows.map((r) => r.id);
    console.log("STROKES IDS", strokesIds);
    //array of points to be awarded for each roundId by finishing position
    const strokesPoints = [25, 20, 15, 10, 5];

    for (let i = 0; i < strokesIds.length; i++) {
      if (i < strokesPoints.length) {
        await db.query(`UPDATE points SET strokes=$1 WHERE round_id=$2`, [
          strokesPoints[i],
          strokesIds[i],
        ]);
      } else {
        //else block will handle removal of points from roundIds that are no longer top 5
        await db.query(`UPDATE points SET strokes=$1 WHERE round_id=$2`, [
          0,
          strokesIds[i],
        ]);
      }
    }

    /*********Query points table for the return statement**************/
    const pointsRes = await db.query(
      `SELECT round_id, username, strokes
          FROM points JOIN rounds
          ON rounds.id=points.round_id
          WHERE tournament_date=$1`,
      [tournamentDate]
    );

    return pointsRes.rows;
  }

  /**
   * handle the updating of all the putts points for a tournamentDate
   *
   * call on each round create/update and delete?
   *
   */
  static async updatePutts(tournamentDate) {
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
  }

  /**
   * handle the updating of greenie points for a tournament
   *
   * call on each round create/update
   *
   */
  static async updateGreenies(tournamentDate) {
    /*********Update the points table column "greenies" **************/

    //have to figure out some way to sum greenies points before updating points column greenies

    const greeniesRes = await db.query(
      `SELECT rounds.id AS "roundId", username, feet FROM rounds
        JOIN greenies ON rounds.id=greenies.round_id
        WHERE tournament_date=$1`,
      [tournamentDate]
    );

    //array of objects containing roundId and points per greenie depending on feet
    const greenieObjs = greeniesRes.rows.map((g) => {
      let total = 1;
      if (g.feet < 20 && g.feet >= 10) total += 1;
      if (g.feet < 10 && g.feet >= 2) total += 2;
      if (g.feet < 2) total += 3;
      return { roundId: g.roundId, points: total };
    });

    console.log("GREENIE OBJS", greenieObjs);

    //reduce the greenieObjs to sum the points for each unique roundId
    const reducedGreenieObjs = greenieObjs.reduce((acc, item) => {
      //item points at each obj in array
      const { roundId, points } = item;
      //does roundId exist in intial object?
      if (acc[roundId]) {
        acc[roundId] += points;
      } else {
        acc[roundId] = points;
      }
      return acc;
    }, {});

    //reformat the reducedGreenieObjs
    const finalGreenieObj = Object.keys(reducedGreenieObjs).map((k) => ({
      roundId: k,
      points: reducedGreenieObjs[k],
    }));

    for (let greenie of finalGreenieObj) {
      await db.query(`UPDATE points SET greenies=$1 WHERE round_id=$2`, [
        greenie.points,
        greenie.roundId,
      ]);
    }

    //NO LONGER NECESSARY WITH POINT MODEL CHANGES
    //DELETION NOW HANDLED ON GREENIE DELETE ROUTE SOMEHOW?
    //EDGE CASE: deleting last existing greenie for a roundId will not remove the greenie points
    // const greenieRoundIds = greeniesRes.rows.map((g) => g.roundId);
    //strokesId contains all roundIds for the tournament_date
    // const nonGreenieRoundIds = strokesIds.filter(
    //   (id) => !greenieRoundIds.includes(id)
    // );

    // console.log("NON GREENIE ROUND IDS", nonGreenieRoundIds);

    // for (let id of nonGreenieRoundIds) {
    //   await db.query(`UPDATE points SET greenies=$1 WHERE round_id=$2`, [
    //     0,
    //     id,
    //   ]);
    // }
  }

  /**
   * Update pars, birdies, eagles and aces points
   *
   *  called each time a round is created or updated or deleted?
   *
   */
  static async updateScores(tournamentDate) {
    /*********Update the points table columns pars, birdies, eagles, aces **************/
    //grab the pars for each hole for the course played using the tournamentDate
    const parsRes = await db.query(
      `SELECT hole1, hole2, hole3, hole4, hole5, hole6, hole7, hole8, hole9, hole10, hole11, hole12, hole13, hole14, hole15, hole16, hole17, hole18
         FROM pars
         JOIN courses ON courses.handle=pars.course_handle
         JOIN tournaments ON courses.handle=tournaments.course_handle
         WHERE tournaments.date=$1`,
      [tournamentDate]
    );

    //create array of 18 par values from the parsRes
    const parsArr = Object.values(parsRes.rows[0]);

    console.log("PARS ARR", parsArr);

    //grab the roundId and strokes for each round for the tournamentDate
    const strokesRes = await db.query(
      `SELECT round_id, hole1, hole2, hole3, hole4, hole5, hole6, hole7, hole8, hole9, hole10, hole11, hole12, hole13, hole14, hole15, hole16, hole17, hole18
         FROM strokes
         JOIN rounds ON rounds.id=strokes.round_id
         WHERE rounds.tournament_date=$1`,
      [tournamentDate]
    );

    //array of objects containing roundId and strokes
    const roundsArr = strokesRes.rows.map((s) => {
      return {
        roundId: Object.values(s)[0],
        strokes: Object.values(s).slice(1, 19),
      };
    });

    console.log("ROUNDS ARR", roundsArr);

    // console.log("ROUNDS ARR", roundsArr);

    for (let round of roundsArr) {
      // console.log("ROUND STROKES", round.strokes);
      //count the pars and birdies
      let parCount = 0;
      let birdyCount = 0;
      let eagleCount = 0;
      let aceCount = 0;
      for (let i = 0; i < round.strokes.length; i++) {
        if (round.strokes[i] === parsArr[i]) {
          parCount += 1;
        }
        if (round.strokes[i] === parsArr[i] - 1) {
          birdyCount += 1;
        }
        if (round.strokes[i] === parsArr[i] - 2) {
          eagleCount += 1;
        }
        if (round.strokes[i] === 1) {
          aceCount += 1;
        }
      }
      //Update pars, birdies, eagles, and aces including the bonus multiplier
      await db.query(
        `UPDATE points SET pars=$1, birdies=$2, eagles=$3, aces=$4 WHERE round_id=$5`,
        [parCount, birdyCount * 2, eagleCount * 4, aceCount * 10, round.roundId]
      );
    }
  }

  /** UPDATE ALL
   *
   * special method for updating points table based on
   *  previously seeded greenie and round scores(pars, birdies, ...) data
   *
   * only called through patch request to "/points/all"
   *
   */

  static async updateSeededData(tournamentDate) {
    /*********Update the points table column "greenies" **************/

    //have to figure out some way to sum greenies points before updating points column greenies

    const greeniesRes = await db.query(
      `SELECT rounds.id AS "roundId", username, feet FROM rounds
        JOIN greenies ON rounds.id=greenies.round_id
        WHERE tournament_date=$1`,
      [tournamentDate]
    );

    //array of objects containing roundId and points per greenie depending on feet
    const greenieObjs = greeniesRes.rows.map((g) => {
      let total = 1;
      if (g.feet < 20 && g.feet >= 10) total += 1;
      if (g.feet < 10 && g.feet >= 2) total += 2;
      if (g.feet < 2) total += 3;
      return { roundId: g.roundId, points: total };
    });

    console.log("GREENIE OBJS", greenieObjs);

    //reduce the greenieObjs to sum the points for each unique roundId
    const reducedGreenieObjs = greenieObjs.reduce((acc, item) => {
      //item points at each obj in array
      const { roundId, points } = item;
      //does roundId exist in intial object?
      if (acc[roundId]) {
        acc[roundId] += points;
      } else {
        acc[roundId] = points;
      }
      return acc;
    }, {});

    //reformat the reducedGreenieObjs
    const finalGreenieObj = Object.keys(reducedGreenieObjs).map((k) => ({
      roundId: k,
      points: reducedGreenieObjs[k],
    }));

    for (let greenie of finalGreenieObj) {
      await db.query(`UPDATE points SET greenies=$1 WHERE round_id=$2`, [
        greenie.points,
        greenie.roundId,
      ]);
    }

    //OBSOLETE CODE
    //EDGE CASE: deleting last existing greenie for a roundId will not remove the greenie points
    // const greenieRoundIds = greeniesRes.rows.map((g) => g.roundId);
    //strokesId contains all roundIds for the tournament_date
    // const nonGreenieRoundIds = strokesIds.filter(
    //   (id) => !greenieRoundIds.includes(id)
    // );

    // console.log("NON GREENIE ROUND IDS", nonGreenieRoundIds);

    // for (let id of nonGreenieRoundIds) {
    //   await db.query(`UPDATE points SET greenies=$1 WHERE round_id=$2`, [
    //     0,
    //     id,
    //   ]);
    // }

    /*********Update the points table columns pars, birdies, eagles, aces **************/
    //grab the pars for each hole for the course played using the tournamentDate
    const parsRes = await db.query(
      `SELECT hole1, hole2, hole3, hole4, hole5, hole6, hole7, hole8, hole9, hole10, hole11, hole12, hole13, hole14, hole15, hole16, hole17, hole18
         FROM pars
         JOIN courses ON courses.handle=pars.course_handle
         JOIN tournaments ON courses.handle=tournaments.course_handle
         WHERE tournaments.date=$1`,
      [tournamentDate]
    );

    //create array of 18 par values from the parsRes
    const parsArr = Object.values(parsRes.rows[0]);

    console.log("PARS ARR", parsArr);

    //grab the roundId and strokes for each round for the tournamentDate
    const strokesRes = await db.query(
      `SELECT round_id, hole1, hole2, hole3, hole4, hole5, hole6, hole7, hole8, hole9, hole10, hole11, hole12, hole13, hole14, hole15, hole16, hole17, hole18
         FROM strokes
         JOIN rounds ON rounds.id=strokes.round_id
         WHERE rounds.tournament_date=$1`,
      [tournamentDate]
    );

    //array of objects containing roundId and strokes
    const roundsArr = strokesRes.rows.map((s) => {
      return {
        roundId: Object.values(s)[0],
        strokes: Object.values(s).slice(1, 19),
      };
    });

    console.log("ROUNDS ARR", roundsArr);

    // console.log("ROUNDS ARR", roundsArr);

    for (let round of roundsArr) {
      // console.log("ROUND STROKES", round.strokes);
      //count the pars and birdies
      let parCount = 0;
      let birdyCount = 0;
      let eagleCount = 0;
      let aceCount = 0;
      for (let i = 0; i < round.strokes.length; i++) {
        if (round.strokes[i] === parsArr[i]) {
          parCount += 1;
        }
        if (round.strokes[i] === parsArr[i] - 1) {
          birdyCount += 1;
        }
        if (round.strokes[i] === parsArr[i] - 2) {
          eagleCount += 1;
        }
        if (round.strokes[i] === 1) {
          aceCount += 1;
        }
      }
      //Update pars, birdies, eagles, and aces including the bonus multiplier
      await db.query(
        `UPDATE points SET pars=$1, birdies=$2, eagles=$3, aces=$4 WHERE round_id=$5`,
        [parCount, birdyCount * 2, eagleCount * 4, aceCount * 10, round.roundId]
      );
    }
  }
}
module.exports = Point;
