const service = {}
const moment = require('moment')
const { findAnime } = require('../services')
const fetchDiscussions = require('../fetch/fetchDiscussions')
const cpoll = require('../tools/calculatePoll')
const logger = require('../logger')
const { Show, Week, Season, EpisodeResultLink, EpisodeDiscussion, EpisodeDiscussionResult, Op} = require('../models')

async function top5OfTheYear() {

  const animeResults = {}
  const missingResults = []

  const results = await EpisodeDiscussion.findAll({
    where: {
      post_created_dt: {
        [Op.gte]: moment().year(2019).format('YYYY-MM-DD')
      }
    },
    include: [{ model: EpisodeDiscussionResult, include: [Show] }]
  })
  
  for (const r of results) {
    if (r.EpisodeDiscussionResult) {
      const show = r.EpisodeDiscussionResult.Show.title
      if (animeResults[show]) {
        animeResults[show].entries.push(r)
        animeResults[show].karmaEntries += 1
        animeResults[show].totalKarma += Number(r.EpisodeDiscussionResult.ups)
        if (r.EpisodeDiscussionResult.ralScore && r.EpisodeDiscussionResult.ralScore > 0) {
          animeResults[show].scoreEntries += 1
          animeResults[show].totalScore += Number(r.EpisodeDiscussionResult.ralScore)
        }
      }
      else {
        animeResults[show] = {
          entries: [r],
          totalKarma: Number(r.EpisodeDiscussionResult.ups),
          totalScore: r.EpisodeDiscussionResult.ralScore && r.EpisodeDiscussionResult.ralScore > 0 ? Number(r.EpisodeDiscussionResult.ralScore) : 0,
          karmaEntries: 1,
          scoreEntries: 1,
          show: r.EpisodeDiscussionResult.Show
        }
      }
    } else {
      missingResults.push(r)
    }
  }
  
  const karmaResult = []
  const scoreResult = []
  for (const show of Object.keys(animeResults)) {
    const result = animeResults[show]
    karmaResult.push({
      show: result.show,
      avg: result.totalKarma / result.karmaEntries,
      total: result.totalKarma,
      entries: result.karmaEntries
    })
    if (result.scoreEntries > 10) {
      scoreResult.push({
        show: result.show,
        avg: result.totalScore / result.scoreEntries,
        total: result.totalScore,
        entries: result.scoreEntries
      })
    }
  }
  karmaResult.sort((a, b) => b.avg - a.avg)
  scoreResult.sort((a, b) => b.avg - a.avg)
}
top5OfTheYear()
