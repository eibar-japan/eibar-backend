const chai = require("chai");
const assert = chai.assert;
// const router = require("../api/apiRouter");
const chaiHttp = require("chai-http");
const { v4: v4uuid, validate: validate_uuid } = require("uuid");
const { userFactory } = require("../../api/user/userUtil");
const { ERROR_DICT } = require("../../api/util/error_handling");
const { TOO_LONG_EMAIL, TOO_LONG_LAST_NAME } = require("./user/userUnitTest");
const jwt = require("jsonwebtoken");

chai.use(chaiHttp);

const { knex, app } = require("../../index");

describe("Registration and Login", () => {
  // CREATE
  let INPUT_USER_DATA;

  beforeEach(async () => {
    INPUT_USER_DATA = {
      email: "test4@example.com",
      first_name: "jane",
      last_name: "brewer",
      password: "Aa1aaaaa",
    };
    return knex("eibaruser").delete();
  });

  it("should register a new user for unused email address and login", () => {
    return chai
      .request(app)
      .post("/api/register")
      .send(INPUT_USER_DATA)
      .then((res) => {
        assert.equal(res.status, 200);

        // Body checks
        assert.typeOf(res.body, "Object");
        assert.equal(res.body.first_name, INPUT_USER_DATA.first_name);
        assert.equal(res.body.last_name, INPUT_USER_DATA.last_name);
        assert.equal(res.body.email, INPUT_USER_DATA.email);

        // Header checks (for auth token)
        assert(res.header.hasOwnProperty("auth-token"));
        let token = jwt.verify(
          res.header["auth-token"],
          process.env.JWT_SECRET
        );
        assert.equal(token.eid, res.body.eid);
        assert.equal(token.email, res.body.email);
        return knex("eibaruser")
          .select()
          .where({ email: INPUT_USER_DATA.email });
      })
      .then((rows) => {
        assert.equal(rows.length, 1);
        const CREATED_USER = rows[0];
        assert.equal(CREATED_USER.email, INPUT_USER_DATA.email);
        assert.equal(CREATED_USER.first_name, INPUT_USER_DATA.first_name);
        assert.equal(CREATED_USER.last_name, INPUT_USER_DATA.last_name);
      });
  });

  it("should register a new user in the database if email is available post-deletion", () => {
    let userEid = "";
    const requester = chai.request(app).keepOpen();
    // Create User
    return requester
      .post("/api/register")
      .send(INPUT_USER_DATA)
      .then((res) => {
        assert.equal(res.status, 200);
        userEid = res.body.eid;
        raw_token = res.header["auth-token"];

        // Delete user
        return requester
          .delete(`/api/user/${userEid}`)
          .set("auth-token", raw_token);
      })
      .then((res) => {
        assert.equal(res.status, 204);

        // Create again with names different but same email
        SECOND_INPUT_USER_DATA = {
          ...INPUT_USER_DATA,
          first_name: "John",
          last_name: "Other",
        };
        return requester.post("/api/register").send(SECOND_INPUT_USER_DATA);
      })
      .then((res) => {
        assert.equal(res.status, 200);
        assert.typeOf(res.body, "Object");

        // Get user data from DB for checks
        return knex("eibaruser")
          .select()
          .where({ email: INPUT_USER_DATA.email })
          .orderBy("created_at");
      })
      .then((rows) => {
        // 2 users exist (one with deleted_at, one without)
        const FIRST_USER = rows[0];
        const SECOND_USER = rows[1];

        assert.equal(rows.length, 2);
        assert.isNotNull(FIRST_USER.deleted_at);
        assert.isNull(SECOND_USER.deleted_at);
        assert.equal(SECOND_USER.email, SECOND_INPUT_USER_DATA.email);
        assert.equal(SECOND_USER.first_name, SECOND_INPUT_USER_DATA.first_name);
        assert.equal(SECOND_USER.last_name, SECOND_INPUT_USER_DATA.last_name);
      });
  });

  it("should fail to register a new user in the database if email is in use", () => {
    let userEid = "";
    const requester = chai.request(app).keepOpen();

    return requester
      .post("/api/register")
      .send(INPUT_USER_DATA)
      .then((res) => {
        assert.equal(res.status, 200);
        userEid = res.body.eid;
        // try to create same user again
        return requester.post("/api/register").send(INPUT_USER_DATA);
      })
      .then((res) => {
        assert.equal(res.status, 400);
        assert.equal(
          res.body.errors[0].code,
          ERROR_DICT.E0007_USER_EXISTS.error.code
        );
      });
  });

  it("should fail to register a new user (bad input)", () => {
    const requester = chai.request(app).keepOpen();

    INPUT_USER_DATA.email = TOO_LONG_EMAIL();

    return requester
      .post("/api/register")
      .send(INPUT_USER_DATA)
      .then((res) => {
        assert.equal(res.status, 400);
        assert.equal(
          res.body.errors[0].code,
          ERROR_DICT.E0005_USER_EMAIL_LONG.error.code
        );
        // try to create same user again
      });
  });

  it("should login an existing user", () => {
    const requester = chai.request(app).keepOpen();
    const loginBody = {
      email: INPUT_USER_DATA.email,
      password: INPUT_USER_DATA.password,
    };
    return requester
      .post("/api/register")
      .send(INPUT_USER_DATA)
      .then((res) => {
        assert.equal(res.status, 200);

        return requester.post("/api/login").send(loginBody); // try to create same user again
      })
      .then((res) => {
        assert.equal(res.status, 200);

        // Body checks
        assert.typeOf(res.body, "Object");
        assert.equal(res.body.first_name, INPUT_USER_DATA.first_name);
        assert.equal(res.body.last_name, INPUT_USER_DATA.last_name);
        assert.equal(res.body.email, INPUT_USER_DATA.email);

        // Header checks (for auth token)
        assert(res.header.hasOwnProperty("auth-token"));
        let token = jwt.verify(
          res.header["auth-token"],
          process.env.JWT_SECRET
        );
        assert.equal(token.eid, res.body.eid);
        assert.equal(token.email, res.body.email);
      });
  });

  it("should fail to login non-existant user", () => {
    const requester = chai.request(app).keepOpen();

    const loginBody = {
      email: "x" + INPUT_USER_DATA.email,
      password: INPUT_USER_DATA.password,
    };

    return requester
      .post("/api/register")
      .send(INPUT_USER_DATA)
      .then((res) => {
        assert.equal(res.status, 200);
        return requester.post("/api/login").send(loginBody); // try to create same user again
      })
      .then((res) => {
        assert.equal(res.status, 401);

        // Body checks
        assert.deepEqual(res.body, {});

        // Header checks (for auth token)
        assert(!res.header.hasOwnProperty("auth-token")); // header has no token
      });
  });

  it("should fail to login with wrong password", () => {
    const requester = chai.request(app).keepOpen();

    const loginBody = {
      email: INPUT_USER_DATA.email,
      password: "x" + INPUT_USER_DATA.password,
    };

    return requester
      .post("/api/register")
      .send(INPUT_USER_DATA)
      .then((res) => {
        assert.equal(res.status, 200);
        return requester.post("/api/login").send(loginBody); // try to create same user again
      })
      .then((res) => {
        assert.equal(res.status, 401);

        // Body checks
        assert.deepEqual(res.body, {});

        // Header checks (for auth token)
        assert(!res.header.hasOwnProperty("auth-token")); // header has no token
      });
  });
});
