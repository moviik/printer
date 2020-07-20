const PrinterAdapter = require('./printer_adapter')
const nodePrinter = require('@thiagoelg/node-printer')
const NodePrinterError = require('lib/node_printer/node_printer_error')
const NodePrinterStatusParser = require('lib/node_printer/status_parser')
const { set, get } = require('lodash')
const mustache = require('mustache')
const convertHTMLToPDF = require('pdf-puppeteer')
const fs = require('fs')

const nodePrinterErrorCodes = NodePrinterError.codes()
const handle = {
}
const relativeRenderLocation = 'lib/ticket_template'
const printerName = 'SNBC_BTPS80'

class Btps80Adapter extends PrinterAdapter {
  static _setHandle () {
    set(handle, 'fileContent', '')
    set(handle, 'options', {})
  }

  static openPrinter () {
    const printers = nodePrinter.getPrinters()
    for (const printer of printers) {
      if (printer.name === printerName) {
        this._setHandle()
        return nodePrinterErrorCodes.SUCCESS
      }
    }
    throw new NodePrinterError('nodePrinter.getPrinters error', nodePrinterErrorCodes.NOT_FOUND)
  }

  static closePrinter () {
    return nodePrinterErrorCodes.SUCCESS
  }

  static printerStatus (buffer, size, status) {
    return nodePrinterErrorCodes.SUCCESS
  }

  static getStatusError () {
    return NodePrinterError
  }

  static getStatusParser () {
    return NodePrinterStatusParser
  }

  static getHandle () {
    return handle
  }

  static freeHandle (handle) {
    this._setHandle()
    return nodePrinterErrorCodes.SUCCESS
  }

  static setFile (handle, filename) {
    const fileContent = fs.readFileSync(filename, { encoding: 'utf8' })
    set(handle, 'fileContent', fileContent)
  }

  static setParamsFile (handle, filename) {
    throw new Error('not supported')
  }

  static setTagValue (handle, tag, value) {
    set(handle, `options.${tag}.value`, value)
  }

  static async print (handle) {
    const mustacheOptions = {}
    const options = get(handle, 'options')
    for (const option in options) {
      const optionObject = get(options, option)
      const optionEnabled = get(optionObject, 'enabled', false)
      const optionValue = get(optionObject, 'value', false)
      if (optionEnabled) {
        set(mustacheOptions, option, optionValue)
      } else {
        set(mustacheOptions, option, '')
      }
    }

    const fileContent = get(handle, 'fileContent')
    const rendered = mustache.render(fileContent, mustacheOptions)
    return new Promise((resolve, reject) => {
      const pdfFile = `${relativeRenderLocation}/btps80_temp.pdf`

      try {
        convertHTMLToPDF(
          rendered,
          () => {
            nodePrinter.printFile({
              printer: printerName,
              filename: pdfFile,
              type: 'AUTO',
              error: (error) => {
                reject(new NodePrinterError('nodePrinter.printDirect error', nodePrinterErrorCodes.ERROR))
              },
              success: (jobId) => {
                resolve(jobId)
              }
            })
          },
          { path: pdfFile, width: '80mm' },
          { executablePath: 'chromium-browser' }
        )
      } catch (error) {
        reject(error)
      }
    })
  }

  static toggleTagValue (handle, tag, enable) {
    set(handle, `options.${tag}.enabled`, enable)
  }

  static getPrinterError () {
    return NodePrinterStatusParser
  }
}

module.exports = Btps80Adapter
