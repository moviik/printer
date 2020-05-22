const EventEmitter = require('events')
const StatusManager = require('lib/cesmlm/status_manager')
const XmlManager = require('lib/cpt/xml_manager')
const PrinterError = require('lib/errors/printer_error')

function _assertPrintError (error) {
  if (!(error instanceof PrinterError)) {
    throw error
  }
}

class PrinterController extends EventEmitter {
  constructor (printerAdapter, openRetryPeriod = 1000, statusReportPeriod = 1000, ...args) {
    super(...args)
    this.printerAdapter = printerAdapter

    this.statusManager = new StatusManager(this.printerAdapter)
    this.xmlManager = new XmlManager(this.printerAdapter)

    this.statusError = this.printerAdapter.getStatusError()
    this.printError = this.printerAdapter.getPrinterError()

    this.statusOpened = false
    this.xmlOpened = false

    this.openTimer = undefined
    this.openRetryPeriod = openRetryPeriod
    this.statusReportPeriod = statusReportPeriod
  }

  _checkIfOpened () {
    if (this.statusOpened && this.xmlOpened) {
      this.emit('printer.opened')
      return
    }

    setTimeout(() => {
      this.openPrinter()
    }, this.openRetryPeriod)
  }

  _statusManagerEvents () {
    this.statusManager.on('statusChanged', (status) => {
      this.emit('printer.status', status)
    })
    this.statusManager.on('printerDisconnected', (error) => {
      this.emit('printer.disconnected', { error_code: this.statusError.toString(error.code) })
      try {
        this.statusManager.closePrinter()
      } catch (error) {
        _assertPrintError(error)
      } finally {
        this._clearStatus()
        this._checkIfOpened()
      }
    })
  }

  _clearStatus () {
    this.statusOpened = false
    this.statusManager.removeAllListeners('statusChanged')
    this.statusManager.removeAllListeners('printerDisconnected')
  }

  _clearXml () {
    this.xmlOpened = false
  }

  _closeStatus () {
    try {
      this.statusManager.closePrinter()
    } catch (error) {
      _assertPrintError(error)
      this.emit('printer.close_error', { error_code: this.statusError.toString(error.code) })
    }
  }

  _openStatus () {
    try {
      this.statusManager.openPrinter(this.statusReportPeriod)
      this.statusOpened = true
      this._statusManagerEvents()
    } catch (error) {
      _assertPrintError(error)
      this.emit('printer.open_error', { error_code: this.statusError.toString(error.code) })
    }
  }

  _openXml () {
    try {
      this.xmlManager.openPrinter()
      this.xmlOpened = true
    } catch (error) {
      _assertPrintError(error)
      this.emit('printer.open_error', { error_code: this.printError.toString(error.code) })
    }
  }

  _closeXml () {
    try {
      this.xmlManager.closePrinter()
    } catch (error) {
      _assertPrintError(error)
      this.emit('printer.close_error', { error_code: this.printError.toString(error.code) })
    }
  }

  openPrinter () {
    if (!this.statusOpened) {
      this._openStatus()
    }
    if (!this.xmlOpened) {
      this._openXml()
    }
    this._checkIfOpened()
  }

  closePrinter () {
    if (this.statusOpened) {
      this._closeStatus()
      this._clearStatus()
    }
    if (this.xmlOpened) {
      this._closeXml()
      this._clearXml()
    }

    this.emit('printer.closed')
  }

  setXmlFile (file) {
    this.xmlManager.setXmlFile(file)
  }

  setXmlTagValue (tag, value) {
    this.xmlManager.setXmlTagValue(tag, value)
  }

  toggleXmlTagValue (tag, value) {
    this.xmlManager.toggleXmlTagValue(tag, value)
  }

  printXml () {
    this.xmlManager.printXml()
  }
}

module.exports = PrinterController
