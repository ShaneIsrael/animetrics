const service = {}
const Jikan = require('../Jikan')

const mal = new Jikan()

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds))

service.findAnime = async (id) => {
  const anime = await mal.findAnime(id)
  if (!anime.request_cached) await sleep(2000)
  return anime
}

service.searchAnime = async (title) => {
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
