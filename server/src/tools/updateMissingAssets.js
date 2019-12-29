const moment = require('moment')
const logger = require('../logger')
const {
  Asset, Op,
} = require('../models')
const fetchAssets = require('../fetch/fetchAssets')

async function init() {
  try {
    const missingAvatars = await Asset.findAll({
      where: {
        s3_poster: {
          [Op.ne]: null,
        },
        s3_avatar: null,
      }
    })
    for (const asset of missingAvatars) {
      await fetchAssets.createAvatarFromAssetPoster(asset)
    }
    const missingBanners = await Asset.findAll({
      where: {
        s3_poster: {
          [Op.ne]: null,
        },
        s3_banner: null,
      }
    })
    for (const asset of missingBanners) {
      await fetchAssets.createBannerFromAssetPoster(asset)
    }
  } catch (err) {
    logger.error(err)
  }
}
init()
