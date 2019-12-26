const service = {}
const moment = require('moment')
const { findAnime, searchAnime } = require('./MALService')
const utils = require('../tools/utils')
const {
  Asset,
  Week,
  Show,
  EpisodeDiscussion,
  EpisodeResultLink,
  Season,
  Op
} = require('../models')

const logger = require('../logger')

moment.updateLocale('en', {
  week: {
    dow: 5,
  },
})

function parseMalId(post) {
  const myAnimeListUrl = getMyAnimeListUrl(post.selftext)
  if (myAnimeListUrl) {
    const malId = myAnimeListUrl.match(/([1-9]\d+)/g)
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

function parsePollUrl(text) {
  const url = text.match(/https?:\/\/(www\.)?(\w*youpoll\w*)\.[a-zA-Z0-9()]{1,6}\/\d+\/\w*/gm)
  // If the first result has /r assume that the poll wasn't posted with this discussion
  if (url && url[0].indexOf('/r') >= 0) return null
  return url ? url[0] : null
}

function getMyAnimeListUrl(text) {
  const url = text.match(/https?:\/\/(www\.)?(\w*myanimelist\w*)\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]anime\/[1-9]*)/gm)
  return url ? url[0] : null
}

/**
 * Digests a discussion post and stores in the database
 * @param {Object} post A reddit discussion post object
 */
async function digestDiscussionPost(post, ignoreFlair) {
  if (!ignoreFlair && post.link_flair_text && post.link_flair_text !== 'Episode') return
  if (post.title.indexOf('Megathread') !== -1) return
  if (post.title.indexOf('Episode') === -1) return
  // logger.info(`Digesting: ${post.title}`)

  const malId = parseMalId(post)
  const episode = parseEpisode(post)
  const season = parseSeason(post)
  const pollUrl = parsePollUrl(post.selftext)

  if (!malDetails || !episode) {
    return logger.error(`Could not parse discussion [${post.id}] malId=${malId} episode=${episode}`)
  }
  // don't create discussions for filler episodes such as 5.5
  if (!Number.isInteger(Number(episode))) return
  const malDetails = await findAnime(malId)

  const altTitle = malDetails.title_english
  ? malDetails.title_english
  : malDetails.title_synonyms
    ? malDetails.title_synonyms[0]
    : null
  
  let showRow 
  if (altTitle) {
    showRow = await Show.findOne({ where: { title: malDetails.title } })
  } else {
    showRow = await Show.findOne({ where: {
      [Op.or]: [
        {
          title: malDetails.title 
        },
        {
          alt_title: altTitle
        }
      ]
    } })
  }

  if (!showRow) {
    // eslint-disable-next-line no-nested-ternary
    logger.info(`Creating new show: title=${showTitle} altTitle=${altTitle} malId=${malId}`)
    showRow = await Show.create({
      title: showTitle,
      alt_title: altTitle,
      mal_id: malId,
    })
  }
  let discussion = await EpisodeDiscussion.findOne({
    where: { post_id: post.id },
  })

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
    const season = await Season.findOrCreate({
      where: { season: seasonOfYear, year },
      defaults: { season: seasonOfYear, year }
    })
    weekRow = await Week.create({
      start_dt: postWeekStartDt,
      end_dt: postWeekEndDt,
      seasonId: season[0].id
    })
  }
  if (!discussion) {
    logger.info(`creating discussion for Show: ${malDetails.title} Season: ${season} Episode: ${episode}`)
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
  }
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
  if (!assetExists) {
    await Asset.create({
      showId: discussion.showId,
      season: discussion.season,
    })
  }
}


module.exports = service
