import Api from './Api'

export default {
  getTodaysDiscussions() {
    return Api().get('/api/v1/discussion/today')
  },
  getRecentDiscussions() {
    return Api().get('/api/v1/discussion/recent')
  },
}