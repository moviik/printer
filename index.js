require('app-module-path/cwd')

global.lo_ = require('lodash')

const ipc = require('node-ipc')

const Modus3Adapter = require('lib/adapter/modus3_adapter')
const PrinterController = require('lib/printer_controller')

const statusErrors = Modus3Adapter.getStatusErrors()
const printErrors = Modus3Adapter.getPrintErrors()

const printerController = new PrinterController(Modus3Adapter, 1000, 1000)

function configIpcServer () {
  return new Promise((resolve, reject) => {
    ipc.config.id = 'mik_printer'
    ipc.config.silent = true
    ipc.config.maxConnections = 1
    ipc.serve(() => {
      const server = ipc.server
      server.on('connect', (socket) => {

      })
      server.on('client.id', (payload, socket) => {
        console.log('client.id')
        console.log(payload)
        resolve(server)
      })
      server.on('printer.print', (payload, socket) => {
        try {
          console.log('printer.print')
          console.log(payload)
          printerController.setXmlTagValue('TextBox0.text', payload.label + '\0')
          printerController.printXml()
          server.broadcast('printer.print_reply', { success: true })
        } catch (error) {
          server.broadcast('printer.print_reply', { success: false, error_code: printErrors.toString(error.code) })
        }
      })
    })
    ipc.server.start()
  })
}

configIpcServer().then((server) => {
  const statusParser = Modus3Adapter.getStatusParser()

  function openPrinter () {
    try {
      printerController.openPrinter()
      printerController.setXmlFile('lib/ticket_template/Moviik.xml')
    } catch (error) {
      server.broadcast('printer.open_error', error.code)
    }
  }

  openPrinter()

  printerController.on('printer.opened', () => {
    server.broadcast('printer.opened')
  })

  printerController.on('printer.closed', () => {
    server.broadcast('printer.closed')
  })

  printerController.on('printer.close_error', () => {
    server.broadcast('printer.close_error')
  })

  printerController.on('printer.open_error', () => {
    server.broadcast('printer.open_error')
  })

  printerController.on('printer.status', async (rawStatus) => {
    const status = statusParser.toStringArray(statusParser.parse(rawStatus))
    server.broadcast('printer.status', { status })
  })

  printerController.on('printer.disconnected', (error) => {
    server.broadcast('printer.disconnected', error)
  })
})
