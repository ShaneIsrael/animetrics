import Api from './Api'

export default {
  getWeeks() {
    return Api().get('/api/v1/weeks')
  },
}