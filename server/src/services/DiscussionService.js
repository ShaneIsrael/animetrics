const moment = require('moment')
const sequelize = require('sequelize')

const service = {}

const {
  EpisodeDiscussion, Show, Asset, Op,
} = require('../models')

/**
 * Get todays episode discussions
 * @returns {Array} An array of todays discussions
 */
service.getTodaysDiscussions = async () => {
  const discussions = await EpisodeDiscussion.findAll({
    where: {
      post_created_dt: {
        [Op.gte]: moment.utc().subtract(24, 'hours').format(),
      },
    },
    order: [['post_created_dt', 'DESC']],
    include: [{ model: Show, include: [Asset] }],
  })
  return discussions
}

/**
 * Gets last 15 discussions
 * @returns {Array} An array of last 15 discussions
 */
service.getRecentDiscussions = async () => {
  const discussions = await EpisodeDiscussion.findAll({
    order: [['post_created_dt', 'DESC']],
    include: [{ model: Show, include: [Asset] }],
    limit: 15,
  })
  return discussions
}

/**
 * Gets discussions by page
 * @returns {Array} An array of discussions by page
 */
service.getDiscussionsByPage = async (page, size, query) => {
  const offset = page * size
  const limit = size

  let discussions

  const show = await Show.findAll({
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
  })
  // let showTitle
  // let altTitle
  // let seriesName
  // let englishTitle

  // if (show) {
  //   showTitle = show.title
  //   altTitle = show.alt_title
  //   seriesName = show.seriesName
  //   englishTitle = show.english_title
  // }

  // const or = [{ post_title: { [Op.like]: `%${query}%` } }]
  // if (showTitle) or.push({ post_title: { [Op.like]: `%${showTitle}%` } })
  // if (englishTitle) or.push({ post_title: { [Op.like]: `%${englishTitle}%` } })
  // if (seriesName) or.push({ post_title: { [Op.like]: `%${seriesName}%` } })
  // if (altTitle) or.push({ post_title: { [Op.like]: `%${altTitle}%` } })

  let showIds = []
  for (show of shows) {
    showIds.push(show.id)
  }

  discussions = await EpisodeDiscussion.findAll({
    where: {
      showId: {
        [Op.in]: showIds
      },
    },
    order: [['post_created_dt', 'DESC']],
    group: ['post_title'],
    include: [{ model: Show, include: [Asset] }],
    offset,
    limit,
  })
  return discussions
}

module.exports = service
