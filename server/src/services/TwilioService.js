/* eslint-disable linebreak-style */
const config = require('../config').twilio
const Twilio = require('twilio')
const logger = require('../logger')
const twilio = new Twilio(config.sid, config.auth_token)

const service = {}

/**
 * Sends a message to the admin
 * @returns {Boolean} message sent
 */
service.messageAdmin = async (body) => {
  try {
    await twilio.messages.create({
      from: config.contacts.animetrics,
      to: config.contacts.admin,
      body,
    })
    return true
  } catch (err) {
    logger.error(err)
    return false
  }
}

module.exports = service
