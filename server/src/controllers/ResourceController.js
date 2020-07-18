const { getReddadzWeeklyKarmaRanks, submitReddadzWeeklyKarmaRanks } = require('../services')

const controller = {}

/**
 * Gets Reddadz weekly karma ranks
 */
controller.getReddadzWeeklyKarmaRanks = async (req, res, next) => {
  try {
    const results = await getReddadzWeeklyKarmaRanks()
    return res.status(200).send(results)
  } catch (err) {
    return next(err)
  }
}

/**
 * Submits a Reddadz weekly chart
 */
controller.submitReddadzWeeklyKarmaRanks = async (req, res, next) => {
  try {
    const {
      type, season, week, year, compressedImage, fullImage,
    } = req.body
    if (type === 'weekly' && !week) return res.status(400).send('You must select a week when submitting a weekly chart')
    const response = await submitReddadzWeeklyKarmaRanks(type, season, week, year, compressedImage, fullImage, req.headers.authorization)
    return res.status(200).send(response)
  } catch (err) {
    return next(err)
  }
}

module.exports = controller
