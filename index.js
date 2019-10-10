require('app-module-path/cwd')

global.lo_ = require('lodash')

const ipc = require('node-ipc')

const StatusManager = require('lib/cesmlm/status_manager')
const XmlManager = require('lib/cpt/xml_manager')
const Modus3Adapter = require('lib/adapter/modus3_adapter')

const statusErrors = Modus3Adapter.getStatusErrors()
const printErrors = Modus3Adapter.getPrintErrors()

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
          server.xmlManager.setXmlTagValue('TextBox0.text', payload.label + '\0')
          server.xmlManager.printXml()
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
  const statusManager = new StatusManager(Modus3Adapter)
  const statusParser = Modus3Adapter.getStatusParser()

  const xmlManager = new XmlManager(Modus3Adapter)
  server.xmlManager = xmlManager

  function openPrinter () {
    try {
      statusManager.openPrinter()
      xmlManager.openPrinter()
      xmlManager.setXmlFile('lib/ticket_template/Moviik.xml')
    } catch (error) {
      server.broadcast('printer.open_error', error.code)
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
