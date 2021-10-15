class EibarError extends Error {
  constructor(message, eibarErrors) {
    super(message);
    this.name = "EibarError";

    // to allow for bare errors (not in array) that are passed:
    this.eibarErrors = [].concat(eibarErrors);
  }
}

// all errors from the Eibar API should be of a specific format, which is confirmed
// in testing using a Joi schema (errorHandleTest.js).

const ERROR_DICT = Object.freeze({
  E0000_DEFAULT_ERROR: {
    statusCode: 400,
    error: {
      code: "E0000",
      message: "Something went wrong. please contact support.",
    },
  },
  E0001_USER_FIRST_NAME_SHORT: {
    statusCode: 400,
    error: {
      code: "E0001",
      message: "E0001 message",
    },
  },
  E0002_USER_FIRST_NAME_LONG: {
    statusCode: 400,
    error: {
      code: "E0002",
      message: "E0002 message",
    },
  },
  E0003_USER_LAST_NAME_SHORT: {
    statusCode: 400,
    error: {
      code: "E0003",
      message: "E0003 message",
    },
  },
  E0004_USER_LAST_NAME_LONG: {
    statusCode: 400,
    error: {
      code: "E0004",
      message: "E0004 message",
    },
  },
  E0005_USER_EMAIL_LONG: {
    statusCode: 400,
    error: {
      code: "E0005",
      message: "E0005 message",
    },
  },
  E0006_USER_EMAIL_INVALID: {
    statusCode: 400,
    error: {
      code: "E0006",
      message: "E0006 message",
    },
  },
  E0007_USER_EXISTS: {
    statusCode: 400,
    error: {
      code: "E0007",
      message: "E0007 message",
    },
  },
  E0008_USER_DOES_NOT_EXIST: {
    statusCode: 400,
    error: {
      code: "E0008",
      message: "E0008 message",
    },
  },
  E0009_USER_PASSWORD_INVALID: {
    statusCode: 400,
    error: {
      code: "E0009",
      message: "E0009 message",
    },
  },
  E0010_USER_PASSWORD_MISMATCH: {
    statusCode: 400,
    error: {
      code: "E0010",
      message: "E0010 message",
    },
  },
  E9000_OTHER_ERROR: {
    statusCode: 500,
    error: {
      code: "E9000",
      message: "E9000 message",
    },
  },
  E9001_DB_ERROR: {
    statusCode: 500,
    error: {
      code: "E9001",
      message: "E9001 message",
    },
  },
  E9999_TEST_ERROR: {
    statusCode: 999,
    error: {
      code: "E9999",
      message: "E9999 message",
    },
  },
});

function customMessageError(baseError, message) {
  let customError = JSON.parse(JSON.stringify(baseError));
  if (message) customError.error.message = message;
  return customError;
}

function createErrorResponse(eibarErrors) {
  // if something snuck through without a well defined eibarError
  if (eibarErrors.length === 0) {
    eibarErrors = [ERROR_DICT.E0000_DEFAULT_ERROR];
  }

  // take only the status code from the first error, as if there are multiple
  // then it is probably multiple errors of the same kind.
  statusCode = eibarErrors[0].statusCode;

  responseBody = {
    timestamp: new Date(),
    errors: [],
  };

  eibarErrors.forEach((eibarError) => {
    responseBody.errors.push(eibarError.error);
  });

  return {
    statusCode,
    responseBody,
  };
}

const genericEibarErrorHandler = (next, baseError, useBaseErrorMessage) => {
  return (err) => {
    if (err instanceof EibarError) next(err);

    let messageOverride = useBaseErrorMessage ? null : err.message;
    next(
      new EibarError("mess", customMessageError(baseError, messageOverride))
    );
  };
};

module.exports = {
  EibarError,
  ERROR_DICT,
  customMessageError,
  createErrorResponse,
  genericEibarErrorHandler,
};
