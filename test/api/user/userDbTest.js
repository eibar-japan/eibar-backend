const chai = require("chai");
const assert = chai.assert;
// const router = require("../api/apiRouter");
const chaiHttp = require("chai-http");
const { v4: v4uuid, validate: validate_uuid } = require("uuid");
const { userFactory } = require("../../../api/user/userUtil");
const { ERROR_DICT } = require("../../../api/util/error_handling");
const badInput = require("./userUnitTest");

chai.use(chaiHttp);

const { knex, app } = require("../../../index");

describe("Operations on existing users", () => {
  // NOTE: registration and login is covered in the Auth test file.

  let requester, raw_token, userEid;

  beforeEach(async () => {
    requester = chai.request(app).keepOpen();
    INPUT_USER_DATA = {
      email: "test4@example.com",
      first_name: "jane",
      last_name: "brewer",
      password: "Aa1aaaaa",
    };
    return knex("eibaruser")
      .delete()
      .then((_) => {
        return requester.post("/api/register").send(INPUT_USER_DATA);
      })
      .then((res) => {
        userEid = res.body.eid;
        raw_token = res.header["auth-token"];
      });
  });

  // UPDATE

  it("should update existing users in the database (one field at a time)", () => {
    const newEmail = "newemail@test.com";
    const newFirstName = "newFirstName";
    const newLastName = "newLastName";
    // Create User

    patchBody = { first_name: newFirstName };
    return requester
      .patch(`/api/user/${userEid}`)
      .set("auth-token", raw_token)
      .send(patchBody)

      .then((res) => {
        assert.equal(res.body.first_name, newFirstName);

        patchBody = { last_name: newLastName };
        return requester
          .patch(`/api/user/${userEid}`)
          .set("auth-token", raw_token)
          .send(patchBody);
      })
      .then((res) => {
        assert.equal(res.body.last_name, newLastName);

        patchBody = { email: newEmail };
        return requester
          .patch(`/api/user/${userEid}`)
          .set("auth-token", raw_token)
          .send(patchBody);
      })
      .then((res) => {
        assert.equal(res.body.email, newEmail);

        return knex("eibaruser").select().where({ eid: userEid });
      })
      .then((rows) => {
        assert.isNull(rows[0].deleted_at);
        assert.equal(rows[0].first_name, newFirstName);
        assert.equal(rows[0].last_name, newLastName);
        assert.equal(rows[0].email, newEmail);
      });
  });

  it("should update existing users in the database (multiple fields at once)", () => {
    const newFirstName = "newFirstName";
    const newLastName = "newLastName";

    patchBody = { first_name: newFirstName, last_name: newLastName };
    return requester
      .patch(`/api/user/${userEid}`)
      .set("auth-token", raw_token)
      .send(patchBody)

      .then((res) => {
        assert.equal(res.body.first_name, newFirstName);
        assert.equal(res.body.last_name, newLastName);

        return knex("eibaruser").select().where({ eid: userEid });
      })
      .then((rows) => {
        assert.isNull(rows[0].deleted_at);
        assert.equal(rows[0].first_name, newFirstName);
        assert.equal(rows[0].last_name, newLastName);
        assert.equal(rows[0].email, INPUT_USER_DATA.email);
      });
  });

  it("should fail to update existing users in the database (bad input)", () => {
    const newEmail = badInput.TOO_LONG_EMAIL();
    const newFirstName = badInput.TOO_LONG_FIRST_NAME();
    const newLastName = badInput.TOO_LONG_LAST_NAME();

    patchBody = { first_name: newFirstName };
    return requester
      .patch(`/api/user/${userEid}`)
      .set("auth-token", raw_token)
      .send(patchBody)

      .then((res) => {
        assert.equal(res.status, 400);
        assert.deepEqual(
          res.body.errors[0],
          ERROR_DICT.E0002_USER_FIRST_NAME_LONG.error
        );

        patchBody = { last_name: newLastName };
        return requester
          .patch(`/api/user/${userEid}`)
          .set("auth-token", raw_token)
          .send(patchBody);
      })
      .then((res) => {
        assert.equal(res.status, 400);
        assert.deepEqual(
          res.body.errors[0],
          ERROR_DICT.E0004_USER_LAST_NAME_LONG.error
        );

        patchBody = { email: newEmail };
        return requester
          .patch(`/api/user/${userEid}`)
          .set("auth-token", raw_token)
          .send(patchBody);
      })
      .then((res) => {
        assert.equal(res.status, 400);
        assert.deepEqual(
          res.body.errors[0],
          ERROR_DICT.E0005_USER_EMAIL_LONG.error
        );

        return knex("eibaruser").select().where({ eid: userEid });
      })
      .then((rows) => {
        assert.isNull(rows[0].deleted_at);
        assert.equal(rows[0].first_name, INPUT_USER_DATA.first_name);
        assert.equal(rows[0].last_name, INPUT_USER_DATA.last_name);
        assert.equal(rows[0].email, INPUT_USER_DATA.email);
      });
  });

  // DELETE

  it("should delete an existing user from the database", () => {
    return requester
      .delete(`/api/user/${userEid}`)
      .set("auth-token", raw_token)

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
    const badEID = "INVALID_ID_NOT_UUID_FORMAT";

    return requester
      .delete(`/api/user/${badEID}`)
      .set("auth-token", raw_token)

      .then((res) => {
        assert.equal(res.status, 400);
        assert.equal(res.body.errors[0].code, "E0008");
      });
  });

  it("should fail to delete when UUID doesn't exist in DB", () => {
    const newUUID = v4uuid();
    // ensure explicitly that user's EID and this new random one are not equal
    assert.notEqual(userEid, newUUID);

    return requester
      .delete(`/api/user/${newUUID}`)
      .set("auth-token", raw_token)

      .then((res) => {
        assert.equal(res.status, 403); // 403 because token EID and passed EID do not match
      });
  });

  it("should fail to delete when EID belongs to already deleted user", () => {
    return requester
      .delete(`/api/user/${userEid}`)
      .set("auth-token", raw_token)

      .then((res) => {
        // first delete (succeeds)
        assert.equal(res.status, 204);

        return requester
          .delete(`/api/user/${userEid}`)
          .set("auth-token", raw_token);
      })
      .then((res) => {
        // second delete fails
        assert.equal(res.status, 400);
        assert.equal(res.body.errors[0].code, "E0008");
      });
  });
});
