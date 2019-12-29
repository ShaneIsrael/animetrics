const { getSeasons, getAllShowEpisodeKarmaBySeason, getAllShowEpisodeRedditPollScoreBySeason } = require('../services')

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

/**
 * Gets all karma for all episodes of a show in a season
 */
controller.getAllShowEpisodeKarmaBySeason = async (req, res, next) => {
  const { seasonId, showId } = req.query
  try {
    if (isNaN(seasonId)) return res.status(400).send('seasonId must be a number')
    if (isNaN(showId)) return res.status(400).send('showId must be a number')

    const results = await getAllShowEpisodeKarmaBySeason(seasonId, showId)
    res.status(200).send(results)
  } catch (err) {
    next(err)
  }
}

/**
 * Gets reddit poll score for all episodes of a show in a season
 */
controller.getAllShowEpisodeRedditPollScoreBySeason = async (req, res, next) => {
  const { seasonId, showId } = req.query
  try {
    if (isNaN(seasonId)) return res.status(400).send('seasonId must be a number')
    if (isNaN(showId)) return res.status(400).send('showId must be a number')

    const results = await getAllShowEpisodeRedditPollScoreBySeason(seasonId, showId)
    res.status(200).send(results)
  } catch (err) {
    next(err)
  }
}

module.exports = controller
