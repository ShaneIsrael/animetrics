const service = {}
const moment = require('moment')
const { findAnime, searchAnime } = require('./MALService')

const {
  Asset,
  Week,
  Show,
  EpisodeDiscussion,
  EpisodeResultLink,
} = require('../models')

const logger = require('../logger')

function getMalSeasonName(season) {
  switch (Number(season)) {
  case 1:
    return '1st Season';
  case 2:
    return '2nd Season';
  case 3:
    return '3rd Season';
  case 21:
    return '21st Season';
  case 22:
    return '22nd Season';
  case 23:
    return '23rd Season';
  default:
    return `${season}th Season`;
  }
}

async function searchMal(seasonNumber, showTitle) {
  const malTitleFormat = seasonNumber > 1
    ? `${showTitle} ${getMalSeasonName(seasonNumber)}`
    : showTitle;
  const anime = await searchAnime(showTitle)
  let result = {};
  const latest = { id: anime.results[0].mal_id, result: anime.results[0] };
  // Attempt to find correct MAL data via general MAL Title Format
  for (const r of anime.results) {
    if (r.title.toLowerCase() === malTitleFormat.toLowerCase()) {
      result = r;
      break;
    }
    // Set latest to the latest TV with the showTitle in the MAL title
    if (
      r.type === 'TV'
      && r.title.toLowerCase().indexOf(showTitle.toLowerCase()) >= 0
    ) {
      if (r.mal_id > latest.id) {
        latest.id = r.mal_id;
        latest.result = r;
      }
    }
  }
  // If it couldn't find it based of general MAL Title Format, use latest entry
  if (Object.keys(result).length === 0) {
    // console.log(`using latest result for: ${showTitle}`)
    result = latest.result;
  }
  return result;
}

/**
 * Digests a discussion post and stores in the database
 * @param {Object} post A reddit discussion post object
 */
service.digestDiscussionPost = async (post) => {
  if (post.link_flair_text !== 'Episode') return
  if (post.title.indexOf('Megathread') !== -1) return
  if (post.title.indexOf('- Episode ') === -1) return
  logger.info(`Digesting: ${post.title}`)
  const seasonSplit = post.title.split(/ Season /)[1];
  const seasonNumber = seasonSplit ? seasonSplit.split(' ')[0] : 1
  const showTitle = post.title.split(' - Episode')[0].split(' Season')[0]
  const episodeNumber = post.title.split('- Episode ')[1].split(' ')[0]
  const pollUrl = post.selftext_html
    .split('">Rate')[0]
    .split('<h1><a href="')[1]

  let showRow = await Show.findOne({ where: { title: showTitle } })
  if (!showRow) {
    const malResult = await searchMal(seasonNumber, showTitle)
    const malDetails = await findAnime(malResult.mal_id)
    // eslint-disable-next-line no-nested-ternary
    const altTitle = malDetails.title_english
      ? malDetails.title_english
      : malDetails.title_synonyms
        ? malDetails.title_synonyms[0]
        : null
    showRow = await Show.create({
      title: showTitle,
      alt_title: altTitle,
      mal_id: malDetails.mal_id,
    })
  }
  let discussion = await EpisodeDiscussion.findOne({
    where: { post_id: post.id },
  })
  const postWeekStartDt = moment(post.created_utc * 1000)
    .utc()
    .startOf('week').isoWeekday(5) // Friday
    .format('YYYY-MM-DD 00:00:00')
  const postWeekEndDt = moment(post.created_utc * 1000)
    .utc()
    .endOf('week').isoWeekday(4) // Thursday
    .format('YYYY-MM-DD 23:59:59')
  let weekRow = await Week.findOne({ where: { start_dt: postWeekStartDt } })
  if (!weekRow) {
    weekRow = await Week.create({
      start_dt: postWeekStartDt,
      end_dt: postWeekEndDt,
    })
  }
  if (!discussion) {
    discussion = await EpisodeDiscussion.create({
      showId: showRow.id,
      weekId: weekRow.id,
      post_id: post.id,
      season: Number(seasonNumber),
      episode: Number(episodeNumber),
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
