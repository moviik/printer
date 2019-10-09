class CesmlmStatusParser {
  static parse (status) {
    if (status[0] & 0x10 && status[1] & 0x0F &&
      !(status[2] & 0x25) && !(status[3] & 0x6f) &&
      !(status[4] & 0x29) && !(status[5] & 0x51)) {
      return this.masks.IDLE
    }

    if (!(status[0] & 0x10) || !(status[1] & 0x0F)) {
      return this.masks.GENERIC_ERROR
    }

    let maskedStatus = 0
    if (status[2] & 0x01) {
      maskedStatus |= this.masks.NO_PAPER
    }
    if (status[2] & 0x04) {
      maskedStatus |= this.masks.PAPER_NEAR_END
    }
    if (status[2] & 0x20) {
      maskedStatus |= this.masks.TICKET_OUT
    }
    if (status[3] & 0x03) {
      maskedStatus |= this.masks.COVER_OPENED
    }
    if (status[3] & 0x04) {
      maskedStatus |= this.masks.SPOOLING
    }
    if (status[3] & 0x08) {
      maskedStatus |= this.masks.DRAG_PAPER_MOTOR_ON
    }
    if (status[3] & 0x20) {
      maskedStatus |= this.masks.LF_KEY_PRESSED
    }
    if (status[3] & 0x40) {
      maskedStatus |= this.masks.ON_OFF_KEY_PRESSED
    }
    if (status[4] & 0x01) {
      maskedStatus |= this.masks.HEAD_TEMPERATURE_ERROR
    }
    if (status[4] & 0x08) {
      maskedStatus |= this.masks.POWER_SUPPLY_VOLTAGE_ERROR
    }
    if (status[4] & 0x20) {
      maskedStatus |= this.masks.NOT_ACK_COMMAND_ERROR
    }
    if (status[5] & 0x01) {
      maskedStatus |= this.masks.CUTTER_ERROR
    }
    if (status[5] & 0x04) {
      maskedStatus |= this.masks.RAM_ERROR
    }
    if (status[5] & 0x0C) {
      maskedStatus |= this.masks.EEPROM_ERROR
    }
    if (status[5] & 0x40) {
      maskedStatus |= this.masks.FLASH_ERROR
    }
    return maskedStatus
  }

  static toStringArray (status) {
    const statuses = []
    for (const maskName in this.masks) {
      const mask = lo_.get(this.masks, maskName)
      if (status & mask) {
        statuses.push(maskName)
      }
    }
    return statuses
  }

  static get masks () {
    return {
      IDLE: 0x00001,
      GENERIC_ERROR: 0x00002,
      NO_PAPER: 0x00004,
      PAPER_NEAR_END: 0x00008,
      TICKET_OUT: 0x00010,
      COVER_OPENED: 0x00020,
      SPOOLING: 0x00040,
      DRAG_PAPER_MOTOR_ON: 0x00080,
      LF_KEY_PRESSED: 0x00100,
      ON_OFF_KEY_PRESSED: 0x00200,
      HEAD_TEMPERATURE_ERROR: 0x00400,
      POWER_SUPPLY_VOLTAGE_ERROR: 0x00800,
      NOT_ACK_COMMAND_ERROR: 0x01000,
      CUTTER_ERROR: 0x02000,
      RAM_ERROR: 0x04000,
      EEPROM_ERROR: 0x08000,
      FLASH_ERROR: 0x10000
    }
  }
}

module.exports = CesmlmStatusParser
