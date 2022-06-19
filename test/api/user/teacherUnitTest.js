const chai = require("chai");
const assert = chai.assert;
const { teacherSchemaNew, teacherSchemaUpdate, EIBAR_TEACHER_ERROR_MAP } =
  require("../../../api/user/teacherUtil").schemaTest;

const {
  REMOVE_KEY_STRING,
  performSchemaTest,
} = require("../../../util/schemaTest.js");

const SCHEMA = require("../../../api/util/schema_constants");
const { mapSchemaErrors } = require("../../../api/util/schema_common");

const { EibarError, ERROR_DICT } = require("../../../api/util/error_handling");

// helper functions for tests

// TODO beginner: create basic functions that will be used to create
// bad data throughout the testing. Leaving basic framework for a
// couple of them here.

const TOO_SHORT_DISPLAY_NAME = () =>
  "x".repeat(SCHEMA.TEACHER_DISPLAYNAME_MIN_LENGTH - 1);
const TOO_LONG_DISPLAY_NAME = () =>
  "x".repeat(SCHEMA.TEACHER_DISPLAYNAME_MAX_LENGTH + 1);

// End Helper functions, begin tests

// TODO beginner: when you want to actually run these tests, make sure
// you remove the ".skip" here.
describe("Teacher profile input checking (new teacher profile)", () => {
  let INPUT = {};

  beforeEach(function () {
    INPUT = {
      display_name: "Japanese",
      language_code: "ja",
      default_rate: {
        amount: 5000,
        currency: "JPY",
        precision: 0,
      },
    };
  });

  it("should return no errors for valid teacher data", () => {
    performSchemaTest(teacherSchemaNew, INPUT, {}, [], EIBAR_TEACHER_ERROR_MAP);
  });

  it("should identify too-short display name", () => {
    performSchemaTest(
      teacherSchemaNew,
      INPUT,
      { display_name: TOO_SHORT_DISPLAY_NAME() },
      [ERROR_DICT.E0000_DEFAULT_ERROR],
      EIBAR_TEACHER_ERROR_MAP
    );
  });

  it("should identify too-long display name", () => {
    performSchemaTest(
      teacherSchemaNew,
      INPUT,
      { display_name: TOO_LONG_DISPLAY_NAME() },
      [ERROR_DICT.E0000_DEFAULT_ERROR],
      EIBAR_TEACHER_ERROR_MAP
    );
  });
});

// TODO beginner: when you want to actually run these tests, make sure
// you remove the ".skip" here.
describe.skip("Teacher Profile input checking (update teacher)", () => {
  let INPUT = {};

  beforeEach(function () {
    INPUT = {
      email: "test@example.com",
      first_name: "jane",
      last_name: "doe",
    };
  });

  it("should return no errors for valid data (all fields)", () => {
    performSchemaTest(
      teacherSchemaUpdate,
      INPUT,
      {}, // no update (good data)
      [] // no errors expected
    );
  });

  it("should return no errors for partial teacher profile data (just XXX)");
  it("should return no errors for partial teacher profile data (just YYY)");
});
