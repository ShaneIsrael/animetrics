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
const { environment, spaces } = require('../config')
const config = require('../config')[environment].assets
const spaces = require('../config').spaces
const logger = require('../logger')
const AssetService = require('../services/AssetService')

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds))

function createWorkingDir(imageName) {
  if (!fs.existsSync(`${config.imagesRootPath}`)) {
    fs.mkdirSync(`${config.imagesRootPath}`);
  }
  if (!fs.existsSync(`${config.imagesRootPath}/${imageName}/`)) {
    fs.mkdirSync(`${config.imagesRootPath}/${imageName}/`)
  }
  return `${config.imagesRootPath}/${imageName}/`
}

const cropBanner = (width, height, fileToCrop, savePath, saveName) => new Promise(async (resolve, reject) => {
  logger.info('Creating new banner from asset poster...')
  const pyProg = await spawn('python3', [config.detectFacePath, fileToCrop, config.detectFaceConfPath])
  const bannerSavePath = `${savePath}/${saveName}_banner.jpg`
  const jsonLoc = `${fileToCrop.split('.')[0]}.json`
  if (fs.existsSync(jsonLoc)) {
    const facedata = fs.readFileSync(jsonLoc);
    const faces = JSON.parse(facedata);
    // store all the faces y values in an array to average them
    let largestFaceArea = 1
    let largestFaceYValue

    for (const face of faces) {
      const faceArea = face.width * face.height
      if (faceArea > largestFaceArea) {
        largestFaceArea = faceArea
        largestFaceYValue = face.y + face.height / 2
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
          return reject(err)
        }
        return resolve(bannerSavePath)
      })
  } else {
    gm(fileToCrop)
      .gravity('NorthWest')
      .crop(width, height, 0, 333 - (height / 2))
      .write(bannerSavePath, (err) => {
        if (err) {
          return reject(err)
        }
        return resolve(bannerSavePath)
      })
  }
})

const cropAvatar = (fileToCrop, savePath, saveName) => new Promise(async (resolve, reject) => {
  logger.info('Creating new avatar from asset poster...')
  const pyProg = await spawn('python3', [config.detectFacePath, fileToCrop, config.detectFaceConfPath])
  const avatarSavePath = `${savePath}/${saveName}_avatar.jpg`
  const jsonLoc = `${fileToCrop.split('.')[0]}.json`
  if (fs.existsSync(jsonLoc)) {
    const facedata = fs.readFileSync(jsonLoc);
    const faces = JSON.parse(facedata);
    // store all the faces y values in an array to average them
    let largestFace
    let largestFaceArea = 1
    for (const face of faces) {
      const faceArea = face.width * face.height
      if (faceArea > largestFaceArea) {
        largestFaceArea = faceArea
        largestFace = face
      }
    }

    gm(fileToCrop)
      .gravity('NorthWest')
      .crop(largestFace.width, largestFace.height, largestFace.x, largestFace.y)
      .write(avatarSavePath, (err) => {
        if (err) {
          return reject(err)
        }
        return resolve(avatarSavePath)
      })
  } else {
    gm(fileToCrop)
      .gravity('NorthWest')
      .crop(100, 100, (680 / 2) - 100, (1000 / 2) - 100)
      .write(avatarSavePath, (err) => {
        if (err) {
          return reject(err)
        }
        return resolve(avatarSavePath)
      })
  }
})

const compress = (filepath) => new Promise((resolve, reject) => {
  gm(filepath)
    .compress('JPEG')
    .write(filepath, (err) => {
      if (err) {
        return reject(err)
      }
      return resolve(filepath)
    })
})

async function createS3Poster(asset) {
  logger.info('Creating S3 Poster from asset poster...')
  const imageName = uuidv4()
  const imageDir = createWorkingDir(imageName)

  let url
  if (asset.poster_art.indexOf('anime_assets/') === -1) url = `https://www.thetvdb.com/banners/${asset.poster_art}`
  else url = `${spaces.edge}/${asset.poster_art}`
  const { filename } = await download.image({
    url,
    dest: imageDir,
    timeout: 5000,
  })

  if (filename) {
    // sleep 500 miliseconds so that files get closed before trying to upload
    await sleep(500)
    const s3Resp = await AssetService.uploadFileToS3(filename, `anime_assets/${imageName}_poster.jpg`)
    asset.s3_poster = s3Resp.Key
    const compressed = await compress(filename)
    const s3CompressedResp = await AssetService.uploadFileToS3(compressed, `anime_assets/${imageName}_poster_rs.jpg`)
    asset.s3_poster_compressed = s3CompressedResp.Key
    asset.save()
  }

  await rimraf.sync(imageDir)
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
  if (path) {
    // sleep 500 miliseconds so that files get closed before trying to upload
    await sleep(500)
    const s3BannerResp = await AssetService.uploadFileToS3(path, `anime_assets/${imageName}_banner.jpg`)
    asset.s3_banner = s3BannerResp.Key
    asset.save()
  }
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

  const path = await cropAvatar(filename, imageDir, imageName)
  if (path) {
    // sleep 500 miliseconds so that files get closed before trying to upload
    await sleep(500)
    const s3AvatarResp = await AssetService.uploadFileToS3(path, `anime_assets/${imageName}_avatar.jpg`)
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
        if (!asset.s3_poster) await createS3Poster(asset)
        if (!asset.s3_banner) await createBanner(asset)
        if (!asset.s3_avatar) await createAvatar(asset)
        asset.s3_bucket = 'animetrics'
        asset.save()
      }
    } catch (err) {
      logger.error(err)
    }
  },
  async fetchByAsset(asset) {
    if (!asset.s3_poster) await createS3Poster(asset)
    if (!asset.s3_banner) await createBanner(asset)
    if (!asset.s3_avatar) await createAvatar(asset)
    asset.s3_bucket = 'animetrics'
    asset.save()
  },
  async createS3Poster(asset) {
    await createS3Poster(asset)
  },
  async createBannerFromAssetPoster(asset) {
    await createBanner(asset)
  },
  async createAvatarFromAssetPoster(asset) {
    await createAvatar(asset)
  },
  async compressAll() {
    const assets = await Asset.findAll({
      where: {
        s3_poster_compressed: null
      }
    })
    let index = 1
    for (asset of assets) {
      const imageName = uuidv4()
      const imageDir = createWorkingDir(imageName)
    
      let url
      if (asset.poster_art.indexOf('anime_assets/') === -1) url = `https://www.thetvdb.com/banners/${asset.poster_art}`
      else url = `${spaces.edge}/${asset.poster_art}`
      const { filename } = await download.image({
        url,
        dest: imageDir,
        timeout: 5000,
      })
      
      logger.info(`compressing ${index}/${assets.length}`)
      if (filename) {
        // sleep 500 miliseconds so that files get closed before trying to upload
        await sleep(500)
        const compressed = await compress(filename)
        const s3CompressedResp = await AssetService.uploadFileToS3(compressed, `anime_assets/${imageName}_poster.jpg`)
        asset.s3_poster_compressed = s3CompressedResp.Key
        asset.save()
      }
      await rimraf.sync(imageDir)
      index+=1
    }
  },
}
