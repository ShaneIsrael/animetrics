const service = {}

const { Show, Asset } = require('../models')

/**
 * Gets shows
 * @returns {array} Shows
 */
service.getShows = async () => {
  const shows = await Show.findAll({
    attributes: ['id', 'title', 'alt_title', 'genre', 'synopsis'],
    order: [['title', 'ASC']],
    raw: true,
  })
  return shows
}

/**
 * Gets shows and assets
 * @returns {array} Shows with their respective assets
 */
service.getShowsAndAssets = async () => {
  const shows = await Show.findAll({
    attributes: ['id', 'title', 'alt_title', 'genre', 'synopsis'],
    order: [['title', 'ASC']],
    include: [{ model: Asset, attributes: ['id', 'season', 's3_avatar', 's3_banner', 's3_poster'] }],
  })
  return shows
}

module.exports = service
