const moment = require('moment')
const logger = require('../logger')
const {
  Asset, Op,
} = require('../models')
const fetchAssets = require('../fetch/fetchAssets')

async function init() {
  try {
    const assets = await Asset.findAll({
      where: {
        s3_poster: {
          [Op.ne]: null,
        },
        s3_banner: null
      }
    })
    for (const asset of assets) {
      await fetchAssets.createBannerFromAssetPoster(asset)
    }
  } catch (err) {
    console.log(err)
    logger.error(err)
  }
}
init()
