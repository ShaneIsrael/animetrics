const service = {}
const _ = require('lodash')
const { Season } = require('../models')

const seasonOrder = ['fall', 'summer', 'spring', 'winter']

/**
 * Get all recorded seasons
 * @returns {Array} An array of all the recorded seasons
 */
service.getSeasons = async () => {
  let seasons = await Season.findAll({ order: [['year', 'DESC']], raw: true })


  // We need to sort and group the results. Group by year, sort by proper seasonal order
  seasons.sort((a, b) => {
    return seasonOrder.indexOf(a.season) - seasonOrder.indexOf(b.season)
  })
  const grouped = _.groupBy(seasons, 'year')
  const groupedYears = Object.keys(grouped).sort((a, b) => b - a)

  const sorted = []
  for (const year of groupedYears) {
    sorted.push(...grouped[year])
  }
  return sorted
}

module.exports = service
