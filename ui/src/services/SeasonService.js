import Api from './Api'

export default {
  getSeasons() {
    return Api().get('/api/v1/seasons')
  },
}