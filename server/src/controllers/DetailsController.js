const { getAnimeDetailsByShowId } = require('../services')

const controller = {}

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
