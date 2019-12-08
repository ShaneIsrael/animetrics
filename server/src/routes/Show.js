const {
  getShows, getShowsAndAssets,
} = require('../controllers')


module.exports = (app) => {
  app.get('/api/v1/show/', getShows)
  app.get('/api/v1/show/assets', getShowsAndAssets)
}
