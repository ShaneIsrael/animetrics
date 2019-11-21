const service = {}
const { Show, EpisodeDiscussionResult, EpisodeDiscussion } = require('../models')

/**
 * Get all weeks recorded
 * @returns {Array} An array of all the recorded weeks
 */
service.getAnimeDetailsByShowId = async (resultId, showId) => {
  const show = await Show.findByPk(showId)
  // const details = await mal.findAnime(show.mal_id)
  const episodeResult = await EpisodeDiscussionResult.findByPk(resultId)
  const discussion = await EpisodeDiscussion.findByPk(episodeResult.episodeDiscussionId)

  return { show, discussion }
}

module.exports = service
