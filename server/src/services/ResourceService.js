const aws = require('aws-sdk')
const { environment } = require('../config')
const awsConfig = require('../config')[environment].aws

const endpoint = new aws.Endpoint(awsConfig.endpoint)
const s3 = new aws.S3({
  endpoint,
  accessKeyId: awsConfig.access_key_id,
  secretAccessKey: awsConfig.access_key_secret,
})

const service = {}

function getSeasonSortNumber(season) {
  if (season === 'fall') return 3
  if (season === 'summer') return 2
  if (season === 'spring') return 1
  else return 0
}

/**
 * Gets all of Reddadz weekly karma ranks
 * @returns {Object} Karma ranks sorted by date
 */
service.getReddadzWeeklyKarmaRanks = async () => {
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
    const results = {}
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
  return JSON.parse(process.env.RESOURCE_RWC)
}



module.exports = service
