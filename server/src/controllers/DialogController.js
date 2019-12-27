/* eslint-disable no-restricted-globals */
const moment = require('moment')
const { submitFeedback, submitIssue } = require('../services')
const { Dialog, Op } = require('../models')
const logger = require('../logger')
const controller = {}

/**
 * Submit user feedback
 */
controller.submitFeedback = async (req, res, next) => {
  try {
    const { feedback } = req.body
    if (typeof feedback !== 'string') return res.status(400).send('feedback must be a string')
    if (feedback.length > 1000) {
      return res.status(400).send('feedback is over the max allowed length')
    }
    const submittedTooEarly = await Dialog.findOne({
      where: {
        ip: req.ip,
        type: 'feedback',
        createdAt: {
          [Op.gte]: moment.utc().subtract(1, 'hour').format(),
        },
      },
    })
    if (submittedTooEarly) {
      return res.status(429).send('You have reached the maximum number of requests you can submit. Please try again later.')
    }
    await submitFeedback(feedback, req.ip)
    return res.status(200).send()
  } catch (err) {
    return next(err)
  }
}

/**
 * Submit user reported issue
 */
controller.submitIssue = async (req, res, next) => {
  try {
    const { type, description } = req.body
    const validOptions = ['Missing Art', 'Missing Series / Episode', 'Incorrect Art', 'Incorrect Series Information', 'Other']
    if (typeof type !== 'string') return res.status(400).send('type must be a string')
    if (typeof description !== 'string') return res.status(400).send('description must be a string')
    if (validOptions.indexOf(type) === -1) return res.status(400).send(`type must be one of ${validOptions}`)
    
    if (description.length > 1000) {
      return res.status(400).send('description is over the max allowed length')
    }
    const submittedTooEarly = await Dialog.findOne({
      where: {
        ip: req.ip,
        type: 'issue',
        createdAt: {
          [Op.gte]: moment.utc().subtract(1, 'hour').format(),
        },
      },
    })
    if (submittedTooEarly) {
      return res.status(429).send('You have reached the maximum number of requests you can submit. Please try again later.')
    }
    await submitIssue(type, description, req.ip)
    return res.status(200).send()
  } catch (err) {
    return next(err)
  }
}
module.exports = controller
