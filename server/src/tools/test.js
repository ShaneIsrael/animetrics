const service = {}
const moment = require('moment')
const { findAnime } = require('../services')
const fetchDiscussions = require('../fetch/fetchDiscussions')

async function init() {
  const anime = await findAnime(34281)
  console.log(anime)
}
init()