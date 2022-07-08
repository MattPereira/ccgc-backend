"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const Greenie = require("./greenie.js");
const parse = require("postgres-date");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testGreenieIds,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */

describe("create", function () {
  const newGreenie = {
    roundId: 1,
    holeNumber: 11,
    feet: 11,
    inches: 11,
  };

  test("works", async function () {
    let greenie = await Greenie.create(newGreenie);
    expect(greenie).toEqual({
      ...newGreenie,
      id: expect.any(Number),
    });
  });

  test("bad request with dupe roundId/holeNumber combination", async function () {
    try {
      await Greenie.create(newGreenie);
      await Greenie.create(newGreenie);
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** findAll */

describe("findAll", function () {
  test("works: all ordered by distance", async function () {
    let greenies = await Greenie.findAll();
    console.log(testGreenieIds);
    expect(greenies).toEqual([
      {
        id: testGreenieIds[0],
        roundId: 1,
        holeNumber: 1,
        feet: 1,
        inches: 1,
        courseImg: "test.com/roddy-ranch.jpg",
        courseName: "Roddy Ranch Golf Course",
        firstName: "U1F",
        lastName: "U1L",
        tournamentDate: parse("2022-01-01"),
      },
      {
        id: testGreenieIds[1],
        roundId: 1,
        holeNumber: 7,
        feet: 7,
        inches: 7,
        courseImg: "test.com/roddy-ranch.jpg",
        courseName: "Roddy Ranch Golf Course",
        firstName: "U1F",
        lastName: "U1L",
        tournamentDate: parse("2022-01-01"),
      },
      {
        id: testGreenieIds[3],
        roundId: 4,
        holeNumber: 7,
        feet: 7,
        inches: 7,
        courseImg: "test.com/pebble-beach.jpg",
        courseName: "Pebble Beach Golf Course",
        firstName: "U2F",
        lastName: "U2L",
        tournamentDate: parse("2022-02-02"),
      },
      {
        id: testGreenieIds[2],
        roundId: 2,
        holeNumber: 1,
        feet: 11,
        inches: 11,
        courseImg: "test.com/roddy-ranch.jpg",
        courseName: "Roddy Ranch Golf Course",
        firstName: "U2F",
        lastName: "U2L",
        tournamentDate: parse("2022-01-01"),
      },
    ]);
  });
  test("works: all for one tournament date", async function () {
    let greenies = await Greenie.findAll("2022-02-02");
    expect(greenies).toEqual([
      {
        id: testGreenieIds[3],
        roundId: 4,
        holeNumber: 7,
        feet: 7,
        inches: 7,
        courseImg: "test.com/pebble-beach.jpg",
        courseName: "Pebble Beach Golf Course",
        firstName: "U2F",
        lastName: "U2L",
        tournamentDate: parse("2022-02-02"),
      },
    ]);
  });
});

/************************************** get */

describe("get", function () {
  test("works", async function () {
    let greenie = await Greenie.get(testGreenieIds[0]);
    expect(greenie).toEqual({
      id: testGreenieIds[0],
      roundId: 1,
      holeNumber: 1,
      feet: 1,
      inches: 1,
      courseImg: "test.com/roddy-ranch.jpg",
      courseName: "Roddy Ranch Golf Course",
      firstName: "U1F",
      lastName: "U1L",
      tournamentDate: parse("2022-01-01"),
    });
  });

  test("not found if no such greenie", async function () {
    try {
      await Greenie.get(0);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** update */

describe("update", function () {
  const updateData = {
    feet: 22,
    inches: 2,
  };

  test("works", async function () {
    let greenie = await Greenie.update(testGreenieIds[0], updateData);
    expect(greenie).toEqual({
      id: testGreenieIds[0],
      roundId: 1,
      holeNumber: 1,
      feet: 22,
      inches: 2,
    });
  });

  test("not found if no such greenie", async function () {
    try {
      const test = await Greenie.update(0, updateData);
      console.log(test);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("bad request with no data", async function () {
    try {
      await Greenie.update(testGreenieIds[0], {});
      fail();
    } catch (err) {
      console.log(err);
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** remove */

describe("remove", function () {
  test("works", async function () {
    await Greenie.remove(testGreenieIds[0]);
    const res = await db.query("SELECT id FROM greenies WHERE id=$1", [
      testGreenieIds[0],
    ]);
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such greenie", async function () {
    try {
      await Greenie.remove(0);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
