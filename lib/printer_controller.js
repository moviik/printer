const EventEmitter = require('events')
const StatusManager = require('lib/cesmlm/status_manager')
const FileManager = require('lib/cpt/file_manager')
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
    this.fileManager = new FileManager(this.printerAdapter)

    this.statusError = this.printerAdapter.getStatusError()
    this.printError = this.printerAdapter.getPrinterError()

    this.statusOpened = false
    this.fileOpened = false

    this.openPrinterArgs = []

    this.openTimer = undefined
    this.openRetryPeriod = openRetryPeriod
    this.statusReportPeriod = statusReportPeriod
  }

  _checkIfOpened () {
    if (this.statusOpened && this.fileOpened) {
      this.emit('printer.opened')
      return
    }

    setTimeout(() => {
      this.openPrinter(...this.openPrinterArgs)
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

  _clearFile () {
    this.fileOpened = false
  }

  _closeStatus () {
    try {
      this.statusManager.closePrinter()
    } catch (error) {
      _assertPrintError(error)
      this.emit('printer.close_error', { error_code: this.statusError.toString(error.code) })
    }
  }

  _openStatus (...args) {
    try {
      this.statusManager.openPrinter.apply(this.statusManager, [this.statusReportPeriod].concat(args))
      this.statusOpened = true
      this._statusManagerEvents()
    } catch (error) {
      _assertPrintError(error)
      this.emit('printer.open_error', { error_code: this.statusError.toString(error.code) })
    }
  }

  _openFile () {
    try {
      this.fileManager.openPrinter()
      this.fileOpened = true
    } catch (error) {
      _assertPrintError(error)
      this.emit('printer.open_error', { error_code: this.printError.toString(error.code) })
    }
  }

  _closeFile () {
    try {
      this.fileManager.closePrinter()
    } catch (error) {
      _assertPrintError(error)
      this.emit('printer.close_error', { error_code: this.printError.toString(error.code) })
    }
  }

  openPrinter (...args) {
    this.openPrinterArgs = args
    if (!this.statusOpened) {
      this._openStatus.apply(this, this.openPrinterArgs)
    }
    if (!this.fileOpened) {
      this._openFile()
    }
    this._checkIfOpened()
  }

  closePrinter () {
    if (this.statusOpened) {
      this._closeStatus()
      this._clearStatus()
    }
    if (this.fileOpened) {
      this._closeFile()
      this._clearFile()
    }

    this.emit('printer.closed')
  }

  setFile (file) {
    this.fileManager.setFile(file)
  }

  setTagValue (tag, value) {
    this.fileManager.setTagValue(tag, value)
  }

  toggleTagValue (tag, value) {
    this.fileManager.toggleTagValue(tag, value)
  }

  print () {
    return this.fileManager.print()
  }
}

module.exports = PrinterController
