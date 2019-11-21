const service = {}

const { Week } = require('../models')

/**
 * Get all weeks recorded
 * @returns {Array} An array of all the recorded weeks
 */
service.getWeeks = async () => {
  const weeks = await Week.findAll({ order: [['end_dt', 'DESC']], raw: true })
  return weeks
}

module.exports = service
