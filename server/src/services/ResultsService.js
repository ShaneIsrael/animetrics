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
  RedditPollResult,
  Op,
} = require('../models')
const logger = require('../logger')
const { findAnime } = require('../services/MALService')
const fetchDiscussions = require('../fetch/fetchDiscussions')
const cpoll = require('../tools/calculatePoll')

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds))

async function scrapePollData(url) {
  const html = (await axios.get(`${url}/r`)).data
  const $ = cheerio.load(html)
  const results = {};
  if ($('.results-area.basic-type-results').length > 0) {
    $('.results-area.basic-type-results').find('.basic-option-wrapper').each(
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
  }
  else if ($('.results-area.rating-type-results').length > 0) {
    $('.results-area.rating-type-results').find('.rating-option-wrapper').each(
      (i, elem) => {
        const option = $(elem)
          .find('.rating-left-wrapper')
          .text();
        const score = $(elem)
          .find('.rating-right-wrapper')
          .text().replace('(', '').replace(')', '');
        results[option] = score;
      },
    )
  }
  return results
}

service.scrapePollData = async (url) => scrapePollData(url)

/**
 * Get all poll rankings by week
 * @param {number} id The id of the week to get results for
 * @returns {Array} An array of all the results for a given week
 */
service.getRedditPollResultsByWeek = async (id) => {
  const week = await Week.findOne({ where: { id } })
  const prevWeekDt = moment(new Date(week.start_dt)).subtract(3, 'days').format('YYYY-MM-DD HH:mm:ss')
  const prevWeek = await Week.findOne({ where: { [Op.and]: { start_dt: { [Op.lte]: prevWeekDt }, end_dt: { [Op.gte]: prevWeekDt } } } })
  const pollResults = await RedditPollResult.findAll({ where: { weekId: id, votes: { [Op.gte]: 50 } }, order: [['score', 'DESC']], include: [{ model: Show, include: [{ model: Asset, raw: true }] }, EpisodeDiscussion] })
  let prevPollResults
  if (prevWeek) {
    prevPollResults = await RedditPollResult.findAll({ where: { weekId: prevWeek.id, votes: { [Op.gte]: 50 } }, order: [['score', 'DESC']], raw: true })
  }

  const results = []

  let cPos = 0
  let pPos = 0
  for (const cr of pollResults) {
    let previous
    if (prevPollResults) {
      for (const pr of prevPollResults) {
        if (pr.showId === cr.showId) {
          previous = pr
          break
        }
        pPos += 1
      }
    }
    if (previous) previous.position = pPos
    pPos = 0
    results.push({
      show: cr.Show.dataValues,
      discussion: cr.EpisodeDiscussion.dataValues,
      assets: cr.Show.Assets,
      score: cr.score,
      votes: cr.votes,
      poll: cr.poll,
      position: cPos,
      previous,
    })
    cPos += 1
  }
  return results
}

/**
 * Get all weeks recorded
 * @param {number} id The id of the week to get results for
 * @returns {Array} An array of all the results for a given week
 */
service.getResultsByWeek = async (id) => {
  // order: [[EpisodeDiscussionResult, 'ups', 'DESC']], include: [{ model: EpisodeDiscussionResult, include: [MALSnapshot, { model: Show, include: [Asset] }, EpisodeDiscussion] }]
  const week = await Week.findOne({ where: { id } })
  const prevWeekDt = moment(new Date(week.start_dt)).subtract(7, 'days').format('YYYY-MM-DD HH:mm:ss')
  const resultLinks = await EpisodeResultLink.findAll({ where: { weekId: week.id, episodeDiscussionResultId: { [Op.ne]: null } }, include: [{ model: Show, include: [{ model: Asset, raw: true }] }, { model: EpisodeDiscussion, include: [RedditPollResult] }, { model: EpisodeDiscussionResult, include: [MALSnapshot] }] })

  const prevWeek = await Week.findOne({ where: { [Op.and]: { start_dt: { [Op.lte]: prevWeekDt }, end_dt: { [Op.gte]: prevWeekDt } } } })
  let previousResultLinks
  if (prevWeek) { previousResultLinks = await EpisodeResultLink.findAll({ where: { weekId: prevWeek.id }, include: [{ model: Show, include: [{ model: Asset, raw: true }] }, {model: EpisodeDiscussion, include: [RedditPollResult]}, { model: EpisodeDiscussionResult, include: [MALSnapshot] }] }) }

  const resultObjects = {}
  for (const rl of resultLinks) {
    resultObjects[rl.showId] = {
      show: rl.Show.dataValues,
      assets: rl.Show.Assets,
      result: rl.EpisodeDiscussionResult.dataValues,
      discussion: rl.EpisodeDiscussion.dataValues,
      mal: rl.EpisodeDiscussionResult.MALSnapshot.dataValues,
      poll: {
        score: rl.EpisodeDiscussion.RedditPollResult ? rl.EpisodeDiscussion.RedditPollResult.score : null,
      },
      previous: {},
    }
    if (previousResultLinks) {
      // Sort the previous results to get their previous positions
      previousResultLinks.sort((a, b) => b.EpisodeDiscussionResult.ups - a.EpisodeDiscussionResult.ups)
      let prevPosition = 0
      for (const prl of previousResultLinks) {
        if (rl.showId === prl.showId) {
          resultObjects[rl.showId].previous = {
            show: prl.Show.dataValues,
            assets: {
              season: prl.Show.Assets,
            },
            result: prl.EpisodeDiscussionResult.dataValues,
            discussion: prl.EpisodeDiscussion.dataValues,
            mal: prl.EpisodeDiscussionResult.MALSnapshot.dataValues,
            position: prevPosition,
            poll: {
              score: prl.EpisodeDiscussion.RedditPollResult ? prl.EpisodeDiscussion.RedditPollResult.score : null,
            },
          }
        }
        prevPosition += 1
      }
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
  logger.info('Getting MAL details...')
  const malDetails = await findAnime(link.Show.mal_id)
  const [ralScore] = await cpoll.calculateRedditMalRating(link.Show.id)
  // Sleep to make sure the db updates.
  await sleep(2500)
  if (malDetails) {
    logger.info('creating MAL Snapshot...')
    const malSnapshot = await MALSnapshot.create({
      showId: link.Show.id,
      weekId: link.Week.id,
      score: malDetails.score || 0,
      scored_by: malDetails.scored_by,
      rank: malDetails.rank || 0,
      episodes: malDetails.episodes,
      favorites: malDetails.favorites,
      popularity: malDetails.popularity,
      members: malDetails.members,
    })
    logger.info('scraping poll data...')
    let pollDetails = null
    if (discussion.post_poll_url) {
      pollDetails = await scrapePollData(discussion.post_poll_url);
    }
    logger.info('getting submission data...')
    const post = await fetchDiscussions.getSubmission(discussion.post_id);
    logger.info('creating discussion result...')
    const edr = await EpisodeDiscussionResult.create({
      episodeDiscussionId: discussion.id,
      malSnapshotId: malSnapshot.id,
      weekId: link.Week.id,
      showId: link.Show.id,
      ups: post.ups,
      comment_count: post.num_comments,
      ralScore,
    })
    link.episodeDiscussionResultId = edr.id
    link.save()
    const pollResult = cpoll.calculateRating(pollDetails)
    const hasPollResult = await RedditPollResult.findOne({
      where: {
        episodeDiscussionId: discussion.id,
      },
    })
    let rpr
    if (!hasPollResult) {
      logger.info('creating poll result...')
      rpr = await RedditPollResult.create({
        showId: link.Show.id,
        weekId: link.Week.id,
        episodeDiscussionId: discussion.id,
        poll: pollDetails,
        score: pollResult[1] === 0 ? 0 : pollResult[0],
        votes: pollResult[1],
      })
    }
    logger.info('-- Done.')
    return {edr, rpr}
  } else {
    logger.info(`could not get MAL Details for Show ID: ${link.Show.id}`)
    return null
  }
}

service.updateRedditAnimeListScore = async (result) => {
  const [ralScore] = await cpoll.calculateRedditMalRating(result.Show.id)
  result.ralScore = ralScore
  return result.save()
}

module.exports = service
