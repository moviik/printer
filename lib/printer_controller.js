const EventEmitter = require('events')
const StatusManager = require('lib/cesmlm/status_manager')
const XmlManager = require('lib/cpt/xml_manager')
const PrinterError = require('lib/errors/printer_error')

class PrinterController extends EventEmitter {
  constructor (printerAdapter, openRetryPeriod = 1000, ...args) {
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
  }

  static _assertPrintError (error) {
    if (!(error instanceof PrinterError)) {
      throw error
    }
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
        this._printErrorCheck()
      } finally {
        this._clearStatus()
        this._openStatus()
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
      this._printErrorCheck()
      this.emit('printer.close_error', { error_code: this.statusErrors.toString(error.code) })
    } finally {
      this._clearStatus()
    }
  }

  _openStatus () {
    try {
      this.statusManager.openPrinter(1000)
      this.statusOpened = false
      this._statusManagerEvents()
    } catch (error) {
      this._printErrorCheck()
      this.emit('printer.open_error', { error_code: this.statusErrors.toString(error.code) })
    }
  }

  _openXml () {
    try {
      this.xmlManager.openPrinter()
      this.xmlOpened = false
    } catch (error) {
      this._printErrorCheck()
      this.emit('printer.open_error', { error_code: this.printErrors.toString(error.code) })
    }
  }

  _closeXml () {
    try {
      this.xmlManager.closePrinter()
    } catch (error) {
      this._printErrorCheck()
      this.emit('printer.close_error', { error_code: this.printErrors.toString(error.code) })
    } finally {
      this._clearXml()
    }
  }

  openPrinter () {
    this._openStatus()
    this._openXml()
    this._manageOpenTimer()
  }

  closePrinter () {
    if (this.statusOpened) {
      this._closeStatus()
    }
    if (this.xmlOpened) {
      this._closeXml()
    }
  }
}

module.exports = PrinterController
