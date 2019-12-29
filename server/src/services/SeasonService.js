const service = {}
const _ = require('lodash')
const { Season, Show, EpisodeDiscussionResult } = require('../models')

const seasonOrder = ['fall', 'summer', 'spring', 'winter']

/**
 * Get all recorded seasons
 * @returns {Array} An array of all the recorded seasons
 */
service.getSeasons = async () => {
  let seasons = await Season.findAll({ order: [['year', 'DESC']], raw: true })


  // We need to sort and group the results. Group by year, sort by proper seasonal order
  seasons.sort((a, b) => {
    return seasonOrder.indexOf(a.season) - seasonOrder.indexOf(b.season)
  })
  const grouped = _.groupBy(seasons, 'year')
  const groupedYears = Object.keys(grouped).sort((a, b) => b - a)

  const sorted = []
  for (const year of groupedYears) {
    sorted.push(...grouped[year])
  }
  return sorted
}

/**
 * Get all shows tracked in a particular season
 * @return {Array} An array of show ids and titles
 */
service.getSeasonShows = async (id) => {
  const showResult = (await Week.findAll({
    attributes: ['id'],
    where: {
      seasonId: id
    },
    include: [{ model: EpisodeDiscussionResult, attributes: ['id'], include: [{model: Show, attributes: ['id', 'title', 'english_title',]}]}],
    raw: true
  })).map((e, i) => {
    const title = e['EpisodeDiscussionResults.Show.english_title'] ? e['EpisodeDiscussionResults.Show.english_title'] : e['EpisodeDiscussionResults.Show.title']
    return {id: e['EpisodeDiscussionResults.Show.id'], title}
  })
  const shows = []
  for(const show of showResult) {
    if (show.title !== null && shows.map(e => e.title).indexOf(show.title) === -1) {
      shows.push(show)
    }
  }
  shows.sort((a, b) => {
    if ( a.title < b.title ) {
      return -1
    }
    if ( a.title > b.title ) {
      return 1
    }
    return 0
  })
  return shows
}

service.getAllShowEpisodeKarmaBySeason = async (seasonId, showId) => {
  const show = await Show.findOne({
    where: {
      id: showId
    }
  })
  const weeks = (await Week.findAll({
    attributes: ['id'],
    where: {
      seasonId
    },
    raw: true
  })).map((e, i) => e.id)
  const results = await EpisodeResultLink.findAll({
    where: {
      showId: show.id,
      weekId: {
        [Op.in]: weeks
      }
    },
    include: [{ model: EpisodeDiscussionResult, attributes: ['ups'] }, { model: EpisodeDiscussion, attributes: ['episode']}],
    order: [[EpisodeDiscussion, 'episode', 'desc']],
    raw: true
  })
  const episodeUps = []
  for (const result of results) {
    episodeUps.push({ups: result['EpisodeDiscussionResult.ups'], episode: result['EpisodeDiscussion.episode']})
  }
  episodeUps.sort((a, b) => a.episode - b.episode)
  return episodeUps
}

module.exports = service
