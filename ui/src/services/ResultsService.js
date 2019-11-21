import Api from './Api'

export default {
  getResultsByWeek(id) {
    return Api().get('/api/v1/results', {
      params: {id}
    })
  },
}