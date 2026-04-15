// Validates required request body fields before hitting controllers.
const ValidationError = require('../errors/ValidationError');

function validate(requiredFields) {
  return function validateBody(req, res, next) {
    const missingField = requiredFields.find((field) => {
      const value = req.body[field];
      return value === undefined || value === null || value === '';
    });

    if (missingField) {
      return next(new ValidationError(`${missingField} is required`));
    }

    return next();
  };
}

module.exports = validate;
