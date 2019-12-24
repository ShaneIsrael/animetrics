const { getWeeks, getWeeksBySeason } = require('../services')

const controller = {}

/**
 * Gets all recorded weeks
 */
controller.getWeeks = async (req, res, next) => {
  try {
    const weeks = await getWeeks()
    res.status(200).send(weeks)
  } catch (err) {
    next(err)
  }
}

/**
 * Gets all weeks in a particular season
 */
controller.getWeeksBySeason = async (req, res, next) => {
  try {
    const { season, year } = req.query
    if (isNaN(year)) throw new Error('year must be a number')
    if (typeof season !== 'string') throw new Error('season must be a string')

    const weeks = await getWeeksBySeason(season, year)
    res.status(200).send(weeks)
  } catch (err) {
    next(err)
  }
}

module.exports = controller
