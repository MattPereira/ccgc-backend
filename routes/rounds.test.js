"use strict";

const request = require("supertest");

const app = require("../app");
const parse = require("postgres-date");
const db = require("../db");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  happyToken,
  shooterToken,
  adminToken,
  testRoundIds,
  testGreenieIds,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /round */

describe("POST /rounds", function () {
  const newRound = {
    tournamentDate: "2022-03-03",
    username: "chubbs-peterson",
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

  test("ok for logged in users", async function () {
    const resp = await request(app)
      .post("/rounds")
      .send(newRound)
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      round: {
        ...newRound,
        id: expect.any(Number),
        tournamentDate: "2022-03-03T08:00:00.000Z",
        totalStrokes: 72,
        totalPutts: 18,
      },
    });
  });

  test("unauth for anon", async function () {
    const resp = await request(app).post("/rounds").send(newRound);
    expect(resp.statusCode).toEqual(401);
  });

  test("bad request with missing data", async function () {
    const resp = await request(app)
      .post("/rounds")
      .send({
        tournamentDate: "2022-03-03",
        username: "chubbs-peterson",
        strokes: {
          hole1: 4,
          hole2: 4,
          hole3: 4,
          hole4: 4,
          hole5: 4,
        },
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request with invalid data", async function () {
    const resp = await request(app)
      .post("/rounds")
      .send({
        ...newRound,
        username: 12345,
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(400);
  });
});
