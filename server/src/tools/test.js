const service = {}
// const moment = require('moment')
const Anilist = require('anilist-node')
const { findAnime } = require('../services/MALService')
// const fetchDiscussions = require('../fetch/fetchDiscussions')
// const fetchAssets = require('../fetch/fetchAssets')
// const cpoll = require('../tools/calculatePoll')
// const logger = require('../logger')
// const {
//   Show, Asset, MALSnapshot, RedditPollResult, Week, Season, EpisodeResultLink, EpisodeDiscussion, EpisodeDiscussionResult, RedditUserScore, Op,
// } = require('../models')

const aniClient = new Anilist()

// create animetrics anilist app

function getAnilistUrl(text) {
  const url = text.match(/https?:\/\/(www\.)?(\w*anilist\w*)\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]anime\/[0-9]*)/gm)
  return url ? url[0] : null
}

function parseAnilistId(post) {
  const anilistUrl = getAnilistUrl(post.selftext)
  if (anilistUrl) {
    const anilistId = anilistUrl.match(/([0-9]\d+)/g)
    return anilistId ? anilistId[0] : null
  }
  return null
}

async function fixMyHeroAcademia() {
  try {
    // const resp = await aniClient.media.anime(101367)
    const resp = await findAnime(37576)
    console.log(resp)
  } catch (err) {
    console.log(err)
  }
}
fixMyHeroAcademia()
