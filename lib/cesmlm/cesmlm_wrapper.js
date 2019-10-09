const ffi = require('ffi')
const ref = require('ref')
const { existsSync } = require('fs')

const arch = process.arch

const archLib = {
  x64: 'printer/lib/intel_64',
  arm: 'printer/lib/armv7_32'
}
const cesmlmLibPath = lo_.get(archLib, arch)

if (!cesmlmLibPath) {
  throw new Error(`No cesmlm library for arch: ${arch}`)
}

const libCeSmLm = `${cesmlmLibPath}/cesmlm/libCeSmLm.so`

if (!existsSync(libCeSmLm)) {
  throw new Error(`cesmlm library not found: ${libCeSmLm}`)
}

const long = ref.types.long
const ulong = ref.types.ulong
const ulongPtr = ref.refType(ulong)
const ucharPtr = ref.refType(ref.types.uchar)
const stringPtr = ref.refType(ref.types.CString)

const cesmlm = ffi.Library(libCeSmLm, {
  _Z13openUSBDevicellPKc: [ulong, [long, long, stringPtr]],
  _Z14closeUSBDevicev: [ulong, []],
  _Z16GetPrinterStatusPhmPm: [ulong, [ucharPtr, ulong, ulongPtr]],
  _Z10GetLibVersv: [ucharPtr, []]
})

module.exports = {
  getLibVers: cesmlm._Z10GetLibVersv,
  openUSBDevice: cesmlm._Z13openUSBDevicellPKc,
  closeUSBDevice: cesmlm._Z14closeUSBDevicev,
  getPrinterStatus: cesmlm._Z16GetPrinterStatusPhmPm
}
