const chai = require("chai");
const assert = chai.assert;
const {
  joiOptions,
  teacherSchemaNew,
  teacherSchemaUpdate,
  EIBAR_TEACHER_ERROR_MAP,
} = require("../../../api/user/teacherUtil").schemaTest;

const SCHEMA = require("../../../api/util/schema_constants");
const { mapSchemaErrors } = require("../../../api/util/schema_common");

const { EibarError, ERROR_DICT } = require("../../../api/util/error_handling");

// helper functions for tests

// TODO beginner: create basic functions that will be used to create
// bad data throughout the testing. Leaving basic framework for a
// couple of them here.

const TOO_SHORT_USERNAME = () =>
  "x".repeat(SCHEMA.TEACHER_DISPLAYNAME_MIN_LENGTH - 1);
const TOO_LONG_USERNAME = () => "TODO beginner: define too long username";

// TODO advanced: move these functions that will be common across
// different endpoints for schema testing to a common file:
// validateSchemaGetEibarError, sortErrorArrays, REMOVE_KEY_STRING, testInput
// Also, pulling the ERROR_MAP out of validateSchemaGetEibarError and
// making it an argument will be required
const validateSchemaGetEibarError = (schema, object) => {
  const { error, value } = schema.validate(object, joiOptions);
  if (error) {
    return new EibarError(
      "mess",
      mapSchemaErrors(error.details, EIBAR_TEACHER_ERROR_MAP)
    );
  } else {
    return null;
  }
};

const sortErrorArrays = (...errorArrays) => {
  if (errorArrays.length === 0) throw new Error();
  errorArrays.forEach((errorArray) => {
    errorArray.sort((a, b) => (a.error.code >= b.error.code ? 1 : -1));
  });
};

const REMOVE_KEY_STRING = "REMOVE_KEY";

const performSchemaTest = (schema, validInput, badValues, expectedErrors) => {
  badInput = {
    ...validInput,
    ...badValues,
  };
  for (let key in badValues) {
    if (badValues[key] === REMOVE_KEY_STRING) {
      delete badInput[key];
    }
  }

  eibarError = validateSchemaGetEibarError(schema, badInput);

  if (eibarError === null) {
    // NO ERRORS FOUND CASE
    assert.equal(expectedErrors.length, 0);
  } else {
    // SCHEMA ERRORS FOUND
    assert.equal(eibarError.eibarErrors.length, expectedErrors.length);

    // sort error arrays (in place) in prep for comparison
    if (expectedErrors.length > 1)
      sortErrorArrays(eibarError.eibarErrors, expectedErrors);

    // compare each error
    for (let i = 0; i < eibarError.eibarErrors.length; i++) {
      assert.equal(eibarError.eibarErrors[i], expectedErrors[i]);
    }
  }
};

// End Helper functions, begin tests

// TODO beginner: when you want to actually run these tests, make sure
// you remove the ".skip" here.
describe.skip("Teacher profile input checking (new teacher profile)", () => {
  let INPUT = {};

  beforeEach(function () {
    INPUT = {
      // TODO beginner: create basic starter data
    };
  });

  it("should return no errors for valid teacher data", () => {
    performSchemaTest(teacherSchemaNew, INPUT, {}, []);
  });

  it("should identify too-long username");
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
