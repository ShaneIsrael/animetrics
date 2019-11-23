const download = require('image-downloader')
const fs = require('fs')
const gm = require('gm')
const spawn = require('await-spawn')
const {
  Show,
  Asset,
} = require('../models')

const config = require('../config/config')[process.env.NODE_ENV].assets
const logger = require('../logger')

async function crop(width, height, path, savePath) {
  const pyProg = await spawn('python', [config.detectFacePath, path, config.detectFaceConfPath]);
  const jsonLoc = `${path.split('.jpg')[0]}_faces.json`
  if (fs.existsSync(jsonLoc)) {
    const facedata = fs.readFileSync(jsonLoc);
    const faces = JSON.parse(facedata);
    // store all the faces y values in an array to average them

    const yValues = []
    const faceAreas = []
    let largestFaceArea = 1
    let largestFaceYValue

    for (const face of faces) {
      const faceArea = face.width * face.height
      yValues.push(face.y)
      faceAreas.push(faceArea)
      // largestFaceArea = faceArea > largestFaceArea ? faceArea : largestFaceArea
      if (faceArea > largestFaceArea) {
        largestFaceArea = faceArea
        largestFaceYValue = face.y + face.height / 2
      }
    }

    const weightedFaces = []
    for (const fa of faceAreas) {
      weightedFaces.push(fa / largestFaceArea)
    }
    // const sumArrayValues = (values) => values.reduce((p, c) => p + c, 0)

    // const weightedMean = (factorsArray, weightsArray) => sumArrayValues(factorsArray.map((factor, index) => factor * weightsArray[index])) / sumArrayValues(weightsArray)

    // let avgY = Math.round(weightedMean(yValues, weightedFaces))
    // let avgY = Math.round(yValues.reduce((a, b) => a + b, 0) / yValues.length)
    let avgY = largestFaceYValue

    // console.log(avgY)
    if ((avgY - (height / 2)) < 0) {
      avgY -= (avgY - (height / 2))
      logger.info(`New Y Value: ${avgY}`)
    }

    gm(path)
      .gravity('NorthWest')
      .crop(width, height, (680 - 454) / 2, avgY - (height / 2))
      .write(savePath, (err) => {
        if (err) {
          logger.info(err);
        }
        // gm(savePath).append(path, false).write(`${savePath.split('.png')[0]}_appended.png`, (err) => {
        //   if (err) {
        //     console.log(err)
        //   }
        // })
      })
  } else {
    gm(path)
      .gravity('NorthWest')
      .crop(width, height, (680 - 454) / 2, 333 - (height / 2))
      .write(savePath, (err) => {
        if (err) {
          logger.info(err);
        }
        // gm(savePath).append(path, false).write(`${savePath.split('.png')[0]}_noface_appended.png`, (err) => {
        //   if (err) {
        //     console.log(err)
        //   }
        // })
      })
  }
}

module.exports = {
  async fetch() {
    if (!fs.existsSync(`${config.imagesRootPath}/assets`)) {
      fs.mkdirSync(`${config.imagesRootPath}/assets`);
    }
    if (!fs.existsSync(`${config.imagesRootPath}/assets/banners`)) {
      fs.mkdirSync(`${config.imagesRootPath}/assets/banners`);
    }
    if (!fs.existsSync(`${config.imagesRootPath}/assets/posters`)) {
      fs.mkdirSync(`${config.imagesRootPath}/assets/posters`);
    }
    const shows = await Show.findAll({ include: [{ model: Asset }] })
    for (const show of shows) {
      const postersDir = `${config.imagesRootPath}/assets/posters`
      const bannersDir = `${config.imagesRootPath}/assets/banners`
      for (const asset of show.Assets) {
        try {
          if (asset.poster_art) {
            logger.info(`downloading asset for: ${show.title}`)
            if (!fs.existsSync(`${postersDir}/${show.id}_${asset.season}.jpg`)) {
              await download.image({
                url: `https://www.thetvdb.com/banners/${asset.poster_art}`,
                dest: `${postersDir}/${show.id}_${asset.season}.jpg`,
                timeout: 5000,
              })
            } else {
              logger.info('poster asset exists, skipping...')
            }
            if (!fs.existsSync(`${bannersDir}/${show.id}_${asset.season}.png`)) {
              // await crop(758, 140, `${postersDir}/${show.id}.jpg`, `${bannersDir}/${show.id}.png`)
              await crop(454, 80, `${postersDir}/${show.id}_${asset.season}.jpg`, `${bannersDir}/${show.id}_${asset.season}.png`)
            } else {
              logger.info('banner asset exists, skipping...')
            }
          }
        } catch (err) {
          logger.error(err.message)
        }
      }
    }
  },
}
