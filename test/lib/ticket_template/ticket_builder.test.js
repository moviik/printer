const PrinterController = require('lib/printer_controller')
const PrinterAdapter = require('lib/adapter/printer_adapter')
const TicketBuilder = require('lib/ticket_template/ticket_builder')
const TicketBuilderError = require('lib/errors/ticket_builder_error')

describe('Ticket builder', () => {
  describe('build', () => {
    it('should build', (done) => {
      let callCount = 0
      const option = 'label'
      const optionValue = 'whatevs'

      class FakeAdapter extends PrinterAdapter {
        static openPrinter () {}
        static closePrinter () {}
        static printerStatus () { }
        static getStatusError () { }
        static getPrinterError () {}
        static getHandle () {}
        static freeHandle () {}
        static setTagValue (handle, tag, value) {
          expect(tag).toEqual(option)
          expect(value).toEqual(optionValue)
          expect(callCount).toEqual(1)
          done()
        }

        static toggleTagValue (handle, tag, enable) {
          expect(tag).toEqual(option)
          expect(enable).toEqual(true)
          expect(callCount).toEqual(0)
          callCount++
        }
      }
      const controller = new PrinterController(FakeAdapter, 100, 100)
      const ticketBuilder = new TicketBuilder(controller)
      ticketBuilder.build({ [option]: optionValue })
    })

    it('should build with optional', (done) => {
      let callCount = 0

      const option = 'label'
      const optionValue = 'whatevs'

      const optionalField = 'optional'

      class FakeAdapter extends PrinterAdapter {
        static openPrinter () {}
        static closePrinter () {}
        static printerStatus () { }
        static getStatusError () { }
        static getPrinterError () {}
        static getHandle () {}
        static freeHandle () {}
        static setTagValue (handle, tag, value) {
          expect(callCount).toEqual(2)
          expect(tag).toEqual(option)
          expect(value).toEqual(optionValue)
          done()
        }

        static toggleTagValue (handle, tag, enable) {
          if (callCount === 0) {
            expect(tag).toEqual(optionalField)
            expect(enable).toEqual(false)
          }
          if (callCount === 1) {
            expect(tag).toEqual(option)
            expect(enable).toEqual(true)
          }
          callCount++
        }
      }
      const controller = new PrinterController(FakeAdapter, 100, 100)
      const ticketBuilder = new TicketBuilder(controller, [], [optionalField])
      ticketBuilder.build({ [option]: optionValue })
    })

    it('should throw if mandatory is not provided', (done) => {
      class FakeAdapter extends PrinterAdapter {
        static openPrinter () {}
        static closePrinter () {}
        static printerStatus () {}
        static getStatusError () {}
        static getPrinterError () {}
        static getHandle () {}
        static freeHandle () {}
        static setTagValue () {}
        static toggleTagValue () {}
      }
      const controller = new PrinterController(FakeAdapter, 100, 100)
      const required = 'whatevs'
      const ticketBuilder = new TicketBuilder(controller, [required])
      try {
        ticketBuilder.build({})
        done.fail()
      } catch (error) {
        expect(error).toBeInstanceOf(TicketBuilderError)
        expect(error.message).toEqual(`${required} not provided`)
        done()
      }
    })
  })
})
