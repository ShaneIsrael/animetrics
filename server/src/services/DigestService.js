const service = {}
const moment = require('moment')
const Anilist = require('anilist-node')
const Telegraf = require('telegraf')

const { environment } = require('../config')
const { getSubmission } = require('../fetch/fetchDiscussions')
const telegramConfig = require('../config')[environment].telegram
const bot = new Telegraf(telegramConfig.ANIMETRICS_DISCUSSION_BOT_TOKEN)

const { findAnime } = require('./MALService')
const utils = require('../tools/utils')
const {
  Asset,
  Week,
  Show,
  EpisodeDiscussion,
  EpisodeResultLink,
  Season,
  Op,
} = require('../models')

const logger = require('../logger')
const { digestDiscussionPost } = require('.')
const anilistClient = new Anilist()

moment.updateLocale('en', {
  week: {
    dow: 5,
  },
})

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds))

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

function getMyAnimeListUrl(text) {
  const url = text.match(/https?:\/\/(www\.)?(\w*myanimelist\w*)\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]anime\/[0-9]*)/gm)
  return url ? url[0] : null
}

function parseMalId(post) {
  const myAnimeListUrl = getMyAnimeListUrl(post.selftext)
  if (myAnimeListUrl) {
    const malId = myAnimeListUrl.match(/([0-9]\d+)/g)
    return malId ? malId[0] : null
  }
  return null
}

function parseEpisode(post) {
  const episodeString = post.title.match(/(episode\s\d+)/gi)
  if (episodeString) {
    const episode = episodeString[0].match(/\d+/gi)
    if (episode) {
      return episode[0]
    }
  }
  return null
}

function parseSeason(post) {
  const seasonString = post.title.match(/(season\s\d+)/gi)
  if (seasonString) {
    const season = seasonString[0].match(/\d+/gi)
    if (season) {
      return season[0]
    }
  }
  return 1
}

async function postTelegramDiscussion(show, episode, postId, media, anilistId, malId) {
  let title = show.english_title ? show.english_title : show.title
  logger.info(`posting telegram discussion: ${title}`)
  title = title.replace(/(\sseason\s\d+)/gi, '')
  bot.telegram.sendPhoto(telegramConfig.discussion_feed_channel, media, {
    caption: `*${title}*\n` +
             `_season ${show.season}, episode ${episode}_\n\n` +
             `[AniList](https://anilist.co/anime/${anilistId}) / [MyAnimeList](https://myanimelist.net/anime/${malId})\n\n`+
             `[Open Episode Discussion](https://redd.it/${postId})`,
    parse_mode: 'Markdown'
  }).catch((err) => {
    logger.error(err)
  })
}

function parsePollUrl(text) {
  const url = text.match(/https?:\/\/(www\.)?(\w*youpoll\w*)\.[a-zA-Z0-9()]{1,6}\/\d+\/\w*/gm)
  // If the first result has /r assume that the poll wasn't posted with this discussion
  if (url && url[0].indexOf('/r') >= 0) return null
  return url ? url[0] : null
}

/**
 * Takes a reddit discussion post id and digests it.
 * @param {string} postId A reddit post id
 */
service.submitDiscussion = async (postId) => {
  try {
    const post = await getSubmission(postId)
    const digestResult = await digestDiscussionPost(post)
    if (digestResult.result === true) {
      return "Discussion digested successfully!"
    }
    return `Failed to digest: ${digestResult.reason}`
  } catch(err) {
    logger.error(err)
    return "Unable to digest that discussion, is it a valid discussion id?"
  }
}

/**
 * Digests a discussion post and stores in the database
 * @param {Object} post A reddit discussion post object
 */
service.digestDiscussionPost = async (post, ignoreFlair) => {
  if (post.author.name !== 'AutoLovepon') return {result: false, reason: `Incorrect Author [${post.author.name}]`}
  if (post.selftext === '[removed]') return {result: false, reason: 'Removed'}
  if (!ignoreFlair && post.link_flair_text && post.link_flair_text !== 'Episode') return {result: false, reason: 'Invalid Flair'}
  if (post.title.indexOf('Megathread') !== -1) return {result: false, reason: 'Is Megathread'}
  if (post.title.indexOf('Episode') === -1) return {result: false, reason: 'Episode not in title'}

  let discussion = await EpisodeDiscussion.findOne({
    where: { post_id: post.id },
  })
  if (discussion) {
    logger.info(`discussion ${post.id} already digested, ignoring.`)
    return {result: false, reason: 'Already Digested'}
  }
  // logger.info(`Digesting: ${post.title}`)

  const malId = parseMalId(post)
  const anilistId = parseAnilistId(post)
  const episode = parseEpisode(post)
  const season = parseSeason(post)
  const pollUrl = parsePollUrl(post.selftext)
  let malDetails
  try {
    malDetails = await findAnime(malId)
  } catch (err) {
    logger.warn('issue trying to get malDetails: ', err)
  }
  if (!anilistId) {
    logger.warn(`Could not parse anilist id for show: ${post.title} href: ${post.url}`)
    return {result: false, reason: 'Unable to parse Anilist id'}
  }
  const anilistDetails = await anilistClient.media.anime(anilistId)
  await sleep(1000) // until we get a anilist service, add rate limit protection here
  if (!anilistDetails || !episode) {
    logger.error(`Could not parse discussion [${post.id}] anilistId=${anilistId} episode=${episode}`)
    return {result: false, reason: 'Could not parse discussion'}
  }
  // don't create discussions for filler episodes such as 5.5
  if (!Number.isInteger(Number(episode))) return {result: false, reason: 'Filler Episode or Extra'}

  const showTitle = anilistDetails.title.userPreferred

  // Lookup show in the database
  let showRow = await Show.findOne({ where: { anilist_id: anilistId } })

  if (!showRow) {
    // eslint-disable-next-line no-nested-ternary
    logger.info(`Creating new show: title=${showTitle} altTitle=${anilistDetails.title.romaji} englishTitle=${anilistDetails.title.english} anilistId=${anilistId}`)
    showRow = await Show.create({
      title: showTitle,
      alt_title: anilistDetails.title.romaji,
      english_title: anilistDetails.title.english,
      synopsis: malDetails ? malDetails.synopsis : anilistDetails.description,
      mal_id: malId,
      anilist_id: anilistId,
      season,
    })
  }

  const postWeekStartDt = moment(post.created_utc * 1000)
    .utc()
    .startOf('week') // Friday
    .format('YYYY-MM-DD 00:00:00')
  const postWeekEndDt = moment(post.created_utc * 1000)
    .utc()
    .endOf('week') // Thursday
    .format('YYYY-MM-DD 23:59:59')
  let weekRow = await Week.findOne({ where: { start_dt: postWeekStartDt } })
  if (!weekRow) {
    const seasonOfYear = utils.getAnimeSeason(postWeekStartDt)
    const year = moment.utc(postWeekStartDt).year()
    const seasonRow = await Season.findOrCreate({
      where: { season: seasonOfYear, year },
      defaults: { season: seasonOfYear, year },
    })
    weekRow = await Week.create({
      start_dt: postWeekStartDt,
      end_dt: postWeekEndDt,
      seasonId: seasonRow[0].id,
    })
  }
  logger.info(`creating discussion for Show: ${anilistDetails.title.userPreferred} Season: ${season} Episode: ${episode}`)
  discussion = await EpisodeDiscussion.create({
    showId: showRow.id,
    weekId: weekRow.id,
    post_id: post.id,
    season: Number(season) ? Number(season) : 1,
    episode: Number(episode),
    post_poll_url: pollUrl,
    post_title: post.title,
    post_url: post.url,
    post_created_dt: moment(post.created_utc * 1000)
      .utc()
      .format('YYYY-MM-DD HH:mm:ss'),
  })
  const episodeResultLink = await EpisodeResultLink.findOne({ where: { episodeDiscussionId: discussion.id } })
  if (!episodeResultLink) {
    await EpisodeResultLink.create({
      showId: showRow.id,
      weekId: weekRow.id,
      episodeDiscussionId: discussion.id,
    })
  }
  const assetExists = await Asset.findOne({
    where: { showId: discussion.showId },
  })
  const posterArt = anilistDetails.coverImage.large ? anilistDetails.coverImage.large : anilistDetails.coverImage.medium
  if (!assetExists) {
    if (anilistDetails) {
      await Asset.create({
        showId: discussion.showId,
        season: discussion.season,
        poster_art: posterArt,
      })
    } else {
      await Asset.create({
        showId: discussion.showId,
        season: discussion.season,
      })
    }
  }
  postTelegramDiscussion(showRow, episode, post.id, posterArt, anilistId, malId)
  return {result: true}
}


module.exports = service
