import Api from './Api'

export default {
  getTodaysDiscussions() {
    return Api().get('/api/v1/discussion/today')
  },
  getRecentDiscussions() {
    return Api().get('/api/v1/discussion/recent')
  },
  getPagedDiscussions(page, size, query) {
    return Api().get('/api/v1/discussion/page', {
      params: {
        page,
        size,
        query
      }
    })
  }
}