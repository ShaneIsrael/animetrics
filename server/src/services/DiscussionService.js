const moment = require('moment')
const sequelize = require('sequelize')

const service = {}

const { EpisodeDiscussion, Show, Asset, Op } = require('../models')

/**
 * Get todays episode discussions
 * @returns {Array} An array of todays discussions
 */
service.getTodaysDiscussions = async () => {
  //sequelize.where(sequelize.fn('date', sequelize.col('post_created_dt')), '=', moment.utc().format('YYYY-MM-DD'))
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

module.exports = service
