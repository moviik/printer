const TicketBuilderError = require('lib/errors/ticket_builder_error')

class TicketBuilder {
  constructor (controller, mandatory = [], optional = []) {
    this.controller = controller
    this.mandatory = mandatory
    this.optional = optional
  }

  _setString (option, value) {
    this.controller.toggleTagValue(option, true)
    this.controller.setTagValue(option, value)
  }

  _hideString (option) {
    this.controller.toggleTagValue(option, false)
  }

  build (options) {
    const optionKeys = Object.keys(options)
    this.mandatory.forEach((mandatoryKey) => {
      if (!(optionKeys.includes(mandatoryKey))) {
        throw new TicketBuilderError(`${mandatoryKey} not provided`)
      }
    })
    for (const option of this.optional) {
      this._hideString(option)
    }

    for (const option in options) {
      const value = lo_.get(options, option)
      this._setString(option, value)
    }
  }
}

module.exports = TicketBuilder
