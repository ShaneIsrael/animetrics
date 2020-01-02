const service = {}
const moment = require('moment')
const { Asset, Show, EpisodeDiscussion, EpisodeDiscussionResult, RedditPollResult, Op} = require('../models')

/**
 * Gets top 10 by average karma score
 */
service.getYearlyTopTenAnimeByKarma = async (year) => {
  const animeResults = {}

  const results = await EpisodeDiscussion.findAll({
    where: {
      post_created_dt: {
        [Op.gte]: moment().year(year).format('YYYY-MM-DD'),
        [Op.lte]: moment().year(year).format('YYYY-12-31'),
      }
    },
    include: [{ model: EpisodeDiscussionResult, include: [{ model: Show, attributes: ['title', 'english_title', 'mal_id'], include: [Asset] }] }]
  })
  
  for (const r of results) {
    if (r.EpisodeDiscussionResult) {
      const show = r.EpisodeDiscussionResult.Show.title
      if (animeResults[show]) {

        animeResults[show].entries.push(r)
        animeResults[show].karmaEntries += 1
        animeResults[show].totalKarma += Number(r.EpisodeDiscussionResult.ups)
      }
      else {
        animeResults[show] = {
          show: r.EpisodeDiscussionResult.Show,
          entries: [r],
          totalKarma: Number(r.EpisodeDiscussionResult.ups),
          karmaEntries: 1,
        }
      }
    }
  }
  
  const karmaResult = []
  for (const show of Object.keys(animeResults)) {
    const result = animeResults[show]
    karmaResult.push({
      show: result.show,
      poster: result.show.Assets ? result.show.Assets[0].s3_poster : null,
      avg: result.totalKarma / result.karmaEntries,
      total: result.totalKarma,
      entries: result.karmaEntries
    })
  }
  karmaResult.sort((a, b) => b.avg - a.avg)
  const topFive = karmaResult.slice(0, 10)
  return topFive
}

/**
 * Gets Top 10 that have at least 10 poll results with 50 or more votes.
 */
service.getYearlyTopTenAnimeByRedditScore = async (year) => {
  const animeResults = {}
  const results = await EpisodeDiscussion.findAll({
    where: {
      post_created_dt: {
        [Op.gte]: moment().year(year).format('YYYY-MM-DD'),
        [Op.lte]: moment().year(year).format('YYYY-12-31'),
      }
    },
    include: [RedditPollResult, { model: EpisodeDiscussionResult, include: [{ model: Show, attributes: ['title', 'english_title', 'mal_id'], include: [Asset]}] }]
  })
  
  for (const r of results) {
    if (r.EpisodeDiscussionResult && r.RedditPollResult.votes >= 50) {
      const show = r.EpisodeDiscussionResult.Show.title
      if (animeResults[show]) {
        animeResults[show].entries.push(r)
        animeResults[show].scoreEntries += 1
        animeResults[show].totalScore += Number(r.RedditPollResult.score)
      }
      else {
        animeResults[show] = {
          entries: [r],
          totalScore: Number(r.RedditPollResult.score),
          scoreEntries: 1,
          show: r.EpisodeDiscussionResult.Show
        }
      }
    }
  }
  
  const scoreResult = []
  for (const show of Object.keys(animeResults)) {
    const result = animeResults[show]
    if (result.scoreEntries > 10) {
      scoreResult.push({
        show: result.show,
        poster: result.show.Assets ? result.show.Assets[0].s3_poster : null,
        avg: result.totalScore / result.scoreEntries,
        total: result.totalScore,
        entries: result.scoreEntries
      })
    }
  }
  scoreResult.sort((a, b) => b.avg - a.avg)
  const topFive = scoreResult.slice(0, 10)
  return topFive
}

/**
 * Gets Top 10 based off Reddit Anime List Score
 */
service.getYearlyTopTenAnimeByRedditAnimeListScore = async (year) => {
  const animeResults = {}
  const results = await EpisodeDiscussion.findAll({
    where: {
      post_created_dt: {
        [Op.gte]: moment().year(year).format('YYYY-MM-DD'),
        [Op.lte]: moment().year(year).format('YYYY-12-31'),
      }
    },
    include: [{ model: EpisodeDiscussionResult, include: [{ model: Show, attributes: ['title', 'english_title', 'mal_id'], include: [Asset]}] }]
  })
  
  for (const r of results) {
    if (r.EpisodeDiscussionResult && r.EpisodeDiscussionResult.ralScore) {
      const show = r.EpisodeDiscussionResult.Show.title
      if (animeResults[show]) {
        animeResults[show].entries.push(r)
        animeResults[show].scoreEntries += 1
        animeResults[show].totalScore += Number(r.EpisodeDiscussionResult.ralScore)
      }
      else {
        animeResults[show] = {
          entries: [r],
          totalScore: Number(r.EpisodeDiscussionResult.ralScore),
          scoreEntries: 1,
          show: r.EpisodeDiscussionResult.Show
        }
      }
    }
  }
  
  const scoreResult = []
  for (const show of Object.keys(animeResults)) {
    const result = animeResults[show]
    if (result.scoreEntries > 5) {
      scoreResult.push({
        show: result.show,
        poster: result.show.Assets ? result.show.Assets[0].s3_poster : null,
        avg: result.totalScore / result.scoreEntries,
        total: result.totalScore,
        entries: result.scoreEntries
      })
    }
  }
  scoreResult.sort((a, b) => b.avg - a.avg)
  const topFive = scoreResult.slice(0, 10)
  return topFive
}

module.exports = service
