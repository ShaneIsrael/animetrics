const { getSeasons } = require('../services')

const controller = {}

/**
 * Gets all recorded seasons
 */
controller.getSeasons = async (req, res, next) => {
  try {
    const seasons = await getSeasons()
    res.status(200).send(seasons)
  } catch (err) {
    next(err)
  }
}

module.exports = controller
