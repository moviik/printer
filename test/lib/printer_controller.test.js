const PrinterController = require('lib/printer_controller')
const PrinterAdapter = require('lib/adapter/printer_adapter')
const PrinterError = require('lib/errors/printer_error')

function shouldFailIfTakesTooLong (time, done) {
  return setTimeout(() => {
    done.fail()
  }, time)
}

function shouldFailIfReceivesPrinterOpenError (controller, done) {
  controller.on('printer.open_error', () => {
    done.fail()
  })
}

function shouldFailIfReceivesPrinterStatus (controller, done) {
  controller.on('printer.status', () => {
    done.fail()
  })
}

describe('PrinterController', () => {
  describe('open/close', () => {
    it('should open and report status', (done) => {
      const statusBuffer = Buffer.alloc(6)
      const newStatus = 16
      statusBuffer.writeUInt32BE(newStatus)
      class FakeAdapter extends PrinterAdapter {
        static openPrinter () {}
        static closePrinter () {}
        static printerStatus (printerStatus) { printerStatus.writeUInt32BE(newStatus) }
        static getStatusErrors () {}
        static getPrintErrors () {}
        static getHandle () {}
        static freeHandle () {}
      }

      const controller = new PrinterController(FakeAdapter, 100, 100)
      controller.on('printer.opened', () => {
        controller.on('printer.status', (status) => {
          expect(status).toEqual(statusBuffer)
          controller.closePrinter()
          done()
        })
      })
      controller.openPrinter()
    })

    it('should open twice and nothing happens', (done) => {
      const statusBuffer = Buffer.alloc(6)
      const newStatus = 16
      statusBuffer.writeUInt32BE(newStatus)
      class FakeAdapter extends PrinterAdapter {
        static openPrinter () {}
        static closePrinter () {}
        static printerStatus (printerStatus) { printerStatus.writeUInt32BE(newStatus) }
        static getStatusErrors () {}
        static getPrintErrors () {}
        static getHandle () {}
        static freeHandle () {}
      }

      const controller = new PrinterController(FakeAdapter, 100, 100)
      controller.on('printer.opened', () => {
        controller.once('printer.status', (status) => {
          expect(status).toEqual(statusBuffer)
          controller.openPrinter()
          const secondStatus = 13
          statusBuffer.writeUInt32BE(secondStatus)
          FakeAdapter.printerStatus = (printerStatus) => { printerStatus.writeUInt32BE(secondStatus) }
          controller.on('printer.status', (status) => {
            expect(status).toEqual(statusBuffer)
            controller.closePrinter()
            done()
          })
        })
      })
      controller.openPrinter()
    })

    it('should fail to open because of status and retry until opened', (done) => {
      const statusBuffer = Buffer.alloc(6)
      const newStatus = 16
      statusBuffer.writeUInt32BE(newStatus)
      const error_code = 'hey'
      class FakeAdapter extends PrinterAdapter {
        static openPrinter () { throw new PrinterError('message', 1) }
        static closePrinter () {}
        static printerStatus (printerStatus) { printerStatus.writeUInt32BE(newStatus) }
        static getStatusErrors () { return { toString: () => { return error_code } } }
        static getPrintErrors () {}
        static getHandle () {}
        static freeHandle () {}
      }

      const controller = new PrinterController(FakeAdapter, 100, 100)
      controller.openPrinter()

      // should receive first open error
      controller.once('printer.open_error', (error) => {
        expect(error).toStrictEqual({ error_code })
        let timer = shouldFailIfTakesTooLong(200, done, 'timer1')
        // should receive second open error
        controller.once('printer.open_error', (error) => {
          expect(error).toStrictEqual({ error_code })
          clearTimeout(timer)
          timer = shouldFailIfTakesTooLong(300, done)
          FakeAdapter.openPrinter = () => {}
          shouldFailIfReceivesPrinterOpenError(controller, done)
          controller.on('printer.opened', () => {
            controller.on('printer.status', (status) => {
              // timer cleared, because status was received
              clearTimeout(timer)
              expect(status).toEqual(statusBuffer)
              controller.closePrinter()
              done()
            })
          })
        })
      })
    })

    it('should fail to open because of xml and retry until opened, but still receives status', (done) => {
      const statusBuffer = Buffer.alloc(6)
      const firstStatus = 16
      statusBuffer.writeUInt32BE(firstStatus)
      const error_code = 'hey'
      class FakeAdapter extends PrinterAdapter {
        static openPrinter () {}
        static closePrinter () {}
        static printerStatus (printerStatus) { printerStatus.writeUInt32BE(firstStatus) }
        static getStatusErrors () {}
        static getPrintErrors () { return { toString: () => { return error_code } } }
        static getHandle () { throw new PrinterError('message', 1) }
        static freeHandle () {}
      }

      const controller = new PrinterController(FakeAdapter, 100, 100)
      controller.openPrinter()
      // should receive status anyway, although printing is not possible
      controller.once('printer.status', (status) => {
        expect(status).toEqual(statusBuffer)
        // should receive open error, could not be the first, does not matter
        controller.once('printer.open_error', (error) => {
          expect(error).toStrictEqual({ error_code })
          const timer = shouldFailIfTakesTooLong(200, done)
          // should receive open error again
          controller.once('printer.open_error', (error) => {
            expect(error).toStrictEqual({ error_code })
            clearTimeout(timer)
            const secondStatus = 15
            statusBuffer.writeUInt32BE(secondStatus)
            FakeAdapter.printerStatus = (printerStatus) => { printerStatus.writeUInt32BE(secondStatus) }
            // should keep receiving status report
            controller.on('printer.status', (status) => {
              expect(status).toEqual(statusBuffer)
              FakeAdapter.getHandle = () => {}
              // should fail it receives open error again, because xml handle is fine
              shouldFailIfReceivesPrinterOpenError(controller, done)
              controller.on('printer.opened', () => {
                controller.closePrinter()
                done()
              })
            })
          })
        })
      })
    })

    it('should fail to open because both xml and status failed', (done) => {
      const error_code = 'hey'
      class FakeAdapter extends PrinterAdapter {
        static openPrinter () { throw new PrinterError('message', 1) }
        static closePrinter () { }
        static printerStatus () { }
        static getStatusErrors () { return { toString: () => { return error_code } } }
        static getPrintErrors () { return { toString: () => { return error_code } } }
        static getHandle () { throw new PrinterError('message', 1) }
        static freeHandle () { }
      }

      const controller = new PrinterController(FakeAdapter, 100, 100)
      controller.openPrinter()
      controller.once('printer.open_error', (error) => {
        expect(error).toStrictEqual({ error_code })
        let timer = shouldFailIfTakesTooLong(200, done)
        controller.once('printer.open_error', (error) => {
          clearTimeout(timer)
          timer = shouldFailIfTakesTooLong(200, done)
          expect(error).toStrictEqual({ error_code })
          FakeAdapter.openPrinter = () => {}
          controller.once('printer.open_error', (error) => {
            clearTimeout(timer)
            timer = shouldFailIfTakesTooLong(200, done)
            expect(error).toStrictEqual({ error_code })
            FakeAdapter.getHandle = () => {}
            controller.on('printer.opened', () => {
              clearTimeout(timer)
              controller.closePrinter()
              done()
            })
          })
        })
      })
    })

    it('should close', (done) => {
      class FakeAdapter extends PrinterAdapter {
        static openPrinter () {}
        static closePrinter () { }
        static printerStatus () { }
        static getStatusErrors () { }
        static getPrintErrors () {}
        static getHandle () {}
        static freeHandle () {}
      }

      const controller = new PrinterController(FakeAdapter, 100, 100)
      controller.on('printer.opened', () => {
        controller.on('printer.closed', () => {
          done()
        })
        controller.closePrinter()
      })
      controller.openPrinter()
    })

    it('should fail to close status', (done) => {
      const error_code = 'hey'
      class FakeAdapter extends PrinterAdapter {
        static openPrinter () {}
        static closePrinter () { throw new PrinterError('message', 1) }
        static printerStatus () { }
        static getStatusErrors () { return { toString: () => { return error_code } } }
        static getPrintErrors () {}
        static getHandle () {}
        static freeHandle () {}
      }

      const controller = new PrinterController(FakeAdapter, 100, 100)
      controller.on('printer.opened', () => {
        controller.on('printer.close_error', (error) => {
          expect(error).toStrictEqual({ error_code })
          shouldFailIfReceivesPrinterStatus(controller, done)
          controller.on('printer.closed', () => {
            setTimeout(() => {
              done()
            }, 200)
          })
        })
        controller.closePrinter()
      })
      controller.openPrinter()
    })

    it('should fail to close xml', (done) => {
      const error_code = 'hey'
      class FakeAdapter extends PrinterAdapter {
        static openPrinter () {}
        static closePrinter () { }
        static printerStatus () { }
        static getStatusErrors () { }
        static getPrintErrors () { return { toString: () => { return error_code } } }
        static getHandle () {}
        static freeHandle () { throw new PrinterError('message', 1) }
      }

      const controller = new PrinterController(FakeAdapter, 100, 100)
      controller.on('printer.opened', () => {
        controller.on('printer.close_error', (error) => {
          expect(error).toStrictEqual({ error_code })
          shouldFailIfReceivesPrinterStatus(controller, done)
          controller.on('printer.closed', () => {
            setTimeout(() => {
              done()
            }, 200)
          })
        })
        controller.closePrinter()
      })
      controller.openPrinter()
    })
  })
})
