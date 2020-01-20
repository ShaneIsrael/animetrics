import Api from './Api'

export default {
  getAnime(id) {
    return Api().get('/api/v1/anime/', {
      params: {id}
    })
  },
}