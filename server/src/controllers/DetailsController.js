const { getAnime, getAnimeStats, getAnimeDetailsByShowId } = require('../services')

const controller = {}

/**
 * Get show info for a given anime
 */
controller.getAnime = async (req, res, next) => {
  try {
    const results = await getAnime(req.query.id)
    res.status(200).send(results)
  } catch (err) {
    next(err)
  }
}

/**
 * Get stats for a given anime
 */
controller.getAnimeStats = async (req, res, next) => {
  try {
    const results = await getAnimeStats(req.query.id)
    res.status(200).send(results)
  } catch (err) {
    next(err)
  }
}

/**
 * Gets detailed show information for a given anime
 */
controller.getAnimeDetailsByShowId = async (req, res, next) => {
  try {
    const results = await getAnimeDetailsByShowId(req.query.resultId, req.query.showId)
    res.status(200).send(results)
  } catch (err) {
    next(err)
  }
}

module.exports = controller
