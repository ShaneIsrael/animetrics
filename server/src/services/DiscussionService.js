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

  discussions = await EpisodeDiscussion.findAll({
    where: {
      post_title: {
        [Op.like]: `%${query}%`,
      },
    },
    order: [['post_created_dt', 'DESC']],
    include: [{ model: Show, include: [Asset] }],
    offset,
    limit,
  })

  if (discussions.length === 0) {
    const show = await Show.findOne({
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
          {
            title: {
              [Op.like]: `%${query.replace(' ', '%')}%`,
            },
          },
          {
            alt_title: {
              [Op.like]: `%${query.replace(' ', '%')}%`,
            },
          },
          {
            english_title: {
              [Op.like]: `%${query.replace(' ', '%')}%`,
            },
          },
          {
            seriesName: {
              [Op.like]: `%${query.replace(' ', '%')}%`,
            },
          },
        ],
      },
    })
    let showTitle
    let altTitle
    let seriesName
    let englishTitle
    if (show) {
      showTitle = show.title
      altTitle = show.alt_title
      seriesName = show.seriesName
      englishTitle = show.english_title
    }
    const or = [
      { post_title: { [Op.like]: `%${query}%` } },
      { post_title: { [Op.like]: `%${showTitle}%` } },
      { post_title: { [Op.like]: `%${altTitle}%` } },
      { post_title: { [Op.like]: `%${seriesName}%` } },
      { post_title: { [Op.like]: `%${englishTitle}%` } },
    ]

    discussions = await EpisodeDiscussion.findAll({
      where: {
        [Op.or]: or,
      },
      order: [['post_created_dt', 'DESC']],
      include: [{ model: Show, include: [Asset] }],
      offset,
      limit,
    })
  }

  return discussions
}

module.exports = service
