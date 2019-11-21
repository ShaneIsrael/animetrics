const {
  getWeeks,
  getResultsByWeek,
} = require('../controllers')

module.exports = (app) => {
  app.get('/api/v1/weeks', getWeeks)
  app.get('/api/v1/results', getResultsByWeek)
}
