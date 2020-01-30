#!/usr/bin/env node

require('app-module-path/cwd')
global.lo_ = require('lodash')

const program = require('caporal')
const prompt = require('prompt-async')
const moment = require('moment')

const PrinterController = require('lib/printer_controller')
const Modus3Adapter = require('lib/adapter/modus3_adapter')
const TicketBuilder = require('lib/ticket_template/ticket_builder')

const DATE_FORMAT = 'YYYY-MM-DD'
const TIME_FORMAT = 'HH:mm'
const TIMESTAMP_FORMAT = DATE_FORMAT + ' ' + TIME_FORMAT

prompt.start()

program
  .version('1.0.0')
  .description('Modus3')
  .command('print', 'Print a ticket')
  .option('--label <label>', 'Label to print', program.STRING, undefined, true)
  .option('--serviceName [serviceName]', 'Service name', program.STRING, '', false)
  .option('--serviceDescription [serviceDescription]', 'Service description', program.STRING, '', false)
  .option('--timestamp [timestamp]', `Timestamp in format ${TIMESTAMP_FORMAT}`, program.STRING, '', false)
  .option('--peopleAhead [peopleAhead]', 'People ahead', program.STRING, '', false)
  .action(printCommand)

program.parse(process.argv)

function printCommand (args, options) {
  const printerController = new PrinterController(Modus3Adapter, 1000, 1000)
  printerController.on('printer.open_error', (error) => {
    throw new Error('error opening printer')
  })

  printerController.on('printer.opened', () => {
    const ticketBuilder = new TicketBuilder(printerController, ['label'])
    printerController.setXmlFile('lib/ticket_template/80mm.xml')

    if (options.timestamp) {
      const timestamp = moment(options.timestamp)
      lo_.set(options, 'date', timestamp.format(DATE_FORMAT))
      lo_.set(options, 'time', timestamp.format(TIME_FORMAT))
    }
    if (options.peopleAhead) {
      options.peopleAhead = 'Pessoas à sua frente: ' + options.peopleAhead
    }
    ticketBuilder.build(options)
    printerController.printXml()
    printerController.closePrinter()
  })
  printerController.openPrinter()
}

process.on('unhandledRejection', (reason, p) => {
  process.exit(1)
})
