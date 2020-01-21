const {
  getAnime,
  getAnimeStats,
  getAnimeDetailsByShowId,
  searchAnime,
  getRandomAnime
} = require('../controllers')

module.exports = (app) => {
  app.get('/api/v1/anime/', getAnime)
  app.get('/api/v1/anime/stats', getAnimeStats)
  app.get('/api/v1/anime/details', getAnimeDetailsByShowId)
  app.get('/api/v1/anime/search', searchAnime)
  app.get('/api/v1/anime/random', getRandomAnime)
}
