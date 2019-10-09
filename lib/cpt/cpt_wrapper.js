const ffi = require('ffi')
const ref = require('ref')
const { existsSync } = require('fs')

const arch = process.arch

const archLib = {
  x64: 'printer/lib/intel_64',
  arm: 'printer/lib/armv7_32'
}
const cptPath = lo_.get(archLib, arch)

if (!cptPath) {
  throw new Error(`No cpt library for arch: ${arch}`)
}

const zintLib = `${cptPath}/cpt/libzint.so`
const customXmlToImgLib = `${cptPath}/cpt/libcustomxmltoimg.so`
const cptLib = `${cptPath}/cpt/libCPTApi.so`

if (!existsSync(zintLib)) {
  throw new Error(`zint library not found: ${zintLib}`)
}

if (!existsSync(customXmlToImgLib)) {
  throw new Error(`customXmlToImg library not found: ${customXmlToImgLib}`)
}

if (!existsSync(cptLib)) {
  throw new Error(`cpt library not found: ${cptLib}`)
}

const voidPtr = ref.refType(ref.types.void)
const charPtr = ref.refType(ref.types.char)
const charPtrPtr = ref.refType(charPtr)
const int = ref.types.int32
const intPtr = ref.refType(int)
const uint = ref.types.uint32

ffi.Library(zintLib, {})
ffi.Library(customXmlToImgLib, {})
const cpt = ffi.Library(cptLib, {
  GetAvailablePrinters: [charPtrPtr, [intPtr]],
  GetXmlPrintHandle: [voidPtr, [charPtr]],
  FreeXmlPrintHandle: [uint, [voidPtr]],
  SetXmlFileName: [uint, [voidPtr, charPtr]],
  SetXmlObjectsFromParamFile: [uint, [voidPtr, charPtr]],
  SetXmlObjectTag: [uint, [voidPtr, charPtr, charPtr]],
  PrintXml: [uint, [voidPtr, int]],
  GetLibraryApiVersion: [uint, [charPtr, int]]
})

module.exports = {
  getAvailablePrinters: cpt.GetAvailablePrinters,
  getXmlPrintHandle: cpt.GetXmlPrintHandle,
  freeXmlPrintHandle: cpt.FreeXmlPrintHandle,
  setXmlFileName: cpt.SetXmlFileName,
  setXmlObjectsFromParamFile: cpt.SetXmlObjectsFromParamFile,
  setXmlObjectTag: cpt.SetXmlObjectTag,
  printXml: cpt.PrintXml,
  getLibraryApiVersion: cpt.GetLibraryApiVersion
}
