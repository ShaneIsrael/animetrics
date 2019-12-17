/* eslint-disable linebreak-style */
const logger = require('../logger')
const {
  EpisodeResultLink, EpisodeDiscussionResult, RedditPollResult,
} = require('../models')

async function init() {
  try {
    const epResult = []
    const epResultIds = []
    const pollResult = []
    const pollResultIds = []
    const edrs = await EpisodeDiscussionResult.findAll({ attributes: ['id', 'episodeDiscussionId'] })
    const rprs = await RedditPollResult.findAll({ attributes: ['id', 'episodeDiscussionId'] })
    for (const result of edrs) {
      const dupeIndex = epResultIds.indexOf(result.episodeDiscussionId)
      if (dupeIndex === -1) {
        epResult.push(result)
        epResultIds.push(result.episodeDiscussionId)
      } else {
        logger.info(`deleting EpisodeDiscussionResult with id:  ${result.id}`)
        await EpisodeDiscussionResult.destroy({
          where: {
            id: result.id,
          },
        })
        await EpisodeResultLink.destroy({
          where: {
            episodeDiscussionResultId: result.id,
          },
        })
      }
    }
    for (const result of rprs) {
      const dupeIndex = pollResultIds.indexOf(result.episodeDiscussionId)
      if (dupeIndex === -1) {
        pollResult.push(result)
        pollResultIds.push(result.episodeDiscussionId)
      } else {
        logger.info(`deleting RedditPollResult with id: ${result.id}`)
        await RedditPollResult.destroy({
          where: {
            id: result.id,
          },
        })
      }
    }
  } catch (err) {
    logger.error(err)
  }
}
init()
