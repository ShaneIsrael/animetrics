const {
  getWeeks,
  getWeeksBySeason,
  getResultsByWeek,
  getRedditPollResultsByWeek,
} = require('../controllers')

module.exports = (app) => {
  app.get('/api/v1/weeks', getWeeks)
  app.get('/api/v1/weeks/season', getWeeksBySeason)
  app.get('/api/v1/results', getResultsByWeek)
  app.get('/api/v1/results/poll/week', getRedditPollResultsByWeek)
}
