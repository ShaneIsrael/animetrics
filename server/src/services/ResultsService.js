const service = {}
const moment = require('moment')
const axios = require('axios')
const cheerio = require('cheerio')
const {
  Week,
  EpisodeResultLink,
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
  //order: [[EpisodeDiscussionResult, 'ups', 'DESC']], include: [{ model: EpisodeDiscussionResult, include: [MALSnapshot, { model: Show, include: [Asset] }, EpisodeDiscussion] }] 
  const week = await Week.findOne({ where: { id }})
  const resultLinks = await EpisodeResultLink.findAll({where: {weekId: week.id, episodeDiscussionResultId: {[Op.ne]: null}}, include: [ {model: Show, include: [Asset]}, EpisodeDiscussion, { model: EpisodeDiscussionResult, include: [MALSnapshot] }]})
  const prevWeekDt = moment(new Date(week.start_dt)).subtract(7, 'days').format('YYYY-MM-DD HH:mm:ss')
  const prevWeek = await Week.findOne({ where: { [Op.and]: { start_dt: { [Op.lte]: prevWeekDt }, end_dt: { [Op.gte]: prevWeekDt } } }})
  const previousResultLinks = await EpisodeResultLink.findAll({where: {weekId: prevWeek.id}, include: [ {model: Show, include: [Asset]}, EpisodeDiscussion, { model: EpisodeDiscussionResult, include: [MALSnapshot] }]})
  
  const resultObjects = {}
  const previous = {}
  for(const rl of resultLinks) {
    resultObjects[rl.Show.id] = {
      show: rl.Show.dataValues,
      asset: {
        season: rl.Show.Assets[0].season,
      },
      result: rl.EpisodeDiscussionResult.dataValues,
      discussion: rl.EpisodeDiscussion.dataValues,
      mal: rl.EpisodeDiscussionResult.MALSnapshot.dataValues,
      ral: {},
      poll: {},
      previous: {}
    }
    // Sort the previous results to get their previous positions
    previousResultLinks.sort((a, b) => b.EpisodeDiscussionResult.ups - a.EpisodeDiscussionResult.ups)
    const prevPosition = 0
    for(const prl of previousResultLinks) {
      if (rl.Show.id === prl.Show.id) {
        resultObjects[rl.Show.id].previous = {
          show: prl.Show.dataValues,
          asset: {
            season: prl.Show.Assets[0].season,
          },
          result: prl.EpisodeDiscussionResult.dataValues,
          discussion: prl.EpisodeDiscussion.dataValues,
          mal: prl.EpisodeDiscussionResult.MALSnapshot.dataValues,
          ral: {},
          poll: {},
          position: prevPosition
        }
      }
      prevPosition += 1
    }
  }
  const resultsArray = []
  for (const key of Object.keys(resultObjects)) {
    resultsArray.push(resultObjects[key])
  }
  // Sort by karma
  resultsArray.sort((a, b) => b.result.ups - a.result.ups)

  return resultsArray
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
