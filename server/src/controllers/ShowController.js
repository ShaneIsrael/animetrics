const { getShows, getShowsAndAssets } = require('../services')

const controller = {}

/**
 * Gets all shows
 */
controller.getShows = async (req, res, next) => {
  try {
    const results = await getShows()
    res.status(200).send(results)
  } catch (err) {
    next(err)
  }
}

controller.getShowsAndAssets = async (req, res, next) => {
  try {
    const results = await getShowsAndAssets()
    res.status(200).send(results)
  } catch (err) {
    next(err)
  }
}

module.exports = controller
