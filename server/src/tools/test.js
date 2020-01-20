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

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds))
async function test() {
  try {
    const shows = await Show.findAll()

    for (const show of shows) {
      if (show.anilist_id) {
        const anilistDetails = await aniClient.media.anime(show.anilist_id)
        await sleep(500) // until we get a anilist service, add rate limit protection here
        // show.season = 
        // show.synopsis = 
        console.log(anilistDetails)
        //show.save()
      }
    }

  } catch (err) {
    console.log(err)
  }
}
test()
