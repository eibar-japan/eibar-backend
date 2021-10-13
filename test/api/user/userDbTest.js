const chai = require("chai");
const assert = chai.assert;
// const router = require("../api/apiRouter");
const chaiHttp = require("chai-http");
const { v4: v4uuid, validate: validate_uuid } = require("uuid");
const { userFactory } = require("../../../api/user/userUtil");
const { ERROR_DICT } = require("../../../api/util/error_handling");

chai.use(chaiHttp);

const { knex, app } = require("../../../index");

describe("User CRUD", () => {
  // CREATE
  let INPUT_USER_DATA;

  beforeEach(async () => {
    INPUT_USER_DATA = {
      email: "test4@example.com",
      first_name: "jane",
      last_name: "brewer",
    };
    return knex("eibaruser").delete();
  });

  it("should create a new user in the database for unused email address", () => {
    return chai
      .request(app)
      .post("/api/user")
      .send(INPUT_USER_DATA)
      .then((res) => {
        assert.equal(res.status, 200);
        assert.typeOf(res.body, "Object");

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

  it("should create a new user in the database if email is available post-deletion", () => {
    let userEid = "";
    const requester = chai.request(app).keepOpen();
    // Create User
    return requester
      .post("/api/user")
      .send(INPUT_USER_DATA)
      .then((res) => {
        assert.equal(res.status, 200);
        userEid = res.body.eid;
        // Delete user
        return requester.delete(`/api/user/${userEid}`);
      })
      .then((res) => {
        assert.equal(res.status, 204);

        // Create again with names different but same email
        SECOND_INPUT_USER_DATA = {
          ...INPUT_USER_DATA,
          first_name: "John",
          last_name: "Other",
        };
        return requester.post("/api/user").send(SECOND_INPUT_USER_DATA);
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

  it("should fail to create a new user in the database if email is existing", () => {
    let userEid = "";
    const requester = chai.request(app).keepOpen();

    return requester
      .post("/api/user")
      .send(INPUT_USER_DATA)
      .then((res) => {
        assert.equal(res.status, 200);
        userEid = res.body.eid;
        // try to create same user again
        return requester.post("/api/user").send(INPUT_USER_DATA);
      })
      .then((res) => {
        assert.equal(res.status, 400);
        assert.equal(
          res.body.errors[0].code,
          ERROR_DICT.E0007_USER_EXISTS.error.code
        );
      });
  });

  // UPDATE

  it("should update existing users in the database");

  // DELETE

  it("should delete an existing user from the database", () => {
    let userEid = "";
    const requester = chai.request(app).keepOpen();
    // Create User
    return requester
      .post("/api/user")
      .send(INPUT_USER_DATA)
      .then((res) => {
        userEid = res.body.eid;
        // Delete user
        return requester.delete(`/api/user/${userEid}`);
      })
      .then((res) => {
        assert.equal(res.status, 204);
        return knex("eibaruser").select().where({ eid: userEid });
      })
      .then((rows) => {
        assert.isNotNull(rows[0].deleted_at);
        assert.equal(rows[0].first_name, INPUT_USER_DATA.first_name);
        assert.equal(rows[0].last_name, INPUT_USER_DATA.last_name);
        assert.equal(rows[0].email, INPUT_USER_DATA.email);
      });
  });

  it("should fail to delete when passed EID is invalid format", () => {
    let userEid = "";
    const requester = chai.request(app).keepOpen();
    // Create User
    return requester
      .post("/api/user")
      .send(INPUT_USER_DATA)
      .then((res) => {
        const badEID = "INVALID_ID_NOT_UUID_FORMAT";
        return requester.delete(`/api/user/${badEID}`);
      })
      .then((res) => {
        assert.equal(res.status, 400);
        assert.equal(res.body.errors[0].code, "E0008");
      });
  });

  it("should fail to delete when UUID doesn't exist in DB", () => {
    let userEid = "";
    const requester = chai.request(app).keepOpen();
    // Create User
    return requester
      .post("/api/user")
      .send(INPUT_USER_DATA)
      .then((res) => {
        userEid = res.body.eid;
        const newUUID = v4uuid();
        // ensure explicitly that user's EID and this new random one are not equal
        assert.notEqual(userEid, newUUID);

        return requester.delete(`/api/user/${newUUID}`);
      })
      .then((res) => {
        assert.equal(res.status, 400);
        assert.equal(res.body.errors[0].code, "E0008");
      });
  });

  it("should fail to delete when EID belongs to already deleted user", () => {
    let userEid = "";
    const requester = chai.request(app).keepOpen();
    // Create User
    return requester
      .post("/api/user")
      .send(INPUT_USER_DATA)
      .then((res) => {
        userEID = res.body.eid;
        return requester.delete(`/api/user/${userEID}`);
      })
      .then((res) => {
        // first delete (succeeds)
        assert.equal(res.status, 204);
        return requester.delete(`/api/user/${userEID}`);
      })
      .then((res) => {
        // second delete fails
        assert.equal(res.status, 400);
        assert.equal(res.body.errors[0].code, "E0008");
      });
  });
});
