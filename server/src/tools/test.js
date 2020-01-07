const service = {}
const moment = require('moment')
const { findAnime, rawTvDbSearch, authTvDb } = require('../services')
const fetchDiscussions = require('../fetch/fetchDiscussions')
const fetchAssets = require('../fetch/fetchAssets')
const cpoll = require('../tools/calculatePoll')
const logger = require('../logger')
const { Show, Asset, MALSnapshot, RedditPollResult, Week, Season, EpisodeResultLink, EpisodeDiscussion, EpisodeDiscussionResult, RedditUserScore, Op} = require('../models')

const Anilist = require('anilist-node')
const aniClient = new Anilist()

//create animetrics anilist app 

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
    throw new Error('omg an error happened line 31')
  } catch (err) {
    logger.error(err)
  }
}
fixMyHeroAcademia()