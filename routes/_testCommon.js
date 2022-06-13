"use strict";

const db = require("../db.js");
const User = require("../models/user");
const Course = require("../models/course");
const { createToken } = require("../helpers/tokens");

async function commonBeforeAll() {
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM users");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM rounds");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM tournaments");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM courses");

  /** CREATE SOME COURSES */
  await Course.create({
    handle: "lone-tree",
    name: "Lone Tree Golf Course",
    rating: "69.1",
    slope: 121,
    pars: {
      hole1: 4,
      hole2: 3,
      hole3: 4,
      hole4: 5,
      hole5: 4,
      hole6: 4,
      hole7: 4,
      hole8: 3,
      hole9: 4,
      hole10: 3,
      hole11: 3,
      hole12: 5,
      hole13: 4,
      hole14: 3,
      hole15: 4,
      hole16: 5,
      hole17: 5,
      hole18: 4,
    },
    handicaps: {
      hole1: 1,
      hole2: 13,
      hole3: 17,
      hole4: 9,
      hole5: 7,
      hole6: 15,
      hole7: 3,
      hole8: 11,
      hole9: 5,
      hole10: 16,
      hole11: 12,
      hole12: 2,
      hole13: 4,
      hole14: 18,
      hole15: 6,
      hole16: 8,
      hole17: 10,
      hole18: 14,
    },
  });

  await Course.create({
    handle: "paradise-valley",
    name: "Paradise Valley Golf Course",
    rating: "70.4",
    slope: 125,
    pars: {
      hole1: 5,
      hole2: 4,
      hole3: 3,
      hole4: 5,
      hole5: 4,
      hole6: 4,
      hole7: 4,
      hole8: 3,
      hole9: 4,
      hole10: 5,
      hole11: 4,
      hole12: 3,
      hole13: 4,
      hole14: 4,
      hole15: 3,
      hole16: 5,
      hole17: 4,
      hole18: 4,
    },
    handicaps: {
      hole1: 5,
      hole2: 7,
      hole3: 17,
      hole4: 9,
      hole5: 1,
      hole6: 3,
      hole7: 11,
      hole8: 15,
      hole9: 13,
      hole10: 4,
      hole11: 10,
      hole12: 18,
      hole13: 6,
      hole14: 14,
      hole15: 16,
      hole16: 8,
      hole17: 12,
      hole18: 2,
    },
  });

  await Course.create({
    handle: "wild-horse",
    name: "Wild Horse Golf Course",
    rating: "68.4",
    slope: 120,
    pars: {
      hole1: 4,
      hole2: 4,
      hole3: 4,
      hole4: 3,
      hole5: 5,
      hole6: 3,
      hole7: 5,
      hole8: 4,
      hole9: 4,
      hole10: 4,
      hole11: 4,
      hole12: 3,
      hole13: 5,
      hole14: 3,
      hole15: 4,
      hole16: 4,
      hole17: 5,
      hole18: 4,
    },
    handicaps: {
      hole1: 9,
      hole2: 15,
      hole3: 1,
      hole4: 7,
      hole5: 3,
      hole6: 17,
      hole7: 11,
      hole8: 5,
      hole9: 13,
      hole10: 18,
      hole11: 16,
      hole12: 10,
      hole13: 8,
      hole14: 14,
      hole15: 4,
      hole16: 12,
      hole17: 6,
      hole18: 2,
    },
  });

  /** REGISTER SOME USERS */
  await User.register({
    firstName: "Happy",
    lastName: "Gilmore",
    email: "happy@gmail.com",
    password: "password1",
    isAdmin: false,
  });
  await User.register({
    firstName: "Shooter",
    lastName: "McGavin",
    email: "user2@user.com",
    password: "password2",
    isAdmin: false,
  });
  await User.register({
    firstName: "Chubbs",
    lastName: "Peterson",
    email: "chubbs@gmail.com",
    password: "password3",
    isAdmin: false,
  });
}

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}

const happyToken = createToken({ username: "happy-gilmore", isAdmin: false });
const shooterToken = createToken({
  username: "shooter-mcgavin",
  isAdmin: false,
});
const adminToken = createToken({ username: "chubbs-peterson", isAdmin: true });

module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  happyToken,
  shooterToken,
  adminToken,
};
