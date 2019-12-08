const service = {}

const { Token } = require('../models')

/**
 * Creates a token
 * @param {String} name The name of the token
 * @param {Number} level The authorization level of the token
 * @returns {String} The token
 */
service.createToken = async (name, level) => {
  const t = await Token.create({
    name,
    level,
  })
  return t.token
}

/**
 * Revokes a token
 * @param {Number} id The id of the token to revoke
 */
service.revokeToken = async (id) => {
  await Token.update({
    active: false,
  }, {
    where: {
      id,
    },
  })
}

module.exports = service
