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

const Telegraf = require('telegraf')
const bot = new Telegraf('924683234:AAH3WaupBKq9NczvPgtouAQb7Z6tWIoUcl0')
const channelId = '-1001319894434'

async function postTelegramDiscussion(show, episode, postId, media) {
  const title = show.english_title ? show.english_title : show.title
  logger.info(`posting telegram discussion: ${title}`)
  bot.telegram.sendPhoto(channelId, media, {
    caption: `${title}\n[Season ${show.season}, Episode ${episode}]\nhttps://redd.it/${postId}`,
  })
  .then(() => {
    logger.info(`telegram discussion posted successfully for: ${title}`)
  })
  .catch((err) => {
    logger.error(err)
  })
}

async function test() {
  try {
    const show = await Show.findOne({
      include: [Asset, EpisodeDiscussion]
    })

    postTelegramDiscussion(show, show.EpisodeDiscussions[0].episode, show.EpisodeDiscussions[0].post_id, `https://cdn.animetrics.co/${show.Assets[0].s3_poster_compressed}`)
  } catch (err) {
    console.log(err)
  }
}
test()
