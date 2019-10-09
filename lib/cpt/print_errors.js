const codes = {
  CUSTOM_XMLPRINT_SUCCESS: 0,
  CUSTOM_XMLPRINT_GENERIC_FAILURE: 1,
  CUSTOM_XMLPRINT_INVALID_ARGUMENT: 2,
  CUSTOM_XMLPRINT_NOT_VALID_PRINTER: 3,
  CUSTOM_XMLPRINT_INTERNAL_LIBRARY_ERROR: 4,
  CUSTOM_XMLPRINT_LIBRARY_ERROR: 5,
  CUSTOM_XMLPRINT_NOT_CONNECTED_ERROR: 6,
  CUSTOM_XMLPRINT_SECURITY_ERROR: 7
}

module.exports = {
  codes,
  toString: (code) => {
    const string = lo_.findKey(codes, (value) => { return value === code })
    if (!string) {
      throw new Error(`No error with code: ${code}`)
    }
    return string
  }
}
