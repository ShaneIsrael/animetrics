const { getTodaysDiscussions, getRecentDiscussions, getDiscussionsByPage, submitDiscussion } = require('../services')

const controller = {}


controller.submitDiscussion = async (req, res, next) => {
  try {
    const { id } = req.body
    if (!id) return res.status(400).send('id must be supplied')
    const response = await submitDiscussion(id)
    res.status(200).send(response)
  } catch (err) {
    next(err)
  }
}

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
    const { page, query } = req.query
    let { size } = req.query
    if (isNaN(page)) throw new Error('page must be a number')
    if (isNaN(size)) throw new Error('size must be a number')
    if (typeof query !== 'string') throw new Error('query must be a string')
    if (size > 25) size = 25
    
    const discussions = await getDiscussionsByPage(page, size, query)
    res.status(200).send(discussions)
  } catch (err) {
    next(err)
  }
}

module.exports = controller
