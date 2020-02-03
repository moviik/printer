const PrinterController = require('lib/printer_controller')
const PrinterAdapter = require('lib/adapter/printer_adapter')
const TicketBuilder = require('lib/ticket_template/ticket_builder')
const TicketBuilderError = require('lib/errors/ticket_builder_error')

describe('Ticket builder', () => {
  describe('build', () => {
    it('should build', (done) => {
      let setCount = 0

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
        static setXmlTagValue (handle, tag, value) {
          setCount++
          if (setCount === 1) {
            expect(tag).toEqual(`${option}.hidden`)
            expect(value).toEqual(0)
          }
          if (setCount === 2) {
            expect(tag).toEqual(`${option}.text`)
            expect(value).toEqual(optionValue)
            done()
          }
        }
      }
      const controller = new PrinterController(FakeAdapter, 100, 100)
      const ticketBuilder = new TicketBuilder(controller)
      ticketBuilder.build({ [option]: optionValue })
    })

    it('should build with optional', (done) => {
      let setCount = 0

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
        static setXmlTagValue (handle, tag, value) {
          setCount++
          if (setCount === 1) {
            expect(tag).toEqual(`${optionalField}.hidden`)
            expect(value).toEqual(1)
            done()
          }
          if (setCount === 2) {
            expect(tag).toEqual(`${option}.hidden`)
            expect(value).toEqual(0)
          }
          if (setCount === 3) {
            expect(tag).toEqual(`${option}.text`)
            expect(value).toEqual(optionValue)
          }
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
        static setXmlTagValue () {}
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
