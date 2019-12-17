const aws = require('aws-sdk')
const fs = require('fs')

const awsConfig = require('../config')[process.env.NODE_ENV].aws

const endpoint = new aws.Endpoint(awsConfig.endpoint)
const s3 = new aws.S3({
  endpoint,
  accessKeyId: awsConfig.access_key_id,
  secretAccessKey: awsConfig.access_key_secret,
})

const { getSeriesPoster, getSeriesPosterBySeason } = require('../services')
const { Asset, Show } = require('../models')

const service = {}

const uploadFile = async (filePath, name, bucket) => {
  const fileContent = fs.readFileSync(filePath)
  const params = {
    Bucket: bucket,
    Key: name,
    Body: fileContent,
    ACL: 'public-read',
  }

  const resp = await s3.upload(params).promise()
  return resp
}

service.getAssetById = async (id) => {
  const asset = await Asset.findByPk(id)
  return asset
}

service.uploadFileToS3 = async (localPath, savePath) => {
  const resp = await uploadFile(localPath, savePath, 'animetrics')
  return resp
}

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
