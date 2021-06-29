const FileManager = require('lib/file_manager')
const PrinterAdapter = require('lib/adapter/printer_adapter')

function adapterSetGetHandle (adapter) {
  adapter.getHandle = () => {
  }
}

function adapterSetFreeHandle (adapter) {
  adapter.freeHandle = () => {
  }
}

describe('FileManager', () => {
  describe('openPrinter', () => {
    test('should open printer', () => {
      class FakeAdapater extends PrinterAdapter {}
      adapterSetGetHandle(FakeAdapater)

      const manager = new FileManager(FakeAdapater)
      manager.openPrinter()
    })

    test('should fail if adapter fails', () => {
      const adapterError = new Error('message')
      class FakeAdapater extends PrinterAdapter {static getHandle () { throw adapterError }}

      const manager = new FileManager(FakeAdapater)
      try {
        manager.openPrinter()
      } catch (error) {
        expect(error).toBe(adapterError)
      }
    })
  })

  describe('closePrinter', () => {
    test('should close printer', () => {
      class FakeAdapater extends PrinterAdapter {}
      adapterSetFreeHandle(FakeAdapater)

      const manager = new FileManager(FakeAdapater)
      manager.closePrinter()
    })

    test('should fail if adapter fails', () => {
      const adapterError = new Error('message')
      class FakeAdapater extends PrinterAdapter {static freeHandle () { throw adapterError }}

      const manager = new FileManager(FakeAdapater)
      try {
        manager.closePrinter()
      } catch (error) {
        expect(error).toBe(adapterError)
      }
    })
  })
})
