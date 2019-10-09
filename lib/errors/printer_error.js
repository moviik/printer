class PrinterError extends Error {
  constructor (message, code) {
    super(message)
    this.code = code
    Error.captureStackTrace(this, PrinterError)
  }
}

module.exports = PrinterError
