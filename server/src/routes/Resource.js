const {
  getReddadzWeeklyKarmaRanks, submitReddadzWeeklyKarmaRanks,
} = require('../controllers')

module.exports = (app) => {
  app.get('/api/v1/resources/rwc', getReddadzWeeklyKarmaRanks)
  app.post('/api/v1/resources/rwc/submit', submitReddadzWeeklyKarmaRanks)
}
