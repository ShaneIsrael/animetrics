const { getReddadzWeeklyKarmaRanks } = require('../services')

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

module.exports = controller
