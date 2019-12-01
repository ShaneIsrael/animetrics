const logger = require('../logger')
const {
  authTvDb,
} = require('../services')
const fetchAssets = require('../fetch/fetchAssets')

async function init() {
  try {
    logger.info('fetching assets')
    await authTvDb()
    await fetchAssets.fetch()
  } catch (err) {
    logger.error(err.message)
  }
}
init()
