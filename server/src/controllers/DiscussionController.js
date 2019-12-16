const { getTodaysDiscussions, getRecentDiscussions } = require('../services')

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

module.exports = controller
