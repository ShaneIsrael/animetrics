/* eslint-disable no-restricted-globals */
const logger = require('../logger')
const {
  createToken,
} = require('../services')

async function init() {
  try {
    logger.info('Creating Token')
    const args = process.argv.slice(2)
    if (args.length !== 2) return console.log('invalid arguments. requires [name, level]>')
    if (typeof args[0] !== 'string') return console.log('name must be a string')
    if (isNaN(args[1])) return console.log('level must be a number')
    const token = await createToken(args[0], args[1])
    return console.log(`Token: ${token}`)
  } catch (err) {
    return logger.error(err.message)
  }
}
init()
