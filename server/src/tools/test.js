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
    const shows = await Show.findAll({
      include: [Asset]
    })

    for (const show of shows) {
      if (!show.Assets[0]) {
        const anilistDetails = await aniClient.media.anime(show.anilist_id)
        await sleep(500) // until we get a anilist service, add rate limit protection here
        const posterArt = anilistDetails.coverImage.large ? anilistDetails.coverImage.large : anilistDetails.coverImage.medium
        await Asset.create({
          showId: show.id,
          season: show.season,
          poster_art: posterArt,
        })
        console.log(`created asset for ${show.id}`)
        //show.save()
      }
    }

  } catch (err) {
    console.log(err)
  }
}
// test()

// async function testAnilist() {
//   const anilistDetails = await aniClient.media.anime(106479)
//   console.log(anilistDetails)
// }
// testAnilist()

async function test2() {
  try {
    const post = await fetchDiscussions.getSubmission("hcqnym")
    console.log(post)
  } catch (err) {
    console.log(err)
  }
}
test2()