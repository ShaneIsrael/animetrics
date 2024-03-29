import Api from './Api'

export default {
  getAnime(id) {
    return Api().get('/api/v1/anime/', {
      params: {id}
    })
  },
  getAnimeStats(id) {
    return Api().get('/api/v1/anime/stats', {
      params: {id}
    })
  },
  searchSeries(query) {
    return Api().get('/api/v1/anime/search', {
      params: {query}
    })
  },
  getRandomAnime() {
    return Api().get('/api/v1/anime/random')
  },
}