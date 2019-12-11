const TicketBuilderError = require('lib/errors/ticket_builder_error')

class TicketBuilder {
  constructor (controller, mandatory = []) {
    this.controller = controller
    this.mandatory = mandatory
  }

  setXmlString (option, value) {
    this.controller.setXmlTagValue(`${option}.hidden`, 0)
    this.controller.setXmlTagValue(`${option}.text`, value)
  }

  build (options) {
    const optionKeys = Object.keys(options)
    this.mandatory.forEach((mandatoryKey) => {
      if (!(optionKeys.includes(mandatoryKey))) {
        throw new TicketBuilderError(`${mandatoryKey} not provided`)
      }
    })

    for (const option in options) {
      const value = lo_.get(options, option)
      this.setXmlString(option, value)
    }
  }
}

module.exports = TicketBuilder
