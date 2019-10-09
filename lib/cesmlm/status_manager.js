const EventEmitter = require('events')
const PrinterStatusReporter = require('./status_reporter')

class PrinterManager extends EventEmitter {
  _statusInit () {
    this.statusReporter = new PrinterStatusReporter(this.printerAdapter)

    this.statusReporter.on('statusError', (error) => {
      this.emit('printerDisconnected', error)
      this.statusReporter.stop()
    })

    this.statusReporter.on('statusChanged', (status) => {
      this.emit('statusChanged', status)
    })
  }

  constructor (printerAdapter, ...args) {
    super(...args)
    this.printerAdapter = printerAdapter
    this._statusInit()
  }

  openPrinter (period = 1000) {
    this.printerAdapter.openPrinter()
    this.statusReporter.start(period)
  }

  closePrinter () {
    this.statusReporter.stop()
    this.printerAdapter.closePrinter()
  }

  getLastStatus () {
    return this.statusReporter.getLastStatus()
  }
}

module.exports = PrinterManager
