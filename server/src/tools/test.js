const moment = require('moment')
const { Week, Season } = require('../models')
const utils = require('./utils')

async function init() {
  const weeks = await Week.findAll({
    where: {
      seasonId: null
    },
    order: [['start_dt', 'ASC']]
  })
  for (const week of weeks) {
    const year = moment.utc(week.start_dt).year()
    const season = utils.getAnimeSeason(week.start_dt)
    const seasonResult = await Season.findOrCreate({
      where: { season, year },
      defaults: { season, year }
    })
    week.seasonId = seasonResult[0].id
    week.save()
  }
}
init()