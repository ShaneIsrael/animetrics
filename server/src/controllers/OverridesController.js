const {
  overrideAssetPoster, overrideAssetBanner, overrideAssetAvatar, overrideTvdbId,
} = require('../services')

const controller = {}

/**
 * Overrides the poster art for an asset
 */
controller.overrideAssetPoster = async (req, res, next) => {
  try {
    const { id, url } = req.body
    const asset = await overrideAssetPoster(id, url, req.headers.authorization)
    res.status(200).send(asset)
  } catch (err) {
    next(err)
  }
}

/**
 * Overrides the banner art for an asset
 */
controller.overrideAssetBanner = async (req, res, next) => {
  try {
    const { id, url } = req.body
    const asset = await overrideAssetBanner(id, url, req.headers.authorization)
    res.status(200).send(asset)
  } catch (err) {
    next(err)
  }
}

/**
 * Overrides the avatar art for an asset
 */
controller.overrideAssetAvatar = async (req, res, next) => {
  try {
    const { id, url } = req.body
    const asset = await overrideAssetAvatar(id, url, req.headers.authorization)
    res.status(200).send(asset)
  } catch (err) {
    next(err)
  }
}

/**
 * Overrides the TVDB ID for a show
 */
controller.overrideTvdbId = async (req, res, next) => {
  try {
    const { id, tvdbId } = req.body
    const show = await overrideTvdbId(id, tvdbId, req.headers.authorization)
    res.status(200).send(show)
  } catch (err) {
    next(err)
  }
}

module.exports = controller
