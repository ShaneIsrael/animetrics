const moment = require('moment')
const sequelize = require('sequelize')

const service = {}

const { EpisodeDiscussion, Show, Asset, Op } = require('../models')

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
    limit: 15
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

  const discussions = await EpisodeDiscussion.findAll({
    where: {
      post_title: {
        [Op.like]: `%${query}%`
      }
    },
    order: [['post_created_dt', 'DESC']],
    include: [{ model: Show, include: [Asset] }],
    offset,
    limit
  })
  return discussions
}

module.exports = service
