require('app-module-path/cwd')

global.lo_ = require('lodash')

const ipc = require('node-ipc')
const StatusManager = require('lib/cesmlm/status_manager')
const PrinterError = require('lib/errors/printer_error')
const Modus3Adapter = require('lib/adapter/modus3_adapter')

function configIpcServer () {
  return new Promise((resolve, reject) => {
    ipc.config.id = 'mik_printer'
    ipc.config.silent = true
    ipc.config.maxConnections = 1
    ipc.serve(() => {
      const server = ipc.server
      server.on('connect', (socket) => {

      })
      server.on('client.id', (socket, payload) => {
        resolve(server)
      })
    })
    ipc.server.start()
  })
}

configIpcServer().then((server) => {
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

  statusManager.on('statusChanged', async (rawStatus) => {
    const status = statusParser.toStringArray(statusParser.parse(rawStatus))
    server.broadcast('printer.status', { status })
  })

  statusManager.on('printerDisconnected', (error) => {
    const error_code = statusErrors.toString(error.code)
    server.broadcast('printer.disconnected', { error_code })
  })
})
