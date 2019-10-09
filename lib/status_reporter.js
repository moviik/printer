const EventEmitter = require('events')
const PrinterError = require('lib/errors/printer_error')

class PrinterStatusReporter extends EventEmitter {
  constructor (printerAdapter, ...args) {
    super(...args)
    this.printerAdapter = printerAdapter

    this.printerReadBufferSize = 2024
    this.printerStatusBufferSize = 6

    this.printerBuffer = Buffer.alloc(this.printerReadBufferSize)
    this.printerStatus = Buffer.alloc(this.printerStatusBufferSize)
    this.dummyStatus = Buffer.alloc(1)

    this.previousStatus = Buffer.alloc(this.printerStatusBufferSize)
    this.previousStatus.fill(0, 0, this.printerStatusBufferSize)
  }

  getPrinterStatus () {
    this.printerAdapter.printerStatus(this.printerBuffer, this.printerReadBufferSize, this.dummyStatus)
    for (let i = 0; i < this.printerStatusBufferSize; i++) {
      lo_.set(this.printerStatus, i, lo_.get(this.printerBuffer, i))
    }
    return this.printerStatus
  }

  getLastStatus () {
    return this.previousStatus
  }

  start (period) {
    this.statusTimer = setInterval(() => {
      try {
        const status = this.getPrinterStatus()
        if (status.compare(this.previousStatus) !== 0) {
          status.copy(this.previousStatus, 0, 0, this.printerStatusBufferSize)
          this.emit('statusChanged', status)
        }
      } catch (error) {
        if (!(error instanceof PrinterError)) {
          this.emit('unknownError', error)
          return
        }
        this.emit('statusError', error)
      }
    }, period)
  }

  stop () {
    clearInterval(this.statusTimer)
  }
}

module.exports = PrinterStatusReporter
