const {
  getAsset,
} = require('../controllers')


module.exports = (app) => {
  app.get('/api/v1/asset/', getAsset)
}
