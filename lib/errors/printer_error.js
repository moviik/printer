class PrinterError extends Error {
  constructor (message, code) {
    super(message)
    this.code = code
    Error.captureStackTrace(this, PrinterError)
  }

  static codes () {
    throw new Error('not implemented')
  }

  static toString (code) {
    const string = lo_.findKey(this.codes(), (value) => { return value === code })
    if (!string) {
      throw new Error(`No error with code: ${code}`)
    }
    return string
  }
}

module.exports = PrinterError
