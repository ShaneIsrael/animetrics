const service = {}

const { environment } = require('../config')
const logger = require('../logger')
const Jikan = (environment === 'dev' ? require('jikan-node') : require('../Jikan'))

//const Jikan = require('jikan-node')


const mal = new Jikan()

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds))

service.findAnime = async (id) => {
  if (!id) return null
  try {
    const anime = await mal.findAnime(id)
    if (!anime.request_cached) await sleep(2000)
    return anime
  } catch(err) {
    logger.error(err)
    return {}
  }
}

service.searchAnime = async (title) => {
  if (!title) return null
  const result = await mal.search('anime', title)
  if (!result.request_cached) await sleep(2000)
  return result
}

service.findUser = async (username, request) => {
  const result = await mal.findUser(username, request)
  if (!result.request_cached) await sleep(2000)
  return result
}
module.exports = service
