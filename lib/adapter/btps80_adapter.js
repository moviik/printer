const PrinterAdapter = require('./printer_adapter')
const nodePrinter = require('@thiagoelg/node-printer')
const NodePrinterError = require('lib/node_printer/node_printer_error')
const NodePrinterStatusParser = require('lib/node_printer/status_parser')
const { set, get } = require('lodash')
const mustache = require('mustache')
const html_to_pdf = require('html-pdf')
const fs = require('fs')
const path = require('path')

const nodePrinterErrorCodes = NodePrinterError.codes()
const handle = {
}
const relativeRenderLocation = 'lib/ticket_template'

class Btps80Adapter extends PrinterAdapter {
  static _setHandle () {
    set(handle, 'fileContent', '')
    set(handle, 'options', {})
  }

  static openPrinter () {
    const printers = nodePrinter.getPrinters()
    for (const printer of printers) {
      if (printer.name === 'SNBC_BTPS80') {
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

  static setXmlFile (handle, filename) {
    const fileContent = fs.readFileSync(filename, { encoding: 'utf8' })
    set(handle, 'fileContent', fileContent)
  }

  static setXmlParamsFile (handle, filename) {
    throw new Error('not supported')
  }

  static setXmlTagValue (handle, tag, value) {
    set(handle, `options.${tag}.value`, value)
  }

  static async printXml (handle, automaticPageSize) {
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
      const pdf = `${relativeRenderLocation}/btps80_temp.pdf`
      const base = `file://${path.resolve()}/${relativeRenderLocation}/`
      html_to_pdf
        .create(
          rendered,
          { base }
        )
        .toFile(
          pdf,
          (error, res) => {
            if (error) {
              reject(error)
            }
            nodePrinter.printFile({
              printer: 'SNBC_BTPS80',
              filename: pdf,
              type: 'AUTO',
              error: (error) => {
                reject(new NodePrinterError('nodePrinter.printDirect error', nodePrinterErrorCodes.ERROR))
              },
              success: (jobId) => {
                resolve(jobId)
              }
            })
          })
    })
  }

  static toggleXmlTagValue (handle, tag, enable) {
    set(handle, `options.${tag}.enabled`, enable)
  }

  static getPrinterError () {
    return NodePrinterStatusParser
  }
}

module.exports = Btps80Adapter
