const CesmlmStatusParser = require('lib/cesmlm/status_parser')

describe('cesmlm_status_parser', () => {
  describe('toStringArray', () => {
    test('should convert status to array', () => {
      expect(CesmlmStatusParser.toStringArray(CesmlmStatusParser.masks.IDLE)).toStrictEqual(['IDLE'])
    })
  })
})
