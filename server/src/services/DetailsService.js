const service = {}
const {
  Show, Asset, EpisodeDiscussionResult, EpisodeDiscussion, MALSnapshot,
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
 * Get Anime Stats
 * @returns {Object} Stats about an anime
 */
service.getAnimeStats = async (id) => {
  const show = await Show.findOne({
    where: {
      id,
    },
  })

  const { season } = show
  const stats = {
    seasonalKarma: [],
    seasonalRatings: [],
  }
  const eds = await EpisodeDiscussion.findAll({
    where: {
      showId: id,
      season,
    },
    order: [['episode', 'ASC']],
    include: [{ model: EpisodeDiscussionResult, include: [MALSnapshot] }],
  })

  for (const discussion of eds) {
    if (discussion.EpisodeDiscussionResult) {
      stats.seasonalKarma.push({
        name: `Ep ${discussion.episode}`,
        karma: discussion.EpisodeDiscussionResult.ups,
        comments: discussion.EpisodeDiscussionResult.comment_count,
      })
      stats.seasonalRatings.push({
        name: `Ep ${discussion.episode}`,
        RedditAnimeList: discussion.EpisodeDiscussionResult.ral,
        MyAnimeList: discussion.EpisodeDiscussionResult.MALSnapshot.score,
      })
    }
  }

  return stats
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
