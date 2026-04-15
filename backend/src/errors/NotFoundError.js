// Defines the not found error type for missing resources.
const AppError = require('./AppError');

class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

module.exports = NotFoundError;
