const service = {}
const { getSeriesPoster, getSeriesPosterBySeason } = require('../services')
const { Asset, Show } = require('../models')

service.updateAssetSeasons = async () => {
  // const assets = await Asset.findAll({ include: [Show] })
  // for (const asset of assets) {
  //   const series = await getSeriesById(asset.Show.tvdb_id)
  //   if (latestSeason) {
  //     asset.season = latestSeason
  //     asset.save()
  //   }
  // }
}

service.updatePosters = async () => {
  const missingPosters = await Asset.findAll({ where: { poster_art: null }, include: [Show] });
  for (const asset of missingPosters) {
    let poster
    if (asset.season > 1) {
      poster = await getSeriesPosterBySeason(asset.Show.tvdb_id, asset.season);
      if (!poster) {
        poster = await getSeriesPoster(asset.Show.tvdb_id)
      }
    } else {
      poster = await getSeriesPoster(asset.Show.tvdb_id);
    }
    asset.poster_art = poster
    asset.save()
  }
}


module.exports = service
