class TicketBuilderError extends Error {
  constructor (message, code) {
    super(message)
    this.code = code
    Error.captureStackTrace(this, TicketBuilderError)
  }
}

module.exports = TicketBuilderError
