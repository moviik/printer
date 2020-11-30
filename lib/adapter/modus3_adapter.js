const nodePrinter = require('@thiagoelg/node-printer')
const { set, get } = require('lodash')
const mustache = require('mustache')
const fs = require('fs')

const NodePrinterError = require('lib/node_printer/node_printer_error')
const NodePrinterStatusParser = require('lib/node_printer/status_parser')
const PrinterAdapter = require('./printer_adapter')
const cesmlmWrapper = require('lib/cesmlm/wrapper')
const cesmlmStatusParser = require('lib/cesmlm/status_parser')
const CesmlmPrinterError = require('lib/cesmlm/cesmlm_printer_error')
const browser = require('lib/helpers/browser')

const cesmlmErrorCodes = CesmlmPrinterError.codes()
const nodePrinterErrorCodes = NodePrinterError.codes()

const handle = {
}
const relativeRenderLocation = 'lib/ticket_template'

class Modus3Adapter extends PrinterAdapter {
  static _resetHandle () {
    set(handle, 'fileContent', '')
    set(handle, 'options', {})
    set(handle, 'printerName', '')
  }

  static _openStatus () {
    const result = cesmlmWrapper.openUSBDevice(0x0DD4, 0x023b, null)
    if (result !== cesmlmErrorCodes.SUCCESS) {
      throw new CesmlmPrinterError('openUSBDevice error', result)
    }
  }

  static _openPrint (printerName) {
    const printers = nodePrinter.getPrinters()
    for (const printer of printers) {
      if (printer.name === printerName) {
        this._resetHandle()
        handle.printerName = printerName
        return nodePrinterErrorCodes.SUCCESS
      }
    }
    throw new NodePrinterError('nodePrinter.getPrinters error', nodePrinterErrorCodes.NOT_FOUND)
  }

  static openPrinter (printerName) {
    this._openStatus()
    this._openPrint(printerName)
  }

  static _closePrint () {
  }

  static _closeStatus () {
    const result = cesmlmWrapper.closeUSBDevice()
    if (result !== cesmlmErrorCodes.SUCCESS) {
      throw new CesmlmPrinterError('closeUSBDevice error', result)
    }
  }

  static closePrinter () {
    this._closePrint()
    this._closeStatus()
  }

  static printerStatus (buffer, size, status) {
    const result = cesmlmWrapper.getPrinterStatus(buffer, size, status)
    if (result !== cesmlmErrorCodes.SUCCESS) {
      throw new CesmlmPrinterError('getPrinterStatus error', result)
    }
  }

  static getStatusError () {
    return CesmlmPrinterError
  }

  static getStatusParser () {
    return cesmlmStatusParser
  }

  static getHandle () {
    return handle
  }

  static freeHandle (handle) {
    this._resetHandle()
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

  static async print (handle, automaticPageSize) {
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
    const pdfFile = `${relativeRenderLocation}/cups_temp.pdf`

    const browserInstance = await browser()
    const page = await browserInstance.newPage()
    await page.setContent(rendered)
    const pageHeight = await page.evaluate(() => document.anchorOffsetTopBecausePuppeteerSucksCocks)
    await page.pdf({
      path: pdfFile,
      height: `${pageHeight}px`,
      width: '52mm',
      pageRanges: '1-1'
    })
    return new Promise((resolve, reject) => {
      try {
        nodePrinter.printFile({
          printer: handle.printerName,
          filename: pdfFile,
          type: 'AUTO',
          error: (error) => {
            reject(new NodePrinterError('nodePrinter.printDirect error', nodePrinterErrorCodes.ERROR))
          },
          success: (jobId) => {
            page.close().then(() => {
              resolve(jobId)
            })
          }
        })
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

module.exports = Modus3Adapter
