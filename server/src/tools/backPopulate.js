const moment = require('moment')
const logger = require('../logger')
const {
  digestDiscussionPost, authTvDb, updateTvDbIds, getSeriesPoster, createDiscussionResult,
} = require('../services')
const {
  Asset, Show, EpisodeResultLink, EpisodeDiscussion, Week, Op,
} = require('../models')
const fetchDiscussions = require('../fetch/fetchDiscussions')
const fetchAssets = require('../fetch/fetchAssets')

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
    const createDt = moment.utc(link.EpisodeDiscussion.post_created_dt, 'YYYY-MM-DD HH:mm:ss')
    const dt48hoursAgo = moment.utc().subtract(48, 'hours')

    if (createDt.isSameOrBefore(dt48hoursAgo)) {
      logger.info(`Creating discussion result for: ${link.EpisodeDiscussion.post_title}`)
      try {
        await createDiscussionResult(link)
      } catch (err) {
        logger.error(err)
      }
    }
  }
}
async function backPopulate(days) {
  const discussions = await fetchDiscussions.recursiveFetch(days)
  const toDo = discussions.length
  let at = 0
  for (const discussion of discussions) {
    logger.info(`back populating: ${at}/${toDo}`)
    await digestDiscussionPost(discussion)
    at += 1
  }
  await updateTvDbIds()
  await updatePosters()
  await fetchAssets.fetch()
  await generateDiscussionResults()
}

async function init() {
  try {
    const args = process.argv.slice(2)
    logger.info(`back populating ${args[0]} days`)
    await authTvDb()
    await backPopulate(args[0])
  } catch (err) {
    logger.error(err)
  }
}
init()
