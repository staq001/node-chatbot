class handleError extends Error {
  statusCode;

  constructor(message, statusCode = null) {
    super(message)
    this.statusCode = statusCode
  }
}

module.exports = handleError;