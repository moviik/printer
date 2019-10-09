const PrinterAdapter = require('./printer_adapter')

const PrinterError = require('lib/errors/printer_error')

const cesmlmWrapper = require('lib/cesmlm/cesmlm_wrapper')
const cesmlmErrors = require('lib/cesmlm/com_errors')
const cesmlmStatusParser = require('lib/cesmlm/cesmlm_status_parser')

const cptWrapper = require('lib/cpt/cpt_wrapper')
const printErrors = require('lib/cpt/print_errors')

class Modus3Adapter extends PrinterAdapter {
  static openPrinter () {
    const result = cesmlmWrapper.openUSBDevice(0x0DD4, 0x023b, null)
    if (result !== cesmlmErrors.codes.SUCCESS) {
      throw new PrinterError('openUSBDevice error', result)
    }
  }

  static closePrinter () {
    const result = cesmlmWrapper.closeUSBDevice()
    if (result !== cesmlmErrors.codes.SUCCESS) {
      throw new PrinterError('closeUSBDevice error', result)
    }
  }

  static printerStatus (buffer, size, status) {
    const result = cesmlmWrapper.getPrinterStatus(buffer, size, status)
    if (result !== cesmlmErrors.codes.SUCCESS) {
      throw new PrinterError('getPrinterStatus error', result)
    }
  }

  static getStatusErrors () {
    return cesmlmErrors
  }

  static getStatusParser () {
    return cesmlmStatusParser
  }

  static getHandle () {
    return cptWrapper.getXmlPrintHandle(Buffer.from('CUSTOM_SPA_MODUS3'))
  }

  static freeHandle (handle) {
    const result = cptWrapper.freeXmlPrintHandle(handle)
    if (result !== printErrors.codes.SUCCESS) {
      throw new PrinterError('freeHandle error', result)
    }
  }

  static setXmlFile (handle, filename) {
    const result = cptWrapper.setXmlFileName(handle, Buffer.from(filename))
    if (result !== printErrors.codes.CUSTOM_XMLPRINT_SUCCESS) {
      throw new PrinterError('setXmlFileName error', result)
    }
  }

  static setXmlParamsFile (handle, filename) {
    const result = cptWrapper.setXmlObjectsFromParamFile(handle, Buffer.from(filename))
    if (result !== printErrors.codes.CUSTOM_XMLPRINT_SUCCESS) {
      throw new PrinterError('setXmlObjectsFromParamFile error', result)
    }
  }

  static setXmlTagValue (handle, tag, value) {
    const result = cptWrapper.setXmlObjectTag(handle, Buffer.from(tag), Buffer.from(value))
    if (result !== printErrors.codes.CUSTOM_XMLPRINT_SUCCESS) {
      throw new PrinterError('SetXmlObjectTag error', result)
    }
  }

  static printXml (handle, automaticPageSize) {
    const result = cptWrapper.printXml(handle, automaticPageSize)
    if (result !== printErrors.codes.CUSTOM_XMLPRINT_SUCCESS) {
      throw new PrinterError('setXmlObjectsFromParamFile error', result)
    }
  }

  static getPrintErrors () {
    return printErrors
  }
}

module.exports = Modus3Adapter
