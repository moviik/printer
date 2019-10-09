require('app-module-path/cwd')
const ipc = require('node-ipc')

ipc.config.id = 'mik_printer'
ipc.config.silent = true
ipc.config.maxConnections = 1
ipc.serve(() => {
  const server = ipc.server
  server.on('connect', (socket) => {

  })
  server.on('client.id', (object, data) => {
    console.log('received from client')
    console.log(object)
  })
})

ipc.server.start()

global.lo_ = require('lodash')

const StatusManager = require('lib/cesmlm/status_manager')
const PrinterError = require('lib/errors/printer_error')
const Modus3Adapter = require('lib/adapter/modus3_adapter')

const statusManager = new StatusManager(Modus3Adapter)
const statusErrors = Modus3Adapter.getStatusErrors()
const statusParser = Modus3Adapter.getStatusParser()

function openPrinter () {
  try {
    statusManager.openPrinter()
  } catch (error) {
    if (!(error instanceof PrinterError)) {
      throw error
    }
    console.log(`Printer not available: ${statusErrors.toString(error.code)}`)
  }
}

openPrinter()

statusManager.on('printerDisconnected', (error) => {
  console.log('printer Disconnected')
  console.log(statusErrors.toString(error.code))
})

statusManager.on('statusChanged', async (rawStatus) => {
  const parsedStatus = statusParser.parse(rawStatus)
  console.log(statusParser.toStringArray(parsedStatus))
})
