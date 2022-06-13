"use strict";

const request = require("supertest");

const db = require("../db.js");
const app = require("../app");
const User = require("../models/user");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  happyToken,
  shooterToken,
  adminToken,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /users */

describe("POST /users", function () {
  test("works for admins: create non-admin", async function () {
    const resp = await request(app)
      .post("/users")
      .send({
        email: "new@gmail.com",
        password: "password-new",
        firstName: "newFirst",
        lastName: "newLast",
        isAdmin: false,
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      user: {
        username: "newfirst-newlast",
        firstName: "newFirst",
        lastName: "newLast",
        email: "new@gmail.com",
        bio: "Enthusiastic member of the Contra Costa Golf Club",
        isAdmin: false,
      },
      token: expect.any(String),
    });
  });

  test("works for admins: create admin", async function () {
    const resp = await request(app)
      .post("/users")
      .send({
        email: "new@gmail.com",
        password: "password-new",
        firstName: "newFirst",
        lastName: "newLast",
        isAdmin: true,
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      user: {
        username: "newfirst-newlast",
        firstName: "newFirst",
        lastName: "newLast",
        email: "new@gmail.com",
        bio: "Enthusiastic member of the Contra Costa Golf Club",
        isAdmin: true,
      },
      token: expect.any(String),
    });
  });

  test("unauth for users", async function () {
    const resp = await request(app)
      .post("/users")
      .send({
        email: "new@gmail.com",
        password: "password-new",
        firstName: "newFirst",
        lastName: "newLast",
        isAdmin: true,
      })
      .set("authorization", `Bearer ${happyToken}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app).post("/users").send({
      email: "new@gmail.com",
      password: "password-new",
      firstName: "newFirst",
      lastName: "newLast",
      isAdmin: false,
    });
    expect(resp.statusCode).toEqual(401);
  });

  test("bad request if missing data", async function () {
    const resp = await request(app)
      .post("/users")
      .send({
        email: "new@gmail.com",
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request if invalid data", async function () {
    const resp = await request(app)
      .post("/users")
      .send({
        email: "invalid-email",
        password: "password-new",
        firstName: "newFirst",
        lastName: "newLast",
        isAdmin: false,
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** GET /users */

describe("GET /users", function () {
  test("works", async function () {
    const resp = await request(app).get("/users");
    expect(resp.body).toEqual({
      users: [
        {
          username: "chubbs-peterson",
          firstName: "Chubbs",
          lastName: "Peterson",
          email: "chubbs@gmail.com",
          bio: "Enthusiastic member of the Contra Costa Golf Club",
          isAdmin: false,
        },
        {
          username: "happy-gilmore",
          firstName: "Happy",
          lastName: "Gilmore",
          email: "happy@gmail.com",
          bio: "Enthusiastic member of the Contra Costa Golf Club",
          isAdmin: false,
        },
        {
          username: "shooter-mcgavin",
          firstName: "Shooter",
          lastName: "McGavin",
          email: "user2@user.com",
          bio: "Enthusiastic member of the Contra Costa Golf Club",
          isAdmin: false,
        },
      ],
    });
  });

  test("fails: test next() handler", async function () {
    // there's no normal failure event which will cause this route to fail ---
    // but this will cause an error!
    await db.query("DROP TABLE users CASCADE");
    const resp = await request(app)
      .get("/users")
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(500);
  });
});

/************************************** GET /users/:username */

describe("GET /users/:username", function () {
  test("works", async function () {
    const resp = await request(app).get(`/users/happy-gilmore`);
    expect(resp.body).toEqual({
      user: {
        username: "happy-gilmore",
        firstName: "Happy",
        lastName: "Gilmore",
        email: "happy@gmail.com",
        bio: "Enthusiastic member of the Contra Costa Golf Club",
        isAdmin: false,
      },
    });
  });

  test("not found if user not found", async function () {
    const resp = await request(app).get(`/users/invalid-user`);
    expect(resp.statusCode).toEqual(404);
  });
});

/************************************** PATCH /users/:username */

describe("PATCH /users/:username", () => {
  test("works for admins", async function () {
    const resp = await request(app)
      .patch(`/users/happy-gilmore`)
      .send({
        firstName: "Sad",
        bio: "Sad member of the Contra Costa Golf Club",
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({
      user: {
        username: "happy-gilmore",
        firstName: "Sad",
        lastName: "Gilmore",
        email: "happy@gmail.com",
        bio: "Sad member of the Contra Costa Golf Club",
        isAdmin: false,
      },
    });
  });

  test("works for same user", async function () {
    const resp = await request(app)
      .patch(`/users/happy-gilmore`)
      .send({
        firstName: "Joyful",
        bio: "Joyful member of the Contra Costa Golf Club",
      })
      .set("authorization", `Bearer ${happyToken}`);
    expect(resp.body).toEqual({
      user: {
        username: "happy-gilmore",
        firstName: "Joyful",
        lastName: "Gilmore",
        email: "happy@gmail.com",
        bio: "Joyful member of the Contra Costa Golf Club",
        isAdmin: false,
      },
    });
  });

  test("unauth if not same user", async function () {
    const resp = await request(app)
      .patch(`/users/u1`)
      .send({
        firstName: "Stupid",
      })
      .set("authorization", `Bearer ${shooterToken}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app).patch(`/users/happy-gilmore`).send({
      firstName: "Funny",
    });
    expect(resp.statusCode).toEqual(401);
  });

  test("not found if no such user", async function () {
    const resp = await request(app)
      .patch(`/users/invalid-user`)
      .send({
        firstName: "Nope",
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(404);
  });

  test("bad request if invalid data", async function () {
    const resp = await request(app)
      .patch(`/users/happy-gilmore`)
      .send({
        firstName: 42,
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("works: can set new password", async function () {
    const resp = await request(app)
      .patch(`/users/happy-gilmore`)
      .send({
        password: "secret",
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({
      user: {
        username: "happy-gilmore",
        firstName: "Happy",
        lastName: "Gilmore",
        email: "happy@gmail.com",
        bio: "Enthusiastic member of the Contra Costa Golf Club",
        isAdmin: false,
      },
    });
    const isSuccessful = await User.authenticate("happy@gmail.com", "secret");
    expect(isSuccessful).toBeTruthy();
  });
});

/************************************** DELETE /users/:username */

describe("DELETE /users/:username", function () {
  test("works for admin", async function () {
    const resp = await request(app)
      .delete(`/users/happy-gilmore`)
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({ deleted: "happy-gilmore" });
  });

  test("unauth if not admin", async function () {
    const resp = await request(app)
      .delete(`/users/happy-gilmore`)
      .set("authorization", `Bearer ${happyToken}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app).delete(`/users/happy-gilmore`);
    expect(resp.statusCode).toEqual(401);
  });

  test("not found if user missing", async function () {
    const resp = await request(app)
      .delete(`/users/invalid-user`)
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(404);
  });
});
