import Api from './Api'

export default {
  submitFeedback(feedback) {
    return Api().post('/api/v1/dialog/feedback', {
      feedback
    })
  },
  submitIssue(type, description) {
    return Api().post('/api/v1/dialog/issue', {
      type,
      description
    })
  },
}
