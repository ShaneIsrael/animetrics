const {
  getTodaysDiscussions,
  getRecentDiscussions,
  getDiscussionsByPage,
} = require('../controllers')

module.exports = (app) => {
  app.get('/api/v1/discussion/today', getTodaysDiscussions)
  app.get('/api/v1/discussion/recent', getRecentDiscussions)
  app.get('/api/v1/discussion/page', getDiscussionsByPage)
}
