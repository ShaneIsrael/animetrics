const {
  getAnime,
  getAnimeStats,
  getAnimeDetailsByShowId,
} = require('../controllers')

module.exports = (app) => {
  app.get('/api/v1/anime/', getAnime)
  app.get('/api/v1/anime/stats', getAnimeStats)
  app.get('/api/v1/anime/details', getAnimeDetailsByShowId)
}
