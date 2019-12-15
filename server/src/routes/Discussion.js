const {
  getTodaysDiscussions,
} = require('../controllers')

module.exports = (app) => {
  app.get('/api/v1/discussion/today', getTodaysDiscussions)
}
