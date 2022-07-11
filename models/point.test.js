"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const Point = require("./point.js");
const parse = require("postgres-date");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testGreeniesIds,
  testRoundsIds,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */

describe("create", function () {
  test("works", async function () {
    const round = {
      id: testRoundsIds[0],
      tournamentDate: "2022-03-03",
      username: "u1",
      strokes: {
        hole1: 4,
        hole2: 4,
        hole3: 4,
        hole4: 4,
        hole5: 4,
        hole6: 4,
        hole7: 4,
        hole8: 4,
        hole9: 4,
        hole10: 4,
        hole11: 4,
        hole12: 4,
        hole13: 4,
        hole14: 4,
        hole15: 4,
        hole16: 4,
        hole17: 4,
        hole18: 4,
      },
      putts: {
        hole1: 1,
        hole2: 1,
        hole3: 1,
        hole4: 1,
        hole5: 1,
        hole6: 1,
        hole7: 1,
        hole8: 1,
        hole9: 1,
        hole10: 1,
        hole11: 1,
        hole12: 1,
        hole13: 1,
        hole14: 1,
        hole15: 1,
        hole16: 1,
        hole17: 1,
        hole18: 1,
      },
    };
    let points = await Point.createRound(round);
    expect(points).toEqual({
      round_id: testRoundsIds[0],
      participation: 3,
      pars: 18,
      birdies: 0,
      eagles: 0,
      aces: 0,
    });
  });

  test("bad request with duplicate round Id", async function () {
    try {
      const round = {
        id: testRoundsIds[0],
        tournamentDate: "2022-03-03",
        username: "u1",
        strokes: {
          hole1: 4,
          hole2: 4,
          hole3: 4,
          hole4: 4,
          hole5: 4,
          hole6: 4,
          hole7: 4,
          hole8: 4,
          hole9: 4,
          hole10: 4,
          hole11: 4,
          hole12: 4,
          hole13: 4,
          hole14: 4,
          hole15: 4,
          hole16: 4,
          hole17: 4,
          hole18: 4,
        },
        putts: {
          hole1: 1,
          hole2: 1,
          hole3: 1,
          hole4: 1,
          hole5: 1,
          hole6: 1,
          hole7: 1,
          hole8: 1,
          hole9: 1,
          hole10: 1,
          hole11: 1,
          hole12: 1,
          hole13: 1,
          hole14: 1,
          hole15: 1,
          hole16: 1,
          hole17: 1,
          hole18: 1,
        },
      };
      await Point.createRound(round);
      await Point.createRound(round);
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});
