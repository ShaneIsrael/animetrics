import Api from './Api'

export default {
  getAnimeDetailsByShowId(resultId, showId) {
    return Api().get('/api/v1/anime/details', {
      params: {resultId, showId}
    })
  },
}