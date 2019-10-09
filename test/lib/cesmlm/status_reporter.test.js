const PrinterAdapter = require('lib/adapter/printer_adapter')
const PrinterStatusReporter = require('lib/cesmlm/status_reporter')
const PrinterError = require('lib/errors/printer_error')

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

function shouldFailIfReceivesStatusChanged (reporter, done) {
  reporter.once('statusChanged', () => {
    done.fail()
  })
}

describe('PrinterStatusReporter', () => {
  describe('getPrinterStatus', () => {
    test('should return printer status', () => {
      const buffer = Buffer.alloc(2024)
      const statusBuffer = Buffer.alloc(6)
      const status = 123456

      buffer.writeInt32LE(status)
      buffer.copy(statusBuffer, 0, 0, 6)

      class FakeAdapter extends PrinterAdapter {}
      adapterSetStatus(FakeAdapter, status)

      const statusReporter = new PrinterStatusReporter(FakeAdapter)
      expect(statusReporter.getPrinterStatus()).toEqual(statusBuffer)
    })
  })

  describe('getLastStatus', () => {
    test('first status should be set of zeros', () => {
      class FakeAdapter extends PrinterAdapter {}
      const statusReporter = new PrinterStatusReporter(FakeAdapter)
      const buffer = Buffer.alloc(6)
      buffer.fill(0, 0, 6)
      expect(statusReporter.getLastStatus()).toEqual(buffer)
    })
  })

  describe('start/stop', () => {
    test('should emit status only when changed', (done) => {
      const buffer = Buffer.alloc(2024)
      const statusBuffer = Buffer.alloc(6)
      const status = 123456

      buffer.writeInt32LE(status)
      buffer.copy(statusBuffer, 0, 0, 6)

      class FakeAdapter extends PrinterAdapter {}
      adapterSetStatus(FakeAdapter, status)

      const statusReporter = new PrinterStatusReporter(FakeAdapter)

      statusReporter.start(100)
      statusReporter.once('statusChanged', (status) => {
        expect(status).toEqual(statusBuffer)

        status = 887
        buffer.writeInt32LE(status)
        buffer.copy(statusBuffer, 0, 0, 6)
        adapterSetStatus(FakeAdapter, status)

        statusReporter.once('statusChanged', (status) => {
          expect(status).toEqual(statusBuffer)
          shouldFailIfReceivesStatusChanged(statusReporter, done)

          setTimeout(() => {
            statusReporter.removeAllListeners('statusChanged')
            status = 883
            buffer.writeInt32LE(status)
            buffer.copy(statusBuffer, 0, 0, 6)
            adapterSetStatus(FakeAdapter, status)

            statusReporter.once('statusChanged', (status) => {
              expect(status).toEqual(statusBuffer)
              statusReporter.stop()
              expect(statusReporter.getLastStatus()).toEqual(statusBuffer)
              done()
            })
          }, 200)
        })
      })
    })

    test('should emit statusError continuously', (done) => {
      const buffer = Buffer.alloc(2024)
      const statusBuffer = Buffer.alloc(6)
      const status = 123456

      buffer.writeInt32LE(status)
      buffer.copy(statusBuffer, 0, 0, 6)

      class FakeAdapter extends PrinterAdapter {}
      adapterSetStatus(FakeAdapter, status)

      const statusReporter = new PrinterStatusReporter(FakeAdapter)

      statusReporter.start(100)
      statusReporter.once('statusChanged', (status) => {
        expect(status).toEqual(statusBuffer)
        adapterSetStatusError(FakeAdapter, PrinterError, 3)
      })

      statusReporter.once('statusError', (error) => {
        expect(error).toBeInstanceOf(PrinterError)
        expect(error.code).toEqual(3)
      })
      statusReporter.once('statusError', (error) => {
        expect(error).toBeInstanceOf(PrinterError)
        expect(error.code).toEqual(3)
        adapterSetStatus(FakeAdapter, statusBuffer)
      })

      statusReporter.once('statusChanged', (status) => {
        expect(status).toEqual(statusBuffer)
        statusReporter.stop()
        done()
      })
    })

    test('should emit unknownError if no PrinterError is thrown', (done) => {
      const buffer = Buffer.alloc(2024)
      const statusBuffer = Buffer.alloc(6)
      const status = 123456

      buffer.writeInt32LE(status)
      buffer.copy(statusBuffer, 0, 0, 6)

      class FakeAdapter extends PrinterAdapter {}
      adapterSetStatus(FakeAdapter, status)

      const statusReporter = new PrinterStatusReporter(FakeAdapter)

      statusReporter.start(100)
      statusReporter.once('statusChanged', (status) => {
        expect(status).toEqual(statusBuffer)
        adapterSetStatusError(FakeAdapter, Error)
      })

      statusReporter.once('unknownError', (error) => {
        expect(error).toBeInstanceOf(Error)
      })
      statusReporter.once('unknownError', (error) => {
        expect(error).toBeInstanceOf(Error)
        statusReporter.stop()
        done()
      })
    })
  })
})
