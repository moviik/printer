require('app-module-path/cwd')

global.lo_ = require('lodash')

const ipc = require('node-ipc')
const EventEmitter = require('events')

const modus3Adapter = require('lib/adapter/modus3_adapter')
const cupsAdapter = require('lib/adapter/cups_adapter')
const PrinterController = require('lib/printer_controller')
const TicketBuilder = require('lib/ticket_template/ticket_builder')
const TicketBuilderError = require('lib/errors/ticket_builder_error')
const { argv } = process

function getCupsPrinterIndex () {
  return argv.findIndex((arg) => {
    return arg.includes('--cups-printer')
  })
}

function getAdapter () {
  return getCupsPrinterIndex() !== -1 ? cupsAdapter : modus3Adapter
}

function getCupsPrinterName () {
  return lo_.last(
    lo_.get(argv, getCupsPrinterIndex())
      .split('=')
  )
}

const chosenAdapter = getAdapter()
const PrinterError = chosenAdapter.getPrinterError()

const printerController = new PrinterController(chosenAdapter, 1000, 200)
const ticketBuilder = new TicketBuilder(
  printerController,
  ['label'],
  ['serviceName', 'serviceDescription', 'dateTime', 'footer']
)

function registerEvents (server) {
  const statusParser = chosenAdapter.getStatusParser()
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
    server.on('printer.print', async (payload, socket) => {
      try {
        ticketBuilder.build(payload)
        await printerController.print()
        server.broadcast('printer.print_reply', { success: true })
      } catch (error) {
        if (error instanceof PrinterError) {
          server.broadcast('printer.print_reply', { success: false, error_code: PrinterError.toString(error.code) })
        } else if (error instanceof TicketBuilderError) {
          server.broadcast('printer.print_reply', { success: false, error_code: error.message })
        } else {
          server.broadcast('printer.print_reply', { success: false, error_code: `unknown ${error.message}` })
        }
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
  if (chosenAdapter === cupsAdapter) {
    printerController.openPrinter(getCupsPrinterName())
    printerController.setFile('lib/ticket_template/cups.html')
  } else {
    printerController.openPrinter()
    printerController.setFile('lib/ticket_template/60mm.xml')
  }
})
