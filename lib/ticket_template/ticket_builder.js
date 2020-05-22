const TicketBuilderError = require('lib/errors/ticket_builder_error')

class TicketBuilder {
  constructor (controller, mandatory = [], optional = []) {
    this.controller = controller
    this.mandatory = mandatory
    this.optional = optional
  }

  _setXmlString (option, value) {
    this.controller.toggleXmlTagValue(option, true)
    this.controller.setXmlTagValue(option, value)
  }

  _hideXmlString (option) {
    this.controller.toggleXmlTagValue(option, false)
  }

  build (options) {
    const optionKeys = Object.keys(options)
    this.mandatory.forEach((mandatoryKey) => {
      if (!(optionKeys.includes(mandatoryKey))) {
        throw new TicketBuilderError(`${mandatoryKey} not provided`)
      }
    })
    for (const option of this.optional) {
      this._hideXmlString(option)
    }

    for (const option in options) {
      const value = lo_.get(options, option)
      this._setXmlString(option, value)
    }
  }
}

module.exports = TicketBuilder
