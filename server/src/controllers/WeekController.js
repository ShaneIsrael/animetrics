const { getWeeks } = require('../services')

const controller = {}

/**
 * Gets all recorded weeks
 */
controller.getWeeks = async (req, res, next) => {
  try {
    const weeks = await getWeeks()
    res.status(200).send(weeks)
  } catch (err) {
    next(err)
  }
}

module.exports = controller
