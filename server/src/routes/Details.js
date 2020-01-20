const {
  getAnime,
  getAnimeDetailsByShowId,
} = require('../controllers')

module.exports = (app) => {
  app.get('/api/v1/anime/', getAnime)
  app.get('/api/v1/anime/details', getAnimeDetailsByShowId)
}
