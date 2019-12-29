const {
  getSeasons,
  getAllShowEpisodeKarmaBySeason,
  getAllShowEpisodeRedditPollScoreBySeason
} = require('../controllers')

module.exports = (app) => {
  app.get('/api/v1/seasons', getSeasons)
  app.get('/api/v1/season/show/epsiodes/karma', getAllShowEpisodeKarmaBySeason)
  app.get('/api/v1/season/show/episodes/rpscore', getAllShowEpisodeRedditPollScoreBySeason)
}
