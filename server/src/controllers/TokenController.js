const { createToken, revokeToken } = require('../services')

const controller = {}

/**
 * Creates a token
 */
controller.createToken = async (req, res, next) => {
  try {
    res.status(200).send()
  } catch (err) {
    next(err)
  }
}

/**
 * Revokes a token
 */
controller.revokeToken = async (req, res, next) => {
  try {
    res.status(200).send()
  } catch (err) {
    next(err)
  }
}


module.exports = controller
