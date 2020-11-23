#!/usr/bin/env node

require('app-module-path/cwd')
global.lo_ = require('lodash')

const program = require('caporal')
const prompt = require('prompt-async')

const PrinterController = require('lib/printer_controller')
const Modus3Adapter = require('lib/adapter/modus3_adapter')
const TicketBuilder = require('lib/ticket_template/ticket_builder')

prompt.start()

program
  .version('1.0.0')
  .description('Modus3')
  .command('print', 'Print a ticket')
  .option('--printerName <printerName>', 'CUPS printer name', program.STRING, undefined, true)
  .option('--label <label>', 'Label to print', program.STRING, undefined, true)
  .option('--serviceName [serviceName]', 'Service name', program.STRING, '', false)
  .option('--serviceDescription [serviceDescription]', 'Service description', program.STRING, '', false)
  .option('--dateTime [dateTime]', 'Date time message under the ticket label', program.STRING, '', false)
  .option('--footer [footer]', 'footer', program.STRING, '', false)
  .action(printCommand)

program.parse(process.argv)

function printCommand (args, options) {
  const printerController = new PrinterController(Modus3Adapter, 1000, 1000)
  printerController.on('printer.open_error', (error) => {
    throw new Error('error opening printer')
  })

  printerController.on('printer.opened', async () => {
    const ticketBuilder = new TicketBuilder(printerController, ['label'])
    printerController.setFile('lib/ticket_template/cups.html')

    ticketBuilder.build(options)
    await printerController.print()
    printerController.closePrinter()
  })
  printerController.openPrinter(options.printerName)
}

process.on('unhandledRejection', (reason, p) => {
  process.exit(1)
})
