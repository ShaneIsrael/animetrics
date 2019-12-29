import Api from './Api'

export default {
  getSeasons() {
    return Api().get('/api/v1/seasons')
  },
  getAllShowEpisodeKarmaBySeason(seasonId, showId) {
    return Api().get('/api/v1/season/show/epsiodes/karma', {
      params: {
        seasonId,
        showId
      }
    })
  },
  getAllShowEpisodeRedditPollScoreBySeason(seasonId, showId) {
    return Api().get('/api/v1/season/show/episodes/rpscore', {
      params: {
        seasonId,
        showId
      }
    })
  }
}