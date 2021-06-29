const PrinterManager = require('lib/status_manager')
const PrinterAdapter = require('lib/adapter/printer_adapter')
const PrinterError = require('lib/errors/printer_error')

function shouldFailIfReceivesStatusChanged (manager, done) {
  manager.once('statusChanged', () => {
    done.fail()
  })
}

function adapterSetOpenPrinter (adapter) {
  adapter.openPrinter = () => {
  }
}

function adapterSetOpenPrinterError (adapter, error) {
  adapter.openPrinter = () => {
    throw error
  }
}

function adapterSetClosePrinter (adapter) {
  adapter.closePrinter = () => {
  }
}

function adapterSetClosePrinterError (adapter, error) {
  adapter.closePrinter = () => {
    throw error
  }
}

function adapterSetStatus (adapter, newStatus) {
  adapter.printerStatus = (printerBuffer) => {
    printerBuffer.writeInt32LE(newStatus)
  }
}

function adapterSetStatusError (adapter, ErrorType, code) {
  adapter.printerStatus = () => {
    throw new ErrorType('message', code)
  }
}

describe('PrinterManager', () => {
  describe('openPrinter/closePrinter', () => {
    test('should open printer and report first status', (done) => {
      class FakeAdapater extends PrinterAdapter { }
      const buffer = Buffer.alloc(2024)
      const statusBuffer = Buffer.alloc(6)
      const status = 123456

      buffer.writeInt32LE(status)
      buffer.copy(statusBuffer, 0, 0, 6)

      adapterSetOpenPrinter(FakeAdapater)
      adapterSetClosePrinter(FakeAdapater)
      adapterSetStatus(FakeAdapater, status)

      const printerManager = new PrinterManager(FakeAdapater)

      printerManager.openPrinter(100)

      printerManager.once('statusChanged', (status) => {
        expect(status).toEqual(statusBuffer)
        printerManager.closePrinter()
        done()
      })
    })

    test('should not report if error on opening', (done) => {
      class FakeAdapater extends PrinterAdapter {}
      const openError = new Error('message')
      adapterSetOpenPrinterError(FakeAdapater, openError)

      const printerManager = new PrinterManager(FakeAdapater)

      try {
        printerManager.openPrinter(100)
        expect(1).toBe(0)
      } catch (error) {
        expect(error).toBe(openError)
      }

      shouldFailIfReceivesStatusChanged(printerManager, done)

      setTimeout(() => {
        done()
      }, 200)
    })

    test('should stop reporting if error happens', (done) => {
      class FakeAdapater extends PrinterAdapter {}
      const buffer = Buffer.alloc(2024)
      const statusBuffer = Buffer.alloc(6)
      const status = 123456

      buffer.writeInt32LE(status)
      buffer.copy(statusBuffer, 0, 0, 6)

      adapterSetOpenPrinter(FakeAdapater)
      adapterSetClosePrinter(FakeAdapater)
      adapterSetStatus(FakeAdapater, status)

      const printerManager = new PrinterManager(FakeAdapater)

      printerManager.openPrinter(100)

      printerManager.once('statusChanged', (status) => {
        expect(status).toEqual(statusBuffer)
        adapterSetStatusError(FakeAdapater, PrinterError, 8)
      })

      printerManager.once('printerDisconnected', (error) => {
        expect(error).toBeInstanceOf(PrinterError)
        expect(error.code).toEqual(8)
        shouldFailIfReceivesStatusChanged(printerManager, done)
        setTimeout(() => {
          done()
        }, 200)
      })
    })

    test('should stop reporting even if stop throws', (done) => {
      class FakeAdapater extends PrinterAdapter {}
      const buffer = Buffer.alloc(2024)
      const statusBuffer = Buffer.alloc(6)
      const status = 123456

      buffer.writeInt32LE(status)
      buffer.copy(statusBuffer, 0, 0, 6)

      adapterSetOpenPrinter(FakeAdapater)
      const closeError = new Error('message')
      adapterSetClosePrinterError(FakeAdapater, closeError)
      adapterSetStatus(FakeAdapater, status)

      const printerManager = new PrinterManager(FakeAdapater)

      printerManager.openPrinter(100)

      printerManager.once('statusChanged', (status) => {
        expect(status).toEqual(statusBuffer)
        try {
          printerManager.closePrinter()
          expect(1).toBe(0)
        } catch (error) {
          expect(error).toBe(closeError)
          shouldFailIfReceivesStatusChanged(printerManager, done)
          setTimeout(() => {
            done()
          }, 200)
        }
      })
    })
  })

  describe('getLastStatus', () => {
    test('should get latest status', (done) => {
      class FakeAdapater extends PrinterAdapter {}
      const buffer = Buffer.alloc(2024)
      const statusBuffer = Buffer.alloc(6)
      const status = 123456

      buffer.writeInt32LE(status)
      buffer.copy(statusBuffer, 0, 0, 6)

      adapterSetOpenPrinter(FakeAdapater)
      adapterSetClosePrinter(FakeAdapater)
      adapterSetStatus(FakeAdapater, status)

      const printerManager = new PrinterManager(FakeAdapater)

      printerManager.openPrinter(100)

      printerManager.once('statusChanged', (status) => {
        expect(status).toEqual(statusBuffer)
        printerManager.closePrinter()
        expect(printerManager.getLastStatus()).toEqual(statusBuffer)
        done()
      })
    })
  })
})
