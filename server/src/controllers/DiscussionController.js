const { getTodaysDiscussions } = require('../services')

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

module.exports = controller
