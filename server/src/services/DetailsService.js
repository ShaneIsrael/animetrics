const service = {}
const {
  Show, Asset, EpisodeDiscussionResult, EpisodeDiscussion,
} = require('../models')

/**
 * Get Anime Info
 * @returns {Object} Information about an anime
 */
service.getAnime = async (id) => {
  const show = await Show.findOne({
    where: {
      id,
    },
    include: [Asset],
  })

  return show
}


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
