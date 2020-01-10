const {
  getReddadzWeeklyKarmaRanks
} = require('../controllers')

module.exports = (app) => {
  app.get('/api/v1/resources/rwc', getReddadzWeeklyKarmaRanks)
}
