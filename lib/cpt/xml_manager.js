const EventEmitter = require('events')

class XmlManager extends EventEmitter {
  constructor (printerAdapter, ...args) {
    super(...args)
    this.printerAdapter = printerAdapter
    this.printHandle = undefined
  }

  openPrinter () {
    this.printHandle = this.printerAdapter.getHandle()
  }

  closePrinter () {
    this.printerAdapter.freeHandle(this.printHandle)
  }

  setXmlParams (file) {
    this.printerAdapter.setXmlParamsFile(this.printHandle, file)
  }

  setXmlTagValue (tag, value) {
    this.printerAdapter.setXmlTagValue(this.printHandle, tag, value)
  }

  setXmlFile (file) {
    this.printerAdapter.setXmlFile(this.printHandle, file)
  }

  printXml () {
    this.printerAdapter.printXml(this.printHandle, 1)
  }
}

module.exports = XmlManager
