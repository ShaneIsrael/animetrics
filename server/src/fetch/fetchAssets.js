const download = require('image-downloader')
const fs = require('fs')
const gm = require('gm')
const rimraf = require('rimraf')
const uuidv4 = require('uuid/v4')
const spawn = require('await-spawn')
const {
  Show,
  Asset,
  Op,
} = require('../models')
const { environment } = require('../config')
const config = require('../config')[environment].assets
const spaces = require('../config').spaces
const logger = require('../logger')
const { uploadFileToS3 } = require('../services')

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds))

async function crop(width, height, path, savePath) {
  const pyProg = await spawn('python3', [config.detectFacePath, path, config.detectFaceConfPath]);
  const bannerSavePath = `${savePath.split('.jpg')[0]}_banner.jpg`
  const avatarSavePath = `${savePath.split('.jpg')[0]}_avatar.jpg`
  const jsonLoc = `${path.split('.jpg')[0]}.json`
  if (fs.existsSync(jsonLoc)) {
    const facedata = fs.readFileSync(jsonLoc);
    const faces = JSON.parse(facedata);
    // store all the faces y values in an array to average them

    const yValues = []
    const faceAreas = []
    let largestFaceArea = 1
    let largestFaceYValue
    let largestFace

    for (const face of faces) {
      const faceArea = face.width * face.height
      yValues.push(face.y)
      faceAreas.push(faceArea)
      // largestFaceArea = faceArea > largestFaceArea ? faceArea : largestFaceArea
      if (faceArea > largestFaceArea) {
        largestFaceArea = faceArea
        largestFaceYValue = face.y + face.height / 2
        largestFace = face
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
      .crop(largestFace.width, largestFace.height, largestFace.x, largestFace.y)
      .write(avatarSavePath, (err) => {
        if (err) {
          logger.error(err)
        }
      })
    gm(path)
      .gravity('NorthWest')
      .crop(width, height, 0, avgY - (height / 2))
      .write(bannerSavePath, (err) => {
        if (err) {
          logger.err(err);
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
      .crop(100, 100, (680 / 2) - 100, (1000 / 2) - 100)
      .write(avatarSavePath, (err) => {
        if (err) {
          logger.error(err)
        }
      })
    gm(path)
      .gravity('NorthWest')
      .crop(width, height, 0, 333 - (height / 2))
      .write(bannerSavePath, (err) => {
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

async function createAndUpload(asset) {
  logger.info(`downloading asset for show: ${asset.showId}`)
  const imageName = uuidv4()
  if (!fs.existsSync(`${config.imagesRootPath}`)) {
    fs.mkdirSync(`${config.imagesRootPath}`);
  }
  if (!fs.existsSync(`${config.imagesRootPath}/${imageName}/`)) {
    fs.mkdirSync(`${config.imagesRootPath}/${imageName}/`)
  }
  const imageDir = `${config.imagesRootPath}/${imageName}`

  const { filename } = await download.image({
    url: `https://www.thetvdb.com/banners/${asset.poster_art}`,
    dest: imageDir,
    timeout: 5000,
  })
  const filenameSplit = filename.split('/')
  const filenameUID = filename.split('.jpg')[0].split('/')[filenameSplit.length - 1]

  // await crop(758, 140, `${postersDir}/${show.id}.jpg`, `${bannersDir}/${show.id}.png`)
  await crop(454, 80, filename, filename)
  // sleep 500 miliseconds so that files get closed before trying to upload
  await sleep(500)
  if (!asset.s3_poster) {
    const s3PosterResp = await uploadFileToS3(filename, `anime_assets/${imageName}_poster.jpg`)
    asset.s3_poster = s3PosterResp.Key
  }
  if (!asset.s3_banner) {
    const s3BannerResp = await uploadFileToS3(`${imageDir}/${filenameUID}_banner.jpg`, `anime_assets/${imageName}_banner.png`)
    asset.s3_banner = s3BannerResp.Key
  }
  if (!asset.s3_avatar) {
    const s3AvatarResp = await uploadFileToS3(`${imageDir}/${filenameUID}_avatar.jpg`, `anime_assets/${imageName}_avatar.png`)
    asset.s3_avatar = s3AvatarResp.Key
  }
  asset.s3_bucket = 'animetrics'
  asset.save()

  await rimraf.sync(imageDir)
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

async function cropBanner(width, height, fileToCrop, savePath, saveName) {
  const pyProg = await spawn('python3', [config.detectFacePath, fileToCrop, config.detectFaceConfPath]);
  const bannerSavePath = `${savePath}/${saveName}_banner.jpg`
  const jsonLoc = `${fileToCrop.split('.')[0]}.json`
  if (fs.existsSync(jsonLoc)) {
    const facedata = fs.readFileSync(jsonLoc);
    const faces = JSON.parse(facedata);
    // store all the faces y values in an array to average them
    let largestFaceArea = 1
    let largestFaceYValue
    let largestFace

    for (const face of faces) {
      const faceArea = face.width * face.height
      if (faceArea > largestFaceArea) {
        largestFaceArea = faceArea
        largestFaceYValue = face.y + face.height / 2
        largestFace = face
      }
    }

    let avgY = largestFaceYValue

    if ((avgY - (height / 2)) < 0) {
      avgY -= (avgY - (height / 2))
      logger.info(`New Y Value: ${avgY}`)
    }

    gm(fileToCrop)
      .gravity('NorthWest')
      .crop(width, height, 0, avgY - (height / 2))
      .write(bannerSavePath, (err) => {
        if (err) {
          logger.err(err);
          bannerSavePath = null
        }
      })
  } else {
    gm(fileToCrop)
      .gravity('NorthWest')
      .crop(width, height, 0, 333 - (height / 2))
      .write(bannerSavePath, (err) => {
        if (err) {
          logger.info(err);
          bannerSavePath = null
        }
      })
  }
  await sleep(2000)
  return bannerSavePath
}

async function cropAvatar(width, height, fileToCrop, savePath, saveName) {
  const pyProg = await spawn('python3', [config.detectFacePath, fileToCrop, config.detectFaceConfPath]);
  const avatarSavePath = `${savePath}/${saveName}_avatar.jpg`
  const jsonLoc = `${fileToCrop.split('.')[0]}.json`
  if (fs.existsSync(jsonLoc)) {
    const facedata = fs.readFileSync(jsonLoc);
    const faces = JSON.parse(facedata);
    // store all the faces y values in an array to average them
    let largestFace

    for (const face of faces) {
      const faceArea = face.width * face.height
      if (faceArea > largestFaceArea) {
        largestFace = face
      }
    }

    gm(fileToCrop)
      .gravity('NorthWest')
      .crop(largestFace.width, largestFace.height, largestFace.x, largestFace.y)
      .write(avatarSavePath, (err) => {
        if (err) {
          logger.error(err)
          avatarSavePath = null
        }
      })
  } else {
    gm(fileToCrop)
      .gravity('NorthWest')
      .crop(100, 100, (680 / 2) - 100, (1000 / 2) - 100)
      .write(avatarSavePath, (err) => {
        if (err) {
          logger.error(err)
          avatarSavePath = null
        }
      })
  }
  await sleep(2000)
  return avatarSavePath
}

async function createBanner(asset) {
  const imageName = uuidv4()
  const imageDir = createWorkingDir(imageName)

  const { filename } = await download.image({
    url: `${spaces.edge}/${asset.s3_poster}`,
    dest: imageDir,
    timeout: 5000,
  })

  const path = await cropBanner(454, 80, filename, imageDir, imageName)
  console.log(path)
  if (path) {
    const s3BannerResp = await uploadFileToS3(path, `anime_assets/${imageName}_banner.jpg`)
    asset.s3_banner = s3BannerResp.Key
    asset.save()
  }
  console.log(asset.s3_banner)
  await rimraf.sync(imageDir)
}

async function createAvatar(asset) {
  const imageName = uuidv4()
  const imageDir = createWorkingDir(imageName)

  const { filename } = await download.image({
    url: `${spaces.edge}/${asset.s3_poster}`,
    dest: imageDir,
    timeout: 5000,
  })

  const path = await cropBanner(454, 80, filename, imageDir, imageName)
  if (path) {
    const s3AvatarResp = await uploadFileToS3(path, `anime_assets/${imageName}_avatar.jpg`)
    asset.s3_avatar = s3AvatarResp.Key
    asset.save()
  }
  await rimraf.sync(imageDir)
}

module.exports = {
  async fetch() {
    try {
      const assets = await Asset.findAll({
        where: {
          poster_art: { [Op.ne]: null },
          [Op.or]: [
            {
              s3_poster: null,
            },
            {
              s3_banner: null,
            },
            {
              s3_avatar: null,
            },
          ],
        },
      })
      for (const asset of assets) {
        await createAndUpload(asset)
      }
    } catch (err) {
      logger.error(err)
    }
  },
  async createBannerFromAssetPoster(asset) {
      logger.info('Creating new banner from asset poster...')
      await createBanner(asset)
      logger.info('Created new banner from asset poster.')
  },
  async createAvatarFromAssetPoster(asset) {
      logger.info('Creating new avatar from asset poster...')
      await createAvatar(asset)
      logger.info('Created new avatar from asset poster.')
  }
}
