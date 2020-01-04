const { getResultsByWeek, getRedditPollResultsByWeek, getResultsByOrderAndWeek } = require('../services')

const controller = {}

/**
 * Gets all results for a given week
 */
controller.getResultsByWeek = async (req, res, next) => {
  try {
    const results = await getResultsByWeek(req.query.id)
    res.status(200).send(results)
  } catch (err) {
    next(err)
  }
}

controller.getRedditPollResultsByWeek = async (req, res, next) => {
  try {
    const results = await getRedditPollResultsByWeek(req.query.id)
    res.status(200).send(results)
  } catch (err) {
    next(err)
  }
}

/**
 * Get results by order and week
 */
controller.getResultsByOrderAndWeek = async (req, res, next) => {
  const { order, week } = req.params
  if (typeof order !== 'string') return res.status(400).send('order must be a string')
  if (typeof week !== 'string') return res.status(400).send('week must be a string')
  if (['poll', 'karma'].indexOf(order) === -1) return res.status(400).send('order must be one of [poll, karma]')
  
  try {
    const results = await getResultsByOrderAndWeek(order, week)
    res.status(200).send(results)
  } catch (err) {
    next(err)
  }
}



module.exports = controller
