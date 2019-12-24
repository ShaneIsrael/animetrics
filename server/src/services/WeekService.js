const service = {}

const { Week, Season } = require('../models')

/**
 * Get all weeks recorded
 * @returns {Array} An array of all the recorded weeks
 */
service.getWeeks = async () => {
  const weeks = await Week.findAll({ order: [['end_dt', 'DESC']], raw: true })
  return weeks
}

/**
 * Gets all weeks in a particular season
 */
service.getWeeksBySeason = async (season, year) => {
  const seasonResp = await Season.findOne({ where: { season, year }, 
    order: [[Week, 'start_dt', 'DESC']],
    include: [{ model: Week }] })
  return seasonResp.Weeks
}


module.exports = service
