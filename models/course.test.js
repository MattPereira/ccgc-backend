"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const Course = require("./course.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */

describe("create", function () {
  const newCourse = {
    handle: "new-course",
    name: "New Course Country Club",
    rating: 71.2,
    slope: 122,
    pars: {
      hole1: 4,
      hole2: 3,
      hole3: 4,
      hole4: 3,
      hole5: 4,
      hole6: 3,
      hole7: 4,
      hole8: 3,
      hole9: 4,
      hole10: 3,
      hole11: 4,
      hole12: 3,
      hole13: 4,
      hole14: 3,
      hole15: 4,
      hole16: 3,
      hole17: 4,
      hole18: 3,
    },
    handicaps: {
      hole1: 1,
      hole2: 2,
      hole3: 3,
      hole4: 4,
      hole5: 5,
      hole6: 6,
      hole7: 7,
      hole8: 8,
      hole9: 9,
      hole10: 10,
      hole11: 11,
      hole12: 12,
      hole13: 13,
      hole14: 14,
      hole15: 15,
      hole16: 16,
      hole17: 17,
      hole18: 18,
    },
  };

  test("works", async function () {
    let course = await Course.create(newCourse);
    //WTF THE (DECIMAL TYPE) RATING IS CONVERTED TO STRING IN DB?!?
    expect(course).toEqual({ ...newCourse, rating: "71.2" });

    const courseResult = await db.query(
      `SELECT *
           FROM courses
           WHERE handle = 'new-course'`
    );
    const parsResult = await db.query(
      `SELECT hole1, hole2, hole3, hole4, hole5, hole6, hole7, hole8, hole9, hole10, hole11, hole12, hole13, hole14, hole15, hole16, hole17, hole18
            FROM pars
            WHERE course_handle = 'new-course'`
    );
    const handicapResult = await db.query(
      `SELECT hole1, hole2, hole3, hole4, hole5, hole6, hole7, hole8, hole9, hole10, hole11, hole12, hole13, hole14, hole15, hole16, hole17, hole18
            FROM handicaps
            WHERE course_handle = 'new-course'`
    );
    const testCourse = courseResult.rows[0];
    const pars = parsResult.rows[0];
    const handicaps = handicapResult.rows[0];
    testCourse.pars = pars;
    testCourse.handicaps = handicaps;

    expect(testCourse).toEqual({ ...newCourse, rating: "71.2" });
  });

  test("bad request with dupe", async function () {
    try {
      await Course.create(newCourse);
      await Course.create(newCourse);
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});
