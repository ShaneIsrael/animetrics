const {
  getShows, getShowsAndAssets,
} = require('../controllers')

const { fix } = require('../services')

module.exports = (app) => {
  app.get('/api/v1/show/', getShows)
  app.get('/api/v1/show/assets', getShowsAndAssets)
  app.get('/api/v1/fix', fix)
}
