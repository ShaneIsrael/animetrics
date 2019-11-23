const cron = require('node-cron')
const moment = require('moment')
const logger = require('../logger')
const {
  digestDiscussionPost, authTvDb, refreshTvDb, updateTvDbIds, getSeriesPoster, createDiscussionResult,
} = require('../services')
const {
  Asset, Show, EpisodeResultLink, EpisodeDiscussion, Week, Op,
} = require('../models')
const fetchDiscussions = require('../fetch/fetchDiscussions')
const fetchAssets = require('../fetch/fetchAssets')
const fetchUsers = require('../fetch/fetchRedditMalUsers')
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
  const discussions = await fetchDiscussions.fetch()
  for (const discussion of discussions) {
    await digestDiscussionPost(discussion)
  }
  await updateTvDbIds()
  await updatePosters()
  await fetchAssets.fetch()
  await generateDiscussionResults()
}
async function backPopulate(days) {
  const discussions = await fetchDiscussions.recursiveFetch(days)
  const toDo = discussions.length
  let at = 0
  for (const discussion of discussions) {
    console.log(`back populating: ${at}/${toDo}`)
    await digestDiscussionPost(discussion)
    at += 1
  }
  await updateTvDbIds()
  await updatePosters()
  await fetchAssets.fetch()
  await generateDiscussionResults()
}

// Every Hour | Get Episode Discussions and populate data
cron.schedule('0 0 * * * *', async () => {
  try {
    getDiscussionsAndPopulate()
  } catch (err) {
    logger.error(err.message)
  }
})

// Every Monday at 12:00am update users scores
cron.schedule('0 0 0 * * 1', async () => {
  try {
    await fetchUsers.fetch()
    fetchUsers.fetchScores()
  } catch (err) {
    logger.error(err.message)
  }
})

// Every 6 Hours | Refresh with TvDb
cron.schedule('0 0 */6 * * *', async () => {
  try {
    await refreshTvDb()
  } catch (err) {
    logger.error(err)
  }
})

async function init() {
  try {
    logger.info('beginning cron jobs')
    await authTvDb()
    logger.info('tvdb auth successful')
  } catch (err) {
    logger.error(err.message)
  }
}
init()
