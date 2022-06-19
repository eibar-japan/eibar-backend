const { userSchemaNew, userSchemaUpdate, EIBAR_USER_ERROR_MAP } =
  require("../../../api/user/userUtil").schemaTest;
const {
  REMOVE_KEY_STRING,
  performSchemaTest,
} = require("../../../util/schemaTest.js");

const SCHEMA = require("../../../api/util/schema_constants");

const { EibarError, ERROR_DICT } = require("../../../api/util/error_handling");

// helper functions for tests

const TOO_LONG_EMAIL = () => {
  return ("x".repeat(SCHEMA.USER_EMAIL_MAX_LENGTH) + "@e.com").slice(
    -(SCHEMA.USER_EMAIL_MAX_LENGTH + 1)
  );
};

const TOO_SHORT_FIRST_NAME = () =>
  "x".repeat(SCHEMA.USER_FIRST_NAME_MIN_LENGTH - 1);
const TOO_LONG_FIRST_NAME = () =>
  "x".repeat(SCHEMA.USER_FIRST_NAME_MAX_LENGTH + 1);
const TOO_SHORT_LAST_NAME = () =>
  "x".repeat(SCHEMA.USER_LAST_NAME_MIN_LENGTH - 1);
const TOO_LONG_LAST_NAME = () =>
  "x".repeat(SCHEMA.USER_LAST_NAME_MAX_LENGTH + 1);

// basic valid password
const BASE_PASSWORD = "Aa1aaaaa";

const TOO_SHORT_PASSWORD = () =>
  BASE_PASSWORD.slice(SCHEMA.USER_PASSWORD_MIN_LENGTH - 1);
const TOO_LONG_PASSWORD = () => {
  return (BASE_PASSWORD + "x".repeat(SCHEMA.USER_PASSWORD_MAX_LENGTH)).slice(
    SCHEMA.USER_PASSWORD_MAX_LENGTH + 1
  );
};
const PASSWORD_NO_DIGIT = () => BASE_PASSWORD.replace("1", "a");
const PASSWORD_NO_LOWERCASE = () => BASE_PASSWORD.replace(/a/g, "A");
const PASSWORD_NO_UPPERCASE = () => BASE_PASSWORD.replace("A", "a");

// ---------------------------------------------------------
// END SETUP
// ---------------------------------------------------------

describe("User input checking (new user)", () => {
  let INPUT = {};

  beforeEach(function () {
    INPUT = {
      email: "test@example.com",
      first_name: "jane",
      last_name: "doe",
      password: BASE_PASSWORD,
    };
  });

  it("should return no errors for valid data", () => {
    performSchemaTest(userSchemaNew, INPUT, {}, [], EIBAR_USER_ERROR_MAP);
  });

  it("should identify too-long email input", () => {
    // create bad email address based on only max length variable

    performSchemaTest(
      userSchemaNew,
      INPUT,
      { email: TOO_LONG_EMAIL() },
      [ERROR_DICT.E0005_USER_EMAIL_LONG],
      EIBAR_USER_ERROR_MAP
    );
  });

  it("should identify invalid email address", () => {
    performSchemaTest(
      userSchemaNew,
      INPUT,
      { email: "x" },
      [ERROR_DICT.E0006_USER_EMAIL_INVALID],
      EIBAR_USER_ERROR_MAP
    );
  });

  it("should catch missing email address (no email property)", () => {
    performSchemaTest(
      userSchemaNew,
      INPUT,
      { email: REMOVE_KEY_STRING },
      [
        ERROR_DICT.E0000_DEFAULT_ERROR,
        // TODO: should this have a different error for it?
      ],
      EIBAR_USER_ERROR_MAP
    );
  });

  it("should catch missing email address (empty email property)", () => {
    performSchemaTest(
      userSchemaNew,
      INPUT,
      { email: "" },
      [ERROR_DICT.E0006_USER_EMAIL_INVALID],
      EIBAR_USER_ERROR_MAP
    );
  });

  it("should catch missing email address (null email property)", () => {
    performSchemaTest(
      userSchemaNew,
      INPUT,
      { email: null },
      [ERROR_DICT.E0000_DEFAULT_ERROR],
      EIBAR_USER_ERROR_MAP
    );
  });

  it("should catch missing email address (undefined email property)", () => {
    performSchemaTest(
      userSchemaNew,
      INPUT,
      { email: undefined },
      [ERROR_DICT.E0000_DEFAULT_ERROR],
      EIBAR_USER_ERROR_MAP
    );
  });

  it("should identify too-short first name", () => {
    performSchemaTest(
      userSchemaNew,
      INPUT,
      { first_name: TOO_SHORT_FIRST_NAME() },
      [ERROR_DICT.E0001_USER_FIRST_NAME_SHORT],
      EIBAR_USER_ERROR_MAP
    );
  });

  it("should identify too-long first name", () => {
    performSchemaTest(
      userSchemaNew,
      INPUT,
      { first_name: TOO_LONG_FIRST_NAME() },
      [ERROR_DICT.E0002_USER_FIRST_NAME_LONG],
      EIBAR_USER_ERROR_MAP
    );
  });

  it("should identify too-short last name", () => {
    performSchemaTest(
      userSchemaNew,
      INPUT,
      { last_name: TOO_SHORT_LAST_NAME() },
      [ERROR_DICT.E0003_USER_LAST_NAME_SHORT],
      EIBAR_USER_ERROR_MAP
    );
  });

  it("should identify too-long last name", () => {
    performSchemaTest(
      userSchemaNew,
      INPUT,
      { last_name: TOO_LONG_LAST_NAME() },
      [ERROR_DICT.E0004_USER_LAST_NAME_LONG],
      EIBAR_USER_ERROR_MAP
    );
  });

  it("should identify missing password (missing key)", () => {
    performSchemaTest(
      userSchemaNew,
      INPUT,
      { password: REMOVE_KEY_STRING },
      [ERROR_DICT.E0009_USER_PASSWORD_INVALID],
      EIBAR_USER_ERROR_MAP
    );
  });

  it("should identify missing password (empty)", () => {
    performSchemaTest(
      userSchemaNew,
      INPUT,
      { password: "" },
      [ERROR_DICT.E0009_USER_PASSWORD_INVALID],
      EIBAR_USER_ERROR_MAP
    );
  });

  it("should identify missing password (null)", () => {
    performSchemaTest(
      userSchemaNew,
      INPUT,
      { password: null },
      [ERROR_DICT.E0009_USER_PASSWORD_INVALID],
      EIBAR_USER_ERROR_MAP
    );
  });

  it("should identify too-short password", () => {
    performSchemaTest(
      userSchemaNew,
      INPUT,
      { password: TOO_SHORT_PASSWORD() },
      [ERROR_DICT.E0009_USER_PASSWORD_INVALID],
      EIBAR_USER_ERROR_MAP
    );
  });

  it("should identify too-long password", () => {
    performSchemaTest(
      userSchemaNew,
      INPUT,
      { password: TOO_LONG_PASSWORD() },
      [ERROR_DICT.E0009_USER_PASSWORD_INVALID],
      EIBAR_USER_ERROR_MAP
    );
  });

  it("should identify password missing digit", () => {
    performSchemaTest(
      userSchemaNew,
      INPUT,
      { password: PASSWORD_NO_DIGIT() },
      [ERROR_DICT.E0009_USER_PASSWORD_INVALID],
      EIBAR_USER_ERROR_MAP
    );
  });

  it("should identify password missing lowercase", () => {
    performSchemaTest(
      userSchemaNew,
      INPUT,
      { password: PASSWORD_NO_LOWERCASE() },
      [ERROR_DICT.E0009_USER_PASSWORD_INVALID],
      EIBAR_USER_ERROR_MAP
    );
  });

  it("should identify password missing uppercase", () => {
    performSchemaTest(
      userSchemaNew,
      INPUT,
      { password: PASSWORD_NO_UPPERCASE() },
      [ERROR_DICT.E0009_USER_PASSWORD_INVALID],
      EIBAR_USER_ERROR_MAP
    );
  });

  it("should identify all errors if multiple present", () => {
    performSchemaTest(
      userSchemaNew,
      INPUT,
      {
        last_name: TOO_LONG_LAST_NAME(),
        first_name: TOO_LONG_FIRST_NAME(),
        email: TOO_LONG_EMAIL(),
        password: PASSWORD_NO_UPPERCASE(),
      },
      [
        ERROR_DICT.E0004_USER_LAST_NAME_LONG,
        ERROR_DICT.E0002_USER_FIRST_NAME_LONG,
        ERROR_DICT.E0005_USER_EMAIL_LONG,
        ERROR_DICT.E0009_USER_PASSWORD_INVALID,
      ],
      EIBAR_USER_ERROR_MAP
    );
  });
});

///////////////////////////////////////

describe("User input checking (update user)", () => {
  let INPUT = {};

  beforeEach(function () {
    INPUT = {
      email: "test@example.com",
      first_name: "jane",
      last_name: "doe",
      password: BASE_PASSWORD,
    };
  });

  it("should return no errors for valid data (all fields)", () => {
    performSchemaTest(userSchemaUpdate, INPUT, {}, [], EIBAR_USER_ERROR_MAP);
  });

  it("should return no errors for valid data (just email)", () => {
    performSchemaTest(
      userSchemaUpdate,
      INPUT,
      { first_name: REMOVE_KEY_STRING, last_name: REMOVE_KEY_STRING },
      [],
      EIBAR_USER_ERROR_MAP
    );
  });
  it("should return no errors for valid data (just last_name)", () => {
    performSchemaTest(
      userSchemaUpdate,
      INPUT,
      { first_name: REMOVE_KEY_STRING, email: REMOVE_KEY_STRING },
      [],
      EIBAR_USER_ERROR_MAP
    );
  });

  it("should return no errors for valid data (just first_name)", () => {
    performSchemaTest(
      userSchemaUpdate,
      INPUT,
      { last_name: REMOVE_KEY_STRING, email: REMOVE_KEY_STRING },
      [],
      EIBAR_USER_ERROR_MAP
    );
  });

  it("should return no errors for valid data (two fields)", () => {
    performSchemaTest(
      userSchemaUpdate,
      INPUT,
      { email: REMOVE_KEY_STRING },
      [],
      EIBAR_USER_ERROR_MAP
    );
  });

  it("should identify all errors if multiple present", () => {
    performSchemaTest(
      userSchemaUpdate,
      INPUT,
      {
        last_name: TOO_LONG_LAST_NAME(),
        first_name: TOO_LONG_FIRST_NAME(),
        email: TOO_LONG_EMAIL(),
      },
      [
        ERROR_DICT.E0004_USER_LAST_NAME_LONG,
        ERROR_DICT.E0002_USER_FIRST_NAME_LONG,
        ERROR_DICT.E0005_USER_EMAIL_LONG,
      ],
      EIBAR_USER_ERROR_MAP
    );
  });

  // TODO advanced. consider whether or not to repeat the same
  // too-long, too-short, etc tests that are performed in New
  // User data checks. Especially after the Joi schemas are
  // refactored (if possible), the New and Update schemas will share
  // these basic parts, so doubling up the testing should be redundant.
});

module.exports = {
  TOO_LONG_EMAIL,
  TOO_LONG_FIRST_NAME,
  TOO_LONG_LAST_NAME,
};
