const bcrypt = require("bcrypt");

const db = require("../db.js");
const { BCRYPT_WORK_FACTOR } = require("../config");

async function commonBeforeAll() {
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM rounds");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM tournaments");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM courses");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM users");

  //// TEST DATA FOR USERS ////
  await db.query(
    `
        INSERT INTO users(username,
                          password,
                          first_name,
                          last_name,
                          email,
                          bio)
        VALUES ('u1', $1, 'U1F', 'U1L', 'u1@gmail.com', 'u1 bio'),
               ('u2', $2, 'U2F', 'U2L', 'u2@gmail.com', 'u2 bio')
        RETURNING username`,
    [
      await bcrypt.hash("password1", BCRYPT_WORK_FACTOR),
      await bcrypt.hash("password2", BCRYPT_WORK_FACTOR),
    ]
  );

  //// TEST DATA FOR COURSES ////
  await db.query(`
        INSERT INTO courses(handle, name, rating, slope)
        VALUES ('roddy-ranch', 'Roddy Ranch Golf Course', 77.7, 111),
               ('pebble-beach', 'Pebble Beach Golf Course', 88.8, 123)`);

  //// TEST DATA FOR PARS ////
  await db.query(`
    INSERT INTO pars (course_handle, hole1, hole2, hole3, hole4, hole5, hole6, hole7, hole8, hole9, hole10, hole11, hole12, hole13, hole14, hole15, hole16, hole17, hole18)
    VALUES ('roddy-ranch', 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4),
           ('pebble-beach', 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5)`);

  //// TEST DATA FOR HANDICAPS ////
  await db.query(`
    INSERT INTO handicaps (course_handle, hole1, hole2, hole3, hole4, hole5, hole6, hole7, hole8, hole9, hole10, hole11, hole12, hole13, hole14, hole15, hole16, hole17, hole18)
    VALUES ('roddy-ranch', 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18),
           ('pebble-beach', 18,17,16,15,14,13,12,11,10,9,8,7,6,5,4,3,2,1)`);
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

module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
};
