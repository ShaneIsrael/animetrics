const service = {}
const moment = require('moment')
const axios = require('axios')
const cheerio = require('cheerio')
const {
  Week,
  EpisodeDiscussion,
  EpisodeDiscussionResult,
  MALSnapshot,
  Show,
  Asset,
  Op,
} = require('../models')
const logger = require('../logger')
const { findAnime } = require('../services/MALService')
const fetchDiscussions = require('../fetch/fetchDiscussions')

async function scrapePollData(url) {
  const html = (await axios.get(`${url}/r`)).data
  const $ = cheerio.load(html)
  const results = {};
  $('.results-area.basic-type-results .basic-option-wrapper').each(
    (i, elem) => {
      const option = $(elem)
        .find('.basic-left-container span.basic-option-title')
        .text();
      const score = $(elem)
        .find('.basic-right-container span.basic-option-total')
        .text();
      results[option] = score;
    },
  )
  return results
}

/**
 * Get all weeks recorded
 * @param {number} id The id of the week to get results for
 * @returns {Array} An array of all the results for a given week
 */
service.getResultsByWeek = async (id) => {
  const week = await Week.findOne({ where: { id }, order: [[EpisodeDiscussionResult, 'ups', 'DESC']], include: [{ model: EpisodeDiscussionResult, include: [MALSnapshot, { model: Show, include: [Asset] }, EpisodeDiscussion] }] })
  const prevWeek = moment(new Date(week.start_dt)).subtract(7, 'days').format('YYYY-MM-DD HH:mm:ss')
  const previusWeeksResults = await Week.findOne({ where: { [Op.and]: { start_dt: { [Op.lte]: prevWeek }, end_dt: { [Op.gte]: prevWeek } } }, order: [[EpisodeDiscussionResult, 'ups', 'DESC']], include: [{ model: EpisodeDiscussionResult, include: [MALSnapshot, EpisodeDiscussion] }] })
  const results = []
  for (const result of week.EpisodeDiscussionResults) {
    results.push({
      current: result.dataValues,
      currentMal: result.MALSnapshot.dataValues,
      currentRal: {},
      currentPoll: null,
      discussion: result.EpisodeDiscussion.dataValues,
      show: result.Show.dataValues,
      asset: {
        season: result.Show.Assets[0].season,
      },
      previous: {},
      previousMal: {},
      previousPoll: null,
    })
  }
  if (previusWeeksResults) {
    let prevPosition = 0
    for (const preResult of previusWeeksResults.EpisodeDiscussionResults) {
      for (const result of results) {
        if (result.current.showId === preResult.showId) {
          result.previous = preResult.dataValues
          result.previous.position = prevPosition
          result.previousMal = preResult.MALSnapshot.dataValues
        }
      }
      prevPosition += 1
    }
  }
  return results
}

service.createDiscussionResult = async (link) => {
  const discussion = link.EpisodeDiscussion
  const malDetails = await findAnime(discussion.Show.mal_id)
  if (malDetails) {
    const malSnapshot = await MALSnapshot.create({
      showId: discussion.Show.id,
      weekId: discussion.Week.id,
      score: malDetails.score,
      scored_by: malDetails.scored_by,
      rank: malDetails.rank,
      episodes: malDetails.episodes,
      favorites: malDetails.favorites,
      popularity: malDetails.popularity,
      members: malDetails.members,
    })
    let pollDetails = null
    if (discussion.post_poll_url) {
      pollDetails = await scrapePollData(discussion.post_poll_url);
    }
    const post = await fetchDiscussions.getSubmission(discussion.post_id);
    const edr = await EpisodeDiscussionResult.create({
      episodeDiscussionId: discussion.id,
      malSnapshotId: malSnapshot.id,
      weekId: discussion.Week.id,
      showId: discussion.Show.id,
      ups: post.ups,
      comment_count: post.num_comments,
      poll_results: pollDetails,
    })
    link.episodeDiscussionResultId = edr.id
    link.save()
  } else {
    logger.info(`could not get MAL Details for Show ID: ${discussion.Show.id}`)
  }
}

module.exports = service
