const aws = require('aws-sdk')
const download = require('image-downloader')
const fs = require('fs')
const rimraf = require('rimraf')
const uuidv4 = require('uuid/v4')
const logger = require('../logger')
const { environment } = require('../config')
const config = require('../config')[environment].assets
const awsConfig = require('../config')[environment].aws
const AssetService = require('../services/AssetService')
const {
  Token,
} = require('../models')

const endpoint = new aws.Endpoint(awsConfig.endpoint)
const s3 = new aws.S3({
  endpoint,
  accessKeyId: awsConfig.access_key_id,
  secretAccessKey: awsConfig.access_key_secret,
})

const service = {}

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds))

function getSeasonSortNumber(season) {
  if (season === 'fall') return 3
  if (season === 'summer') return 2
  if (season === 'spring') return 1
  else return 0
}

function createWorkingDir(imageName) {
  if (!fs.existsSync(`${config.imagesRootPath}`)) {
    fs.mkdirSync(`${config.imagesRootPath}`);
  }
  if (!fs.existsSync(`${config.imagesRootPath}/${imageName}/`)) {
    fs.mkdirSync(`${config.imagesRootPath}/${imageName}/`)
  }
  return `${config.imagesRootPath}/${imageName}/`
}

async function getReddadzWeeklyKarmaRanks() {
  const s3params = {
    Bucket: 'animetrics',
    MaxKeys: 100,
    Prefix: 'resources/rwc',
  }
  if (!process.env.RESOURCE_RWC) {
    const data = await new Promise((resolve, reject) => s3.listObjectsV2(s3params, (err, data) => {
      if (err) reject(err)
      resolve(data)
    }))
    const results = {2019: {}, 2020: {}, 2021: {}}
    for (const d of data.Contents) {
      let { Key } = d
      const url = `https://cdn.animetrics.co/${Key}`
      Key = Key.replace('.jpg', '')
      const name = Key.split('/')[Key.split('/').length - 1]
      if (name) {
        const split = name.split('_')
        if (split.indexOf('annual') >= 0) {
          const year = split[2]
          if (results[year]) {
            results[year]['annual'] = url
          } else {
            results[year] = {
              annual: url
            }
          }
        }
        else if (split.indexOf('season') >= 0) {
          const year = split[3]
          const season = getSeasonSortNumber(split[2])
          if (results[year][season]) {
            results[year][season]['season'] = url
          } else {
            results[year][season] = {
              season: url
            }
          }
        }
        else {
          const year = split[3]
          const season = getSeasonSortNumber(split[2])
          let week = split[1]
          if (results[year]) {
            if (results[year][season]) {
              results[year][season][week] = url
            } else {
              results[year][season] = {
                [week]: url
              }
            }
          } else {
            results[year] = {
              [season]: {
                [week]: url
              }
            }
          }
        }
      }
    }
    process.env.RESOURCE_RWC = JSON.stringify(results)
  }
}

/**
 * Gets all of Reddadz weekly karma ranks
 * @returns {Object} Karma ranks sorted by date
 */
service.getReddadzWeeklyKarmaRanks = async () => {
  await getReddadzWeeklyKarmaRanks()
  return JSON.parse(process.env.RESOURCE_RWC)
}

/**
 * Uploads a Reddadz chart to S3
 */
async function upload(image, imageName, compressed) {
  const imageDirName = uuidv4()
  const imageDir = createWorkingDir(imageDirName)

  const { filename } = await download.image({
    url: image,
    dest: imageDir,
    timeout: 5000,
  })

  if (filename) {
    // sleep 500 miliseconds so that files get closed before trying to upload
    await sleep(500)
    if (compressed) {
      await AssetService.uploadFileToS3(filename, `resources/rwc/${imageName}.jpg`)
    } else {
      await AssetService.uploadFileToS3(filename, `resources/originals_rwc/${imageName}.png`)
    }
  }

  await rimraf.sync(imageDir)
}

const getExistingCharts = async (prefix) => new Promise((resolve, reject) => s3.listObjectsV2({
  Bucket: 'animetrics',
  MaxKeys: 1000,
  Prefix: prefix,
}, (err, data) => {
  if (err) reject(err)
  const filenames = []
  for (const obj of data.Contents) {
    let [name] = obj.Key.split('/').slice(-1)
    name = name.replace('.jpg', '')
    name = name.replace('.png', '')
    filenames.push(name)
  }
  resolve(filenames)
}))

/**
 * Uploads a Reddadz Chart to S3 and re-polls the weekly charts
 */
service.submitReddadzWeeklyKarmaRanks = async (type, season, week, year, compressedImage, fullImage, token) => {
  const tk = await Token.findOne({ where: { token } })
  if (!tk) throw new Error('Invalid Authorization Token')

  let imageName = `week_${week}_${season}_${year}`
  if (type === 'season') {
    imageName = `season_overview_${season}_${year}`
  }
  logger.info('Uploading Reddadz Chart')

  let existingCharts = await getExistingCharts('resources/rwc')
  if (existingCharts.indexOf(imageName) >= 0) {
    throw new Error(`That chart already exists: ${imageName}, did you fill out the form incorrectly?`)
  }
  await upload(compressedImage, imageName, true)
  existingCharts = await getExistingCharts('resources/originals_rwc')
  if (existingCharts.indexOf(imageName) >= 0) {
    throw new Error(`That chart already exists: ${imageName}, did you fill out the form incorrectly?`)
  }
  await upload(fullImage, imageName, false)
  logger.info('Uploaded Chart Successfully')
  await getReddadzWeeklyKarmaRanks()
}

module.exports = service
