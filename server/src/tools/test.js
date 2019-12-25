const logger = require('../logger')
const {
  getSeriesPoster, authTvDb
} = require('../services')
const {
  Asset, Show, Op,
} = require('../models')
const fetchAssets = require('../fetch/fetchAssets')

async function updatePosters() {
  await authTvDb()
  const assets = await Asset.findAll({
    where: {
      poster_art: null,
    },
    include: [Show],
  })
  for (const asset of assets) {
    const art = await getSeriesPoster(asset.Show.tvdb_id)
    if (art === null) {
      console.log(asset.Show.title, asset.Show.tvdb_id)
    } else {
      asset.poster_art = art
      asset.save()
    }
  }
  await fetchAssets.fetch()
}
updatePosters()

