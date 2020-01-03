const {
  getWeeks,
  getWeeksBySeason,
  getResultsByWeek,
  getRedditPollResultsByWeek,
  getResultsByOrderAndWeek,
} = require('../controllers')

module.exports = (app) => {
  app.get('/api/v1/weeks', getWeeks)
  app.get('/api/v1/weeks/season', getWeeksBySeason)
  app.get('/api/v1/results/:order/:week', getResultsByOrderAndWeek)
  app.get('/api/v1/results', getResultsByWeek)
  app.get('/api/v1/results/poll/week', getRedditPollResultsByWeek)
}
