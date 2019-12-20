const { getTodaysDiscussions, getRecentDiscussions, getDiscussionsByPage } = require('../services')

const controller = {}

/**
 * Gets discusssions that were created today
 */
controller.getTodaysDiscussions = async (req, res, next) => {
  try {
    const discussions = await getTodaysDiscussions()
    res.status(200).send(discussions)
  } catch (err) {
    next(err)
  }
}

/**
 * Gets last 15 discussions
 */
controller.getRecentDiscussions = async (req, res, next) => {
  try {
    const discussions = await getRecentDiscussions()
    res.status(200).send(discussions)
  } catch (err) {
    next(err)
  }
}

/**
 * Gets discussions by page
 */
controller.getDiscussionsByPage = async (req, res, next) => {
  try {
    const { page, size, query } = req.query
    if (isNaN(page)) throw new Error('page must be a number')
    if (isNaN(size)) throw new Error('size must be a number')
    if (typeof query !== 'string') throw new Error('query must be a string')
    
    const discussions = await getDiscussionsByPage(page, size, query)
    res.status(200).send(discussions)
  } catch (err) {
    next(err)
  }
}

module.exports = controller
