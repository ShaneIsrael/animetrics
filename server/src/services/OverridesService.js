const download = require('image-downloader')
const fs = require('fs')
const gm = require('gm')
const rimraf = require('rimraf')
const uuidv4 = require('uuid/v4')

const service = {}
const {
  OverrideHistory, Asset, Show, Token,
} = require('../models')
const AssetService = require('./AssetService')
const TvDbService = require('./TvDbService')

const config = require('../config/config')[process.env.NODE_ENV].assets

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds))
async function upload(type, overrideAssetUrl) {
  const imageName = uuidv4()
  if (!fs.existsSync(`${config.imagesRootPath}`)) {
    fs.mkdirSync(`${config.imagesRootPath}`);
  }
  if (!fs.existsSync(`${config.imagesRootPath}/${imageName}/`)) {
    fs.mkdirSync(`${config.imagesRootPath}/${imageName}/`)
  }
  const imageDir = `${config.imagesRootPath}/${imageName}`
  let name
  switch (type) {
  case 'banner':
    name = `${imageName}_banner.png`
    break
  case 'avatar':
    name = `${imageName}_avatar.png`
    break
  default:
    name = `${imageName}.jpg`
  }
  const dlPath = `${imageDir}/${name}`

  await download.image({
    url: overrideAssetUrl,
    dest: dlPath,
    timeout: 5000,
  })
  await sleep(500)
  const resp = await AssetService.uploadFileToS3(dlPath, `assets/${name}`)
  await rimraf.sync(imageDir)
  return resp
}

/**
 * Overrides the assets poster art and uploads to S3
 * @param {Number} assetId The ID of the asset to update
 * @param {String} assetUrl The url of the new asset
 * @param {String} token The auth token
 */
service.overrideAssetPoster = async (assetId, assetUrl, token) => {
  const tk = await Token.findOne({ where: { token } })
  const asset = await Asset.findByPk(assetId)
  const ulResp = await upload('poster', assetUrl)
  await OverrideHistory.create({
    tokenId: tk.id,
    table: 'asset',
    table_id: asset.id,
    previous_values: asset.dataValues,
  })
  asset.s3_poster = ulResp.Key
  asset.save()
  return asset
}

/**
 * Overrides the assets banner art and uploads to S3
 * @param {Number} assetId The ID of the asset to update
 * @param {String} assetUrl The url of the new asset
 * @param {String} token The auth token
 */
service.overrideAssetBanner = async (assetId, assetUrl, token) => {
  const tk = await Token.findOne({ where: { token } })
  const asset = await Asset.findByPk(assetId)
  const ulResp = await upload('banner', assetUrl)
  await OverrideHistory.create({
    tokenId: tk.id,
    table: 'asset',
    table_id: asset.id,
    previous_values: asset.dataValues,
  })
  asset.s3_banner = ulResp.Key
  asset.save()
  return asset
}

/**
 * Overrides the assets avatar art and uploads to S3
 * @param {Number} assetId The ID of the asset to update
 * @param {String} assetUrl The url of the new asset
 * @param {String} token The auth token
 */
service.overrideAssetAvatar = async (assetId, assetUrl, token) => {
  const tk = await Token.findOne({ where: { token } })
  const asset = await Asset.findByPk(assetId)
  const ulResp = await upload('avatar', assetUrl)
  await OverrideHistory.create({
    tokenId: tk.id,
    table: 'asset',
    table_id: asset.id,
    previous_values: asset.dataValues,
  })
  asset.s3_avatar = ulResp.Key
  asset.save()
  return asset
}

/**
 * Overrides the shows tvdb id
 * @param {Number} showId The ID of the show to update
 * @param {String} tvdbId The updated tvdb id
 * @param {String} token The auth token
 */
service.overrideTvdbId = async (showId, tvdbId, token) => {
  const tk = await Token.findOne({ where: { token } })
  const show = await Show.findByPk(showId)
  await OverrideHistory.create({
    tokenId: tk.id,
    table: 'show',
    table_id: show.id,
    previous_values: show.dataValues,
  })
  show.tvdb_id = tvdbId
  show.save()
  const updatedShow = await TvDbService.updateSeriesInformation(show.id)
  return show
}

module.exports = service
