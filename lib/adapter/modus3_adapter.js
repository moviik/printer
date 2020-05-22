const ref = require('ref')
const PrinterAdapter = require('./printer_adapter')

const cesmlmWrapper = require('lib/cesmlm/wrapper')
const cesmlmStatusParser = require('lib/cesmlm/status_parser')
const cptWrapper = require('lib/cpt/wrapper')
const CptPrinterError = require('lib/cpt/cpt_printer_error')
const CesmlmPrinterError = require('lib/cesmlm/cesmlm_printer_error')

const cptErrorCodes = CptPrinterError.codes()
const cesmlmErrorCodes = CesmlmPrinterError.codes()

class Modus3Adapter extends PrinterAdapter {
  static openPrinter () {
    const result = cesmlmWrapper.openUSBDevice(0x0DD4, 0x023b, null)
    if (result !== cesmlmErrorCodes.SUCCESS) {
      throw new CesmlmPrinterError('openUSBDevice error', result)
    }
  }

  static closePrinter () {
    const result = cesmlmWrapper.closeUSBDevice()
    if (result !== cesmlmErrorCodes.SUCCESS) {
      throw new CesmlmPrinterError('closeUSBDevice error', result)
    }
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
    const handle = cptWrapper.getXmlPrintHandle(Buffer.from('CUSTOM_SPA_MODUS3' + '\0'))
    // we need to create a new buffer poiting to the pointer of the handle
    // so after this we should get a **void
    // it's the only way we find out to correctly deref() and get the memory value
    const handlePtr = ref.ref(handle)
    if (ref.isNull(handlePtr)) {
      throw new CptPrinterError('getHandle', cptErrorCodes.CUSTOM_XMLPRINT_GENERIC_FAILURE)
    }
    return handle
  }

  static freeHandle (handle) {
    const result = cptWrapper.freeXmlPrintHandle(handle)
    if (result !== cptErrorCodes.CUSTOM_XMLPRINT_SUCCESS) {
      throw new CptPrinterError('freeHandle error', result)
    }
  }

  static setXmlFile (handle, filename) {
    const result = cptWrapper.setXmlFileName(handle, Buffer.from(filename + '\0'))
    if (result !== cptErrorCodes.CUSTOM_XMLPRINT_SUCCESS) {
      throw new CptPrinterError('setXmlFileName error', result)
    }
  }

  static setXmlParamsFile (handle, filename) {
    const result = cptWrapper.setXmlObjectsFromParamFile(handle, Buffer.from(filename + '\0'))
    if (result !== cptErrorCodes.CUSTOM_XMLPRINT_SUCCESS) {
      throw new CptPrinterError('setXmlObjectsFromParamFile error', result)
    }
  }

  static setXmlTagValue (handle, tag, value) {
    const result = cptWrapper.setXmlObjectTag(
      handle,
      Buffer.from(`${tag}.text` + '\0'),
      Buffer.from(value + '\0')
    )
    if (result !== cptErrorCodes.CUSTOM_XMLPRINT_SUCCESS) {
      throw new CptPrinterError('SetXmlObjectTag error', result)
    }
  }

  static printXml (handle, automaticPageSize) {
    const result = cptWrapper.printXml(handle, automaticPageSize)
    if (result !== cptErrorCodes.CUSTOM_XMLPRINT_SUCCESS) {
      throw new CptPrinterError('printXml error', result)
    }
  }

  static toggleXmlTagValue (handle, tag, enable) {
    const result = cptWrapper.setXmlObjectTag(
      handle,
      Buffer.from(`${tag}.hidden` + '\0'),
      Buffer.from(enable ? '0' : '1' + '\0')
    )
    if (result !== cptErrorCodes.CUSTOM_XMLPRINT_SUCCESS) {
      throw new CptPrinterError('toggleXmlTagValue error', result)
    }
  }

  static getPrinterError () {
    return CptPrinterError
  }
}

module.exports = Modus3Adapter
