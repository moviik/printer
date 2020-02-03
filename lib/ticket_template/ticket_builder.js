const TicketBuilderError = require('lib/errors/ticket_builder_error')

class TicketBuilder {
  constructor (controller, mandatory = [], optional = []) {
    this.controller = controller
    this.mandatory = mandatory
    this.optional = optional
  }

  setXmlString (option, value) {
    this.controller.setXmlTagValue(`${option}.hidden`, 0)
    this.controller.setXmlTagValue(`${option}.text`, value)
  }

  hideXmlString (option) {
    this.controller.setXmlTagValue(`${option}.hidden`, 1)
  }

  build (options) {
    const optionKeys = Object.keys(options)
    this.mandatory.forEach((mandatoryKey) => {
      if (!(optionKeys.includes(mandatoryKey))) {
        throw new TicketBuilderError(`${mandatoryKey} not provided`)
      }
    })

    for (const option of this.optional) {
      this.hideXmlString(option)
    }

    for (const option in options) {
      const value = lo_.get(options, option)
      this.setXmlString(option, value)
    }
  }
}

module.exports = TicketBuilder
