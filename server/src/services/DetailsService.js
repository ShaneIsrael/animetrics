const service = {}
const {
  Show, Asset, EpisodeDiscussionResult, EpisodeDiscussion, MALSnapshot, RedditPollResult, Op, Sequelize
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
    seasonalPopularity: [],
  }
  const eds = await EpisodeDiscussion.findAll({
    where: {
      showId: id,
      season,
    },
    order: [['episode', 'ASC']],
    include: [{ model: EpisodeDiscussionResult, include: [MALSnapshot] }, RedditPollResult],
  })

  for (const discussion of eds) {
    if (discussion.EpisodeDiscussionResult) {
      let karma = discussion.EpisodeDiscussionResult.ups
      stats.seasonalKarma.push({
        name: `Ep ${discussion.episode}`,
        Karma: discussion.EpisodeDiscussionResult.ups,
        Comments: discussion.EpisodeDiscussionResult.comment_count,
      })
      stats.seasonalRatings.push({
        name: `Ep ${discussion.episode}`,
        RedditAnimeList: Number(discussion.EpisodeDiscussionResult.ralScore) === 0 ? 1 : discussion.EpisodeDiscussionResult.ralScore,
        MyAnimeList: discussion.EpisodeDiscussionResult.MALSnapshot.score,
        RedditPollScore: discussion.RedditPollResult ? discussion.RedditPollResult.score : 0
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


/**
 * Gets anime by search query
 * @returns {Array} An array of anime
 */
service.searchAnimetricsAnime = async (query) => {
  const shows = await Show.findAll({
    attributes: ['title', 'english_title', 'id'],
    where: {
      [Op.or]: [
        {
          title: {
            [Op.like]: `%${query}%`,
          },
        },
        {
          alt_title: {
            [Op.like]: `%${query}%`,
          },
        },
        {
          english_title: {
            [Op.like]: `%${query}%`,
          },
        },
        {
          seriesName: {
            [Op.like]: `%${query}%`,
          },
        },
      ],
    },
    include: [{ model: Asset, attributes: ['s3_poster', 's3_poster_compressed']}],
    order: query ? [['english_title', 'DESC']] : Sequelize.literal('random()'),
    limit: 50
  })

  return shows
}

/**
 * Gets random anime
 * @returns {number} id of a random anime
 */
service.getRandomAnime = async () => {
  const show = await Show.findOne({
    attributes: ['id'],
    order: Sequelize.literal('random()'),
  })

  return show.id
}



module.exports = service
