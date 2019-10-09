const builder = require('xmlbuilder')
const { writeFileSync } = require('fs')

module.exports = function (label) {
  const ticketParams = {
    CustomParams: {
      CustomParam: {
        '@class': 'text',
        '@id': 'TextBox0',
        text: {
          '#text': label
        }
      }
    }
  }

  const xml = builder
    .create(ticketParams, { encoding: 'utf-8' })
    .end({ pretty: true })

  return writeFileSync(
    'printer/ticket-template/Moviik.param.xml',
    xml,
    'utf-8'
  )
}
