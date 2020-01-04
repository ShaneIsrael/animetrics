import Api from './Api'

export default {
  getResultsByWeek(id) {
    return Api().get('/api/v1/karma-ranks/week', {
      params: {id}
    })
  },
  getRedditPollResultsByWeek(id) {
    return Api().get('/api/v1/poll-ranks/week', {
      params: {id}
    })
  }
}