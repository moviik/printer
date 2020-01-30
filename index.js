require('app-module-path/cwd')

global.lo_ = require('lodash')

const ipc = require('node-ipc')
const EventEmitter = require('events')

const Modus3Adapter = require('lib/adapter/modus3_adapter')
const PrinterController = require('lib/printer_controller')
const printErrors = Modus3Adapter.getPrintErrors()

const printerController = new PrinterController(Modus3Adapter, 1000, 200)

function registerEvents (server) {
  const statusParser = Modus3Adapter.getStatusParser()
  printerController.on('printer.opened', () => {
    server.broadcast('printer.opened')
  })

  printerController.on('printer.closed', () => {
    server.broadcast('printer.closed')
  })

  printerController.on('printer.close_error', (error) => {
    server.broadcast('printer.close_error', error)
  })

  printerController.on('printer.open_error', (error) => {
    server.broadcast('printer.open_error', error)
  })

  printerController.on('printer.status', async (rawStatus) => {
    const status = statusParser.toStringArray(statusParser.parse(rawStatus))
    server.broadcast('printer.status', { status })
  })

  printerController.on('printer.disconnected', (error) => {
    server.broadcast('printer.disconnected', error)
  })
}

function configIpcServer () {
  const emitter = new EventEmitter()
  ipc.config.id = 'mik_printer'
  ipc.config.silent = true
  ipc.config.maxConnections = 1
  ipc.serve(() => {
    const server = ipc.server
    registerEvents(server)
    server.on('connect', (socket) => {

    })
    server.on('client.id', (payload, socket) => {
      emitter.emit('start')
    })
    server.on('socket.disconnected', (socket, destroyedSocketId) => {
      emitter.emit('stop')
    })
    server.on('printer.print', (payload, socket) => {
      try {
        printerController.setXmlTagValue('label.text', payload.label)
        printerController.printXml()
        server.broadcast('printer.print_reply', { success: true })
      } catch (error) {
        server.broadcast('printer.print_reply', { success: false, error_code: printErrors.toString(error.code) })
      }
    })
  })
  ipc.server.start()
  return emitter
}

const emitter = configIpcServer()
emitter.on('stop', () => {
  printerController.closePrinter()
})

emitter.on('start', () => {
  printerController.openPrinter()
  printerController.setXmlFile('lib/ticket_template/80mm.xml')
})
