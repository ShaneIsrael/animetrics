const {
  overrideAssetBanner, overrideAssetPoster, overrideAssetAvatar, overrideTvdbId,
} = require('../controllers')

const { verifyAdmin, verifyModerator } = require('../middleware/auth')

module.exports = (app) => {
  app.put('/api/v1/override/asset/banner', verifyModerator, overrideAssetBanner)
  app.put('/api/v1/override/asset/poster', verifyModerator, overrideAssetPoster)
  app.put('/api/v1/override/asset/avatar', verifyModerator, overrideAssetAvatar)
  app.put('/api/v1/override/show/tvdbid', verifyModerator, overrideTvdbId)
}
