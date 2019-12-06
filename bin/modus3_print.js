#!/usr/bin/env node

require('app-module-path/cwd')
global.lo_ = require('lodash')

const program = require('caporal')
const prompt = require('prompt-async')
const PrinterController = require('lib/printer_controller')
const Modus3Adapter = require('lib/adapter/modus3_adapter')

prompt.start()

program
  .version('1.0.0')
  .description('Modus3')
  .command('print', 'Print a ticket')
  .option('--label <label>', 'Label to print', program.STRING, undefined, true)
  .action(print)

program.parse(process.argv)

async function print (args, options) {
  const printerController = new PrinterController(Modus3Adapter, 1000, 1000)
  printerController.openPrinter()
  printerController.setXmlFile('lib/ticket_template/Moviik.xml')
  printerController.setXmlTagValue('TextBox0.text', options.label + '\0')
  printerController.printXml()
  printerController.closePrinter()
}

process.on('unhandledRejection', (reason, p) => {
  process.exit(1)
})
