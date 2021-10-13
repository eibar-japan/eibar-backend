const Joi = require("joi");
const joiOptions = {
  abortEarly: false, // report all errors in schema
  render: false, // stops creation of Joi-formatted error message for performance
};
const { ERROR_DICT, customMessageError } = require("../util/error_handling");

const currencySchema = Joi.object({
  amount: Joi.number().integer().positive(),
  currency: Joi.string().length(3),
  precision: Joi.number().integer().positive().max(8),
});

function mapSchemaErrors(joiErrors, errorMap) {
  let eibarErrors = [];
  joiErrors.forEach((error) => {
    const errorKey = `${error.context.key}--${error.type}`;
    if (errorKey in errorMap) {
      eibarErrors.push(errorMap[errorKey]);
    } else {
      eibarErrors.push(
        customMessageError(ERROR_DICT.E0000_DEFAULT_ERROR, error.message)
      );
    }
  });
  return eibarErrors;
}

module.exports = {
  currencySchema,
  mapSchemaErrors,
};
