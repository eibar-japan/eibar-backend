const chai = require("chai");
const assert = chai.assert;
const joiOptions = {
  abortEarly: false, // report all errors in schema
  render: false, // stops creation of Joi-formatted error message for performance
};
const { EibarError } = require("../api/util/error_handling");
const { mapSchemaErrors } = require("../api/util/schema_common");

const validateSchemaGetEibarError = (schema, object, error_map) => {
  const { error, value } = schema.validate(object, joiOptions);
  if (error) {
    return new EibarError(
      "mess",
      mapSchemaErrors(error.details, error_map)
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

const performSchemaTest = (schema, validInput, badValues, expectedErrors, error_map) => {
  badInput = {
    ...validInput,
    ...badValues,
  };
  for (let key in badValues) {
    if (badValues[key] === REMOVE_KEY_STRING) {
      delete badInput[key];
    }
  }

  eibarError = validateSchemaGetEibarError(schema, badInput, error_map);

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


module.exports = {
  validateSchemaGetEibarError, 
  sortErrorArrays, 
  REMOVE_KEY_STRING,
  performSchemaTest,
}