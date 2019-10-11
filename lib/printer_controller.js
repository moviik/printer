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

    this.statusErrors = this.printerAdapter.getStatusErrors()
    this.printErrors = this.printerAdapter.getPrintErrors()

    this.statusOpened = false
    this.xmlOpened = false

    this.openTimer = undefined
    this.openRetryPeriod = openRetryPeriod
    this.statusReportPeriod = statusReportPeriod
  }

  _manageOpenTimer () {
    if (this.statusOpened && this.xmlOpened) {
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
    this.statusManager.on('printerDisconnected', (status) => {
      this.emit('printer.disconnected', status)
      try {
        this.statusManager.closePrinter()
      } catch (error) {
        _assertPrintError(error)
      } finally {
        this._clearStatus()
        this._manageOpenTimer()
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
      this.emit('printer.close_error', { error_code: this.statusErrors.toString(error.code) })
    }
  }

  _openStatus () {
    try {
      this.statusManager.openPrinter(this.statusReportPeriod)
      this.statusOpened = true
      this._statusManagerEvents()
    } catch (error) {
      _assertPrintError(error)
      this.emit('printer.open_error', { error_code: this.statusErrors.toString(error.code) })
    }
  }

  _openXml () {
    try {
      this.xmlManager.openPrinter()
      this.xmlOpened = true
    } catch (error) {
      _assertPrintError(error)
      this.emit('printer.open_error', { error_code: this.printErrors.toString(error.code) })
    }
  }

  _closeXml () {
    try {
      this.xmlManager.closePrinter()
    } catch (error) {
      _assertPrintError(error)
      this.emit('printer.close_error', { error_code: this.printErrors.toString(error.code) })
    }
  }

  openPrinter () {
    if (!this.statusOpened) {
      this._openStatus()
    }
    if (!this.xmlOpened) {
      this._openXml()
    }
    this._manageOpenTimer()
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
  }
}

module.exports = PrinterController
