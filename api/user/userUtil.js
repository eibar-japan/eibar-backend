const { v4: uuidv4, validate: validate_uuid } = require("uuid");
const SCHEMA = require("../util/schema_constants");
const { mapSchemaErrors } = require("../util/schema_common");
const Joi = require("joi");
const joiOptions = {
  abortEarly: false, // report all errors in schema
  render: false, // stops creation of Joi-formatted error message for performance
};
const {
  EibarError,
  ERROR_DICT,
  customMessageError,
  genericEibarErrorHandler,
} = require("../util/error_handling");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// TODO advanced: redo these schemas to eliminate DRY.
// Create base schema, then create New and Update with simple additions.

const userSchemaBase = Joi.object({
  // eid not checked beyond string, as it will only
  eid: Joi.string(),
  email: Joi.string()
    .max(SCHEMA.USER_EMAIL_MAX_LENGTH)
    .email()
    .alter({
      post: (schema) => schema.required(),
      patch: (schema) => schema.optional(),
      login: (schema) => schema.required(),
    }),
  first_name: Joi.string()
    .alphanum()
    .min(SCHEMA.USER_FIRST_NAME_MIN_LENGTH)
    .max(SCHEMA.USER_FIRST_NAME_MAX_LENGTH)
    .alter({
      post: (schema) => schema.required(),
      patch: (schema) => schema.optional(),
      login: (schema) => schema.forbidden(),
    }),
  last_name: Joi.string()
    .alphanum()
    .min(SCHEMA.USER_LAST_NAME_MIN_LENGTH)
    .max(SCHEMA.USER_LAST_NAME_MAX_LENGTH)
    .alter({
      post: (schema) => schema.required(),
      patch: (schema) => schema.optional(),
      login: (schema) => schema.forbidden(),
    }),
  password: Joi.string()
    .pattern(SCHEMA.USER_PASSWORD_REGEX)
    .alter({
      post: (schema) => schema.required(),
      patch: (schema) => schema.optional(),
      login: (schema) => schema.required(),
    }),
});

const userSchemaNew = userSchemaBase.tailor("post");

const userSchemaUpdate = userSchemaBase
  .tailor("patch")
  .or("email", "first_name", "last_name", "password");
const userSchemaLogin = userSchemaBase.tailor("login");

function createUser(knex) {
  return (req, res, next) => {
    const newUserInput = req.body;

    // when checkNewUser is false, error is thrown
    checkNewUser(newUserInput, knex)
      .then((empty) => {
        return bcrypt.hash(newUserInput.password, 10);
      })
      // TODO advanced: (low priority) add some error handling for bcrypt hash
      .then((password_hash) => {
        const created_at = new Date();
        delete newUserInput.password;
        const newUserData = {
          ...newUserInput,
          password_hash: password_hash,
          eid: uuidv4(),
          created_at: created_at,
          updated_at: created_at,
          deleted_at: null,
        };
        return insertUser(knex, newUserData);
      })
      .then((data) => {
        req.userData = data[0];
        next(); // pass on userData to the Login method
      })
      .catch((err) => {
        if (!err instanceof EibarError) {
          next(
            new EibarError("db mess", [
              customMessageError(ERROR_DICT.E9001_DB_ERROR, err.message),
            ])
          );
        }
        next(err);
      });
  };
}

function loginUser(knex) {
  return (req, res, next) => {
    // check password if not coming from registration (which populates req.userData)
    if (!req.userData) {
      const credentials = req.body;
      const checkCredentials = userSchemaLogin.validate(req.body).value;
      if (checkCredentials.error) {
        res.sendStatus(401);
      }

      let responseUserData;
      knex("eibaruser")
        .where({ email: credentials.email })
        .whereNull("deleted_at")
        .then((rows) => {
          if (rows.length === 1) {
            responseUserData = userSchemaBase.validate(rows[0], {
              stripUnknown: true,
            }).value;
            return bcrypt.compare(credentials.password, rows[0].password_hash);
          } else {
            res.sendStatus(401);
          }
        })
        .then((passwordOK) => {
          if (passwordOK) {
            res.set(
              "auth-token",
              generateToken(req.body.email, responseUserData.eid)
            );
            res.status(200).json(responseUserData);
          } else {
            res.status(401).send("bad pw");
          }
        });
    } else {
      // THIS IS REPEAT OF SUCCESS CODE ABOVE. DRY!
      responseUserData = userSchemaBase.validate(req.userData, {
        stripUnknown: true,
      }).value;
      res.set(
        "auth-token",
        generateToken(req.body.email, responseUserData.eid)
      );
      res.status(200).json(responseUserData);
    }
  };
}

function updateUser(knex) {
  return (req, res, next) => {
    if (!validate_uuid(req.params.userId)) {
      throw new EibarError("mess", ERROR_DICT.E0008_USER_DOES_NOT_EXIST);
    }

    const updateUserInput = req.body;

    checkUpdateUser(req.params.userId, updateUserInput, knex)
      .then((empty) => {
        updateUserInput["updated_at"] = new Date();
        return knex("eibaruser")
          .where({ eid: req.params.userId })
          .whereNull("deleted_at")
          .update(updateUserInput, ["*"]);
      })
      .then((data) => {
        responseUserData = userSchemaBase.validate(data[0], {
          stripUnknown: true,
        }).value;
        res.status(200).json(responseUserData);
      })
      .catch(genericEibarErrorHandler(next, ERROR_DICT.E9001_DB_ERROR, true));
  };
}

function deleteUser(knex) {
  return (req, res, next) => {
    if (!validate_uuid(req.params.userId)) {
      throw new EibarError("mess", ERROR_DICT.E0008_USER_DOES_NOT_EXIST);
    }

    knex("eibaruser")
      .select()
      // TODO: make sure that the user trying to delete is the user being deleted
      .where({ eid: req.params.userId })
      .whereNull("deleted_at")
      .then((rows) => {
        if (rows.length != 1) {
          throw new EibarError("mess", ERROR_DICT.E0008_USER_DOES_NOT_EXIST);
        }

          return knex("eibaruser")
            .where({ eid: req.params.userId })
            .whereNull("deleted_at")
          .update({ deleted_at: new Date() });
      })
            .then((data) => {
              res.sendStatus(204);
      })
      // TODO remove existing sessions if they exist in Session DB
      .catch(genericEibarErrorHandler(next, ERROR_DICT.E9001_DB_ERROR, true));
  };
}

function insertUser(knex, newUserData) {
  return knex("eibaruser").insert(newUserData, ["*"]);
}

function userFactory(knex) {
  const newUserData = {
    email: "test@example.com",
    first_name: "jane",
    last_name: "doe",
    eid: uuidv4(),
  };
  return insertUser(knex, newUserData);
}

async function checkNewUser(newUserInput, knex) {
  const { error: joiError, value } = userSchemaNew.validate(
    newUserInput,
    joiOptions
  );

  if (joiError) {
    throw new EibarError(
      "mess",
      mapSchemaErrors(joiError.details, EIBAR_USER_ERROR_MAP)
    );
  } else {
    let myError = null;
    await knex("eibaruser")
      .select()
      .where({ email: newUserInput.email })
      .whereNull("deleted_at")
      .then((existingUsers) => {
        if (existingUsers.length >= 1) {
          throw new EibarError("mess", [ERROR_DICT.E0007_USER_EXISTS]);
        }
      })
      .catch((err) => {
        if (!err instanceof EibarError) {
          myError = new EibarError("db mess", [
            customMessageError(ERROR_DICT.E9001_DB_ERROR, err.message),
          ]);
        }
        myError = err;
      });

    if (myError) throw myError;
  }
}

async function checkUpdateUser(eid, updateUserInput, knex) {
  const { error: joiError, value } = userSchemaUpdate.validate(
    updateUserInput,
    joiOptions
  );
  if (joiError) {
    throw new EibarError(
      "mess",
      mapSchemaErrors(joiError.details, EIBAR_USER_ERROR_MAP)
    );
  } else {
    // TODO: redo update so this select statement is no longer necessary.
    // Go straight to update and catch the DB error.
    let myError = null;
    await knex("eibaruser")
      .select()
      .where({ eid: eid })
      .whereNull("deleted_at")
      .then((existingUsers) => {
        switch (existingUsers.length) {
          case 0:
            throw new EibarError("Mess", ERROR_DICT.E0008_USER_DOES_NOT_EXIST);
          case 1:
            break;
          default:
            throw new EibarError(
              "Mess",
              customMessageError(
                ERROR_DICT.E0000_DEFAULT_ERROR,
                "Strange user data: multiple users found"
              )
            );
        }
      })
      .catch((err) => {
        if (!err instanceof EibarError) {
          myError = new EibarError("db mess", [
            customMessageError(ERROR_DICT.E9001_DB_ERROR, err.message),
          ]);
        }
        myError = err;
      });
  }
}

function generateToken(email, eid) {
  return jwt.sign(
    {
      email: email,
      eid: eid,
    },
    process.env.JWT_SECRET
  );
}

const EIBAR_USER_ERROR_MAP = {
  "first_name--any.required": ERROR_DICT.E0000_DEFAULT_ERROR,
  "first_name--string.min": ERROR_DICT.E0001_USER_FIRST_NAME_SHORT,
  "first_name--string.max": ERROR_DICT.E0002_USER_FIRST_NAME_LONG,
  "last_name--any.required": ERROR_DICT.E0000_DEFAULT_ERROR,
  "last_name--string.min": ERROR_DICT.E0003_USER_LAST_NAME_SHORT,
  "last_name--string.max": ERROR_DICT.E0004_USER_LAST_NAME_LONG,
  "email--any.required": ERROR_DICT.E0000_DEFAULT_ERROR,
  "email--string.email": ERROR_DICT.E0006_USER_EMAIL_INVALID,
  "email--string.max": ERROR_DICT.E0005_USER_EMAIL_LONG,
  "email--string.empty": ERROR_DICT.E0006_USER_EMAIL_INVALID,
  "email--string.base": ERROR_DICT.E0000_DEFAULT_ERROR, // empty string
  "password--any.required": ERROR_DICT.E0009_USER_PASSWORD_INVALID, // empty string
  "password--string.base": ERROR_DICT.E0009_USER_PASSWORD_INVALID, // empty string
  "password--string.empty": ERROR_DICT.E0009_USER_PASSWORD_INVALID, // empty string
  "password--string.pattern.base": ERROR_DICT.E0009_USER_PASSWORD_INVALID, // empty string
};

module.exports = {
  schemaTest: {
    joiOptions,
    userSchemaNew,
    userSchemaUpdate,
    EIBAR_USER_ERROR_MAP,
  },
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  userFactory,
};
