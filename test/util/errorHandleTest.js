const {
  ERROR_DICT,
  customMessageError,
  createErrorResponse,
} = require("../../api/util/error_handling");
const Joi = require("joi");
const chai = require("chai");
const assert = chai.assert;

const HTTP_STATUS_CODES = [
  200, 201, 204, 400, 401, 403, 404, 409, 500, 999 /* 999 for testing */,
];

const ERROR_SCHEMA = Joi.object({
  statusCode: Joi.valid(...HTTP_STATUS_CODES),
  error: Joi.object({
    code: Joi.string().regex(/^E[0-9]{4}$/),
    message: Joi.string().required(),
  }),
});

describe("Error Message Dictionary", () => {
  it("should contain valid Eibar error objects", () => {
    for (const error_key in ERROR_DICT) {
      assert.isUndefined(ERROR_SCHEMA.validate(ERROR_DICT[error_key]).error);
      assert.equal(error_key.slice(0, 5), ERROR_DICT[error_key].error.code);
    }
  });
});

describe("Custom message error creator", () => {
  it("should override custom error message", () => {
    const CUSTOM_MESSAGE = "my custom message";
    const customError = customMessageError(
      ERROR_DICT.E9999_TEST_ERROR,
      CUSTOM_MESSAGE
    );
    assert.isObject(customError);
    assert.notEqual(customError, ERROR_DICT.E9999_TEST_ERROR);
    assert.equal(customError.error.message, CUSTOM_MESSAGE);
  });
});

describe("Error response creator", () => {
  it("should handle one error", () => {
    const eibarErrors = [ERROR_DICT.E0001_USER_FIRST_NAME_SHORT];
    const { statusCode, responseBody } = createErrorResponse(eibarErrors);

    assert.equal(statusCode, eibarErrors[0].statusCode);
    assert.instanceOf(responseBody.timestamp, Date);
    assert.equal(responseBody.errors.length, 1);
    assert.equal(
      responseBody.errors[0],
      ERROR_DICT.E0001_USER_FIRST_NAME_SHORT.error
    );
  });

  it("should handle multiple errors", () => {
    const eibarErrors = [
      ERROR_DICT.E0001_USER_FIRST_NAME_SHORT,
      ERROR_DICT.E9999_TEST_ERROR,
    ];
    const { statusCode, responseBody } = createErrorResponse(eibarErrors);

    assert.equal(statusCode, eibarErrors[0].statusCode); // takes status code from first error
    assert.equal(responseBody.errors.length, 2);
    responseBody.errors.forEach((error, index) => {
      assert.equal(error, eibarErrors[index].error);
    });
  });

  it("should handle erroneous 'no errors passed' case", () => {
    const eibarErrors = [];
    const { statusCode, responseBody } = createErrorResponse(eibarErrors);

    assert.equal(statusCode, ERROR_DICT.E0000_DEFAULT_ERROR.statusCode);
    assert.instanceOf(responseBody.timestamp, Date);
    assert.equal(responseBody.errors.length, 1);
    assert.deepEqual(
      responseBody.errors[0],
      ERROR_DICT.E0000_DEFAULT_ERROR.error
    );
  });
});
