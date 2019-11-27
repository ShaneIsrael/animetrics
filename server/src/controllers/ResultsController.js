const { getResultsByWeek, getRedditPollResultsByWeek } = require('../services')

const controller = {}

/**
 * Gets all results for a given week
 */
controller.getResultsByWeek = async (req, res, next) => {
  try {
    const results = await getResultsByWeek(req.query.id)
    res.status(200).send(results)
  } catch (err) {
    next(err)
  }
}

controller.getRedditPollResultsByWeek = async (req, res, next) => {
  try {
    const results = await getRedditPollResultsByWeek(req.query.id)
    res.status(200).send(results)
  } catch (err) {
    next(err)
  }
}

module.exports = controller
