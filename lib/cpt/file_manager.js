class FileManager {
  constructor (printerAdapter, ...args) {
    this.printerAdapter = printerAdapter
    this.printHandle = undefined
  }

  openPrinter () {
    this.printHandle = this.printerAdapter.getHandle()
  }

  closePrinter () {
    this.printerAdapter.freeHandle(this.printHandle)
  }

  setParamsFile (file) {
    this.printerAdapter.setParamsFile(this.printHandle, file)
  }

  setTagValue (tag, value) {
    this.printerAdapter.setTagValue(this.printHandle, tag, value)
  }

  toggleTagValue (tag, value) {
    this.printerAdapter.toggleTagValue(this.printHandle, tag, value)
  }

  setFile (file) {
    this.printerAdapter.setFile(this.printHandle, file)
  }

  print () {
    return this.printerAdapter.print(this.printHandle, 1)
  }
}

module.exports = FileManager
