const cron = require('node-cron')
const moment = require('moment')
const logger = require('../logger')
const { digestDiscussionPost, authTvDb, updateTvDbIds, getSeriesPoster, createDiscussionResult } = require('../services')
const { Asset, Show, EpisodeResultLink, EpisodeDiscussion, Week, Op } = require('../models')
const fetchDiscussions = require('../fetch/fetchDiscussions')
const fetchAssets = require('../fetch/fetchAssets')
// const { Show } = require('../models')

async function updatePosters() {
  const assets = await Asset.findAll({
    where: {
      poster_art: null,
    },
    include: [Show],
  })
  for (const asset of assets) {
    const art = await getSeriesPoster(asset.Show.tvdb_id)
    asset.poster_art = art
    asset.save()
  }
}

async function generateDiscussionResults() {
  const links = await EpisodeResultLink.findAll(
    {
      where: {
        episodeDiscussionResultId: {
          [Op.eq]: null,
        },
      },
      include: [EpisodeDiscussion, Show, Week],
    },
  )
  for (const link of links) {
    const createDt = moment(link.EpisodeDiscussion.post_created_dt, 'YYYY-MM-DD HH:mm:ss')
    const dt48hoursAgo = moment().subtract(48, 'hours')

    if (createDt.isSameOrBefore(dt48hoursAgo)) {
      logger.info(`Creating discussion result for: ${link.EpisodeDiscussion.post_title}`)
      await createDiscussionResult(link)
    }
  }
}
async function getDiscussionsAndPopulate() {
  try {
    const discussions = await fetchDiscussions.fetch()
    for (const discussion of discussions) {
      await digestDiscussionPost(discussion)
    }
    await updateTvDbIds()
    await updatePosters()
    await fetchAssets.fetch()
    await generateDiscussionResults()
  } catch (err) {
    logger.error(err)
  }
}

// Every Hour | Get Episode Discussions and populate data
cron.schedule('0 0 * * * *', async () => {
  getDiscussionsAndPopulate()
})

// Every 6 Hours | Re-auth with TvDb
cron.schedule('0 0 */6 * * *', async () => {
  try {
    await authTvDb()
  } catch (err) {
    logger.error(err)
  }
})

async function init() {
  try {
    logger.info('beginning test')
    await authTvDb()
    await getDiscussionsAndPopulate()
    logger.info('-- test finished')
  } catch(err) {
    logger.error(err)
  }
}
init()
