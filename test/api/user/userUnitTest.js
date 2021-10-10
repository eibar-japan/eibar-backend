const chai = require("chai");
const assert = chai.assert;
const { joiOptions, userSchemaNew, userSchemaUpdate, EIBAR_USER_ERROR_MAP } =
  require("../../../api/user/userUtil").schemaTest;

const SCHEMA = require("../../../api/util/schema_constants");
const { mapSchemaErrors } = require("../../../api/util/schema_common");

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

const validateSchemaGetEibarError = (schema, object) => {
  const { error, value } = schema.validate(object, joiOptions);
  if (error) {
    // console.log(error.details);
    return new EibarError(
      "mess",
      mapSchemaErrors(error.details, EIBAR_USER_ERROR_MAP)
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

const testInput = (schema, validInput, badValues, expectedErrors) => {
  badInput = {
    ...validInput,
    ...badValues,
  };
  for (let key in badValues) {
    if (badValues[key] === REMOVE_KEY_STRING) {
      delete badInput[key];
    }
  }
  // console.log("data to be evaluated");
  // console.log(badInput);

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

describe("User input checking (new user)", () => {
  let INPUT = {};

  beforeEach(function () {
    INPUT = {
      email: "test@example.com",
      first_name: "jane",
      last_name: "doe",
    };
  });

  it("should return no errors for valid data", () => {
    testInput(userSchemaNew, INPUT, {}, []);
  });

  it("should identify too-long email input", () => {
    // create bad email address based on only max length variable

    testInput(userSchemaNew, INPUT, { email: TOO_LONG_EMAIL() }, [
      ERROR_DICT.E0005_USER_EMAIL_LONG,
    ]);
  });

  it("should identify invalid email address", () => {
    testInput(userSchemaNew, INPUT, { email: "x" }, [
      ERROR_DICT.E0006_USER_EMAIL_INVALID,
    ]);
  });

  it("should catch missing email address (no email property)", () => {
    testInput(userSchemaNew, INPUT, { email: REMOVE_KEY_STRING }, [
      ERROR_DICT.E0000_DEFAULT_ERROR,
      // TODO: should this have a different error for it?
    ]);
  });

  it("should catch missing email address (empty email property)", () => {
    testInput(userSchemaNew, INPUT, { email: "" }, [
      ERROR_DICT.E0006_USER_EMAIL_INVALID,
    ]);
  });
  it("should catch missing email address (null email property)", () => {
    testInput(userSchemaNew, INPUT, { email: null }, [
      ERROR_DICT.E0000_DEFAULT_ERROR,
    ]);
  });
  it("should catch missing email address (undefined email property)", () => {
    testInput(userSchemaNew, INPUT, { email: null }, [
      ERROR_DICT.E0000_DEFAULT_ERROR,
    ]);
  });

  it("should identify too-short first name", () => {
    testInput(userSchemaNew, INPUT, { first_name: TOO_SHORT_FIRST_NAME() }, [
      ERROR_DICT.E0001_USER_FIRST_NAME_SHORT,
    ]);
  });

  it("should identify too-long first name", () => {
    testInput(userSchemaNew, INPUT, { first_name: TOO_LONG_FIRST_NAME() }, [
      ERROR_DICT.E0002_USER_FIRST_NAME_LONG,
    ]);
  });

  it("should identify too-short last name", () => {
    testInput(userSchemaNew, INPUT, { last_name: TOO_SHORT_LAST_NAME() }, [
      ERROR_DICT.E0003_USER_LAST_NAME_SHORT,
    ]);
  });

  it("should identify too-long last name", () => {
    testInput(userSchemaNew, INPUT, { last_name: TOO_LONG_LAST_NAME() }, [
      ERROR_DICT.E0004_USER_LAST_NAME_LONG,
    ]);
  });

  it("should identify all errors if multiple present", () => {
    testInput(
      userSchemaNew,
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
      ]
    );
  });
});

describe("User input checking (update user)", () => {
  let INPUT = {};

  beforeEach(function () {
    INPUT = {
      email: "test@example.com",
      first_name: "jane",
      last_name: "doe",
    };
  });

  it("should return no errors for valid data (all fields)", () => {
    testInput(userSchemaUpdate, INPUT, {}, []);
  });

  it("should return no errors for valid data (just email)", () => {
    testInput(
      userSchemaUpdate,
      INPUT,
      { first_name: REMOVE_KEY_STRING, last_name: REMOVE_KEY_STRING },
      []
    );
  });
  it("should return no errors for valid data (just last_name)", () => {
    testInput(
      userSchemaUpdate,
      INPUT,
      { first_name: REMOVE_KEY_STRING, email: REMOVE_KEY_STRING },
      []
    );
  });

  it("should return no errors for valid data (just first_name)", () => {
    testInput(
      userSchemaUpdate,
      INPUT,
      { last_name: REMOVE_KEY_STRING, email: REMOVE_KEY_STRING },
      []
    );
  });

  it("should return no errors for valid data (two fields)", () => {
    testInput(userSchemaUpdate, INPUT, { email: REMOVE_KEY_STRING }, []);
  });

  it("should identify all errors if multiple present", () => {
    testInput(
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
      ]
    );
  });

  // it("should identify too-long email input", () => {
  //   testInput(userSchemaNew, INPUT, { email: "x".repeat(45) + "@e.com" }, [
  //     ERROR_DICT.E0005_USER_EMAIL_LONG,
  //   ]);
  // });

  // it("should identify invalid email address", () => {
  //   testInput(userSchemaNew, INPUT, { email: "x" }, [
  //     ERROR_DICT.E0006_USER_EMAIL_INVALID,
  //   ]);
  // });

  // it("should catch missing email address (no email property)", () => {
  //   testInput(userSchemaNew, INPUT, { email: REMOVE_KEY_STRING }, [
  //     ERROR_DICT.E0006_USER_EMAIL_INVALID,
  //   ]);
  // });

  // it("should catch missing email address (empty email property)", () => {
  //   testInput(userSchemaNew, INPUT, { email: "" }, [
  //     ERROR_DICT.E0006_USER_EMAIL_INVALID,
  //   ]);
  // });
  // it("should catch missing email address (null email property)", () => {
  //   testInput(userSchemaNew, INPUT, { email: null }, [
  //     ERROR_DICT.E0000_DEFAULT_ERROR,
  //   ]);
  // });
  // it("should catch missing email address (undefined email property)", () => {
  //   testInput(userSchemaNew, INPUT, { email: null }, [
  //     ERROR_DICT.E0000_DEFAULT_ERROR,
  //   ]);
  // });

  // it("should identify too-short first name", () => {
  //   testInput(
  //     userSchemaNew,
  //     INPUT,
  //     { first_name: "x".repeat(USER_FIRST_NAME_MIN_LENGTH - 1) },
  //     [ERROR_DICT.E0001_USER_FIRST_NAME_SHORT]
  //   );
  // });

  // it("should identify too-long first name", () => {
  //   testInput(
  //     userSchemaNew,
  //     INPUT,
  //     { first_name: "x".repeat(USER_FIRST_NAME_MAX_LENGTH + 1) },
  //     [ERROR_DICT.E0002_USER_FIRST_NAME_LONG]
  //   );
  // });

  // it("should identify too-short last name", () => {
  //   testInput(
  //     userSchemaNew,
  //     INPUT,
  //     { last_name: "x".repeat(USER_LAST_NAME_MIN_LENGTH - 1) },
  //     [ERROR_DICT.E0003_USER_LAST_NAME_SHORT]
  //   );
  // });

  // it("should identify too-long last name", () => {
  //   testInput(
  //     userSchemaNew,
  //     INPUT,
  //     { last_name: "x".repeat(USER_LAST_NAME_MAX_LENGTH + 1) },
  //     [ERROR_DICT.E0004_USER_LAST_NAME_LONG]
  //   );
  // });

  // it("should identify all errors if multiple present", () => {
  //   testInput(
  //     userSchemaNew,
  //     INPUT,
  //     {
  //       last_name: "x".repeat(USER_LAST_NAME_MAX_LENGTH + 1),
  //       first_name: "x".repeat(USER_FIRST_NAME_MAX_LENGTH + 1),
  //       email: "x".repeat(45) + "@e.com",
  //     },
  //     [
  //       ERROR_DICT.E0004_USER_LAST_NAME_LONG,
  //       ERROR_DICT.E0002_USER_FIRST_NAME_LONG,
  //       ERROR_DICT.E0005_USER_EMAIL_LONG,
  //     ]
  //   );
  // });
});
