const {
  getTodaysDiscussions,
  getRecentDiscussions,
  getDiscussionsByPage,
  submitDiscussion,
} = require('../controllers')

module.exports = (app) => {
  app.get('/api/v1/discussion/today', getTodaysDiscussions)
  app.get('/api/v1/discussion/recent', getRecentDiscussions)
  app.get('/api/v1/discussion/page', getDiscussionsByPage)
  app.post('/api/v1/discussion/submit', submitDiscussion)
}
