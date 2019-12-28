
const { Dialog } = require('../models')

const service = {}

service.submitFeedback = async (feedback, ip) => {
  await Dialog.create({
    type: 'feedback',
    body: feedback,
    ip,
  })
}

service.submitIssue = async (type, description, ip) => {
  await Dialog.create({
    type: 'issue',
    alt_type: type,
    body: description,
    ip,
  })
}

module.exports = service
