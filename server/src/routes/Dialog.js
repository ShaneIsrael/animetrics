const {
  submitFeedback, submitIssue,
} = require('../controllers')

module.exports = (app) => {
  app.post('/api/v1/dialog/feedback', submitFeedback)
  app.post('/api/v1/dialog/issue', submitIssue)
}
