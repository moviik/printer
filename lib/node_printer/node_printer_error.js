const PrinterError = require('lib/errors/printer_error')

class NodePrinterError extends PrinterError {
  static codes () {
    return {
      SUCCESS: 0,
      NOT_FOUND: 1,
      ERROR: 2
    }
  }
}
module.exports = NodePrinterError
