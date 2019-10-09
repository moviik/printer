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
    this.printHandle = this.printerAdapter.getHandle()
  }

  closePrinter () {
    this.statusReporter.stop()
    this.printerAdapter.freeHandle(this.printHandle)
    this.printerAdapter.closePrinter()
  }

  getLastStatus () {
    return this.statusReporter.getLastStatus()
  }

  setXmlParams (file) {
    this.printerAdapter.setXmlParamsFile(this.printHandle, file)
  }

  setXmlTagValue (tag, value) {
    this.printerAdapter.setXmlTagValue(this.printHandle, tag, value)
  }

  setXmlFile (file) {
    this.printerAdapter.setXmlFile(this.printHandle, file)
  }

  printXml () {
    this.printerAdapter.printXml(this.printHandle, 1)
  }
}

module.exports = PrinterManager
