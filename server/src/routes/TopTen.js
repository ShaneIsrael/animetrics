const {
  getYearlyTopTen,
} = require('../controllers')

module.exports = (app) => {
  app.get('/api/v1/top/10/yearly', getYearlyTopTen)
}
