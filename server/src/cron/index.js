const cron = require('node-cron')
const moment = require('moment')
const Anilist = require('anilist-node')
const logger = require('../logger')
const { environment } = require('../config')
const {
  digestDiscussionPost, authTvDb, refreshTvDb, updateTvDbIds, getSeriesPoster, createDiscussionResult, updateRedditAnimeListScore,
} = require('../services')
const {
  Asset, Show, EpisodeResultLink, EpisodeDiscussion, EpisodeDiscussionResult, Week, Op,
} = require('../models')
const fetchDiscussions = require('../fetch/fetchDiscussions')
const fetchAssets = require('../fetch/fetchAssets')
const fetchUsers = require('../fetch/fetchRedditMalUsers')
const pollFixer = require('../tools/pollFixer')

const anilistClient = new Anilist()

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds))

async function updatePosters() {
  logger.info('updating posters')
  const assets = await Asset.findAll({
    where: {
      poster_art: null,
    },
    include: [Show],
  })
  for (const asset of assets) {
    try {
      let art
      if (!art && asset.Show.anilist_id) {
        const resp = await anilistClient.media.anime(asset.Show.anilist_id)
        art = resp.coverImage.large ? resp.coverImage.large : resp.coverImage.medium
      }
      //if (!art && asset.Show.tvdb_id && asset.Show.tvdb_id !== -1) {
      //  art = await getSeriesPoster(asset.Show.tvdb_id)
      //}
      if (art) {
        asset.poster_art = art
        asset.save()
      } else {
        logger.error(`temp error - No Asset Art Found - ShowId=${asset.Show.id} AssetId=${asset.id} ShowTitle=${asset.Show.title}`)
      }
    } catch (err) {
      logger.error(err)
    }
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
       //logger.error(`failed for ${link.EpisodeDiscussion.post_title} json=${JSON.stringify(link)}`) 
       logger.error(err)
      
      }
    }
  }
}
async function getDiscussionsAndPopulate() {
  //const psDiscussions = [] //await fetchDiscussions.fetch()
 // const rApiDiscussions = await fetchDiscussions.fetchReddit()
  const discussions = await fetchDiscussions.fetchReddit()//psDiscussions.concat(rApiDiscussions)
  if (discussions) {
    for (const discussion of discussions) {
      const createdDt = moment.utc(discussion.created_utc)
      const dt10MinsAgo = moment.utc().subtract(10, 'minutes')
      // don't process if the discussion isn't at least 15 minutes old. This is to help prevent getting
      // discussions made by non-mods that get deleted.
      if (createdDt.isSameOrBefore(dt10MinsAgo)) {
        try {
          logger.info(`digesting ${discussion.title}`)
          const {result, reason} = await digestDiscussionPost(discussion)
	  if (!result) {
	    logger.info(`Failed to digest ${discussion.title}, ${reason}`)
	  } else {
	    logger.info(`Successfully digested ${discussion.title}`)
	  }
          // give db time to close so we don't get duplicate results
          await sleep(1000)
        } catch (err) {
          logger.error(err)
        }
      } else {
        logger.info(`skipping ${discussion.title}`)
      }
    }
  }
}

async function updateRalScores() {
  const results = await EpisodeDiscussionResult.findAll({ where: { ralScore: null } })
  if (results) {
    for (const result of results) {
      try {
        await updateRedditAnimeListScore(result)
      } catch (err) {
        logger.error(err)
      }
    }
  }
}


async function init() {
  try {
    if (environment === 'prod') {
      logger.info('starting cron jobs...')
      // Every 15 minutes | Get Episode Discussions and populate data
      cron.schedule('0 */10 * * * *', async () => {
        logger.info('--- Starting Discussion Populate Job ---')
        await generateDiscussionResults()
        await getDiscussionsAndPopulate()
       // await updateTvDbIds()
        await updatePosters()
        await fetchAssets.fetch()
        await pollFixer.init()
	logger.info('--- Finished Discussion Populate and Asset Update jobs ---')
      })
      // Every Hour | Check for unset ral scores and update them
      cron.schedule('0 0 * * * *', async () => {
        logger.info('--- Starting RAL Score Updater Job ---')
        try {
          updateRalScores()
        } catch (err) {
          logger.error(err)
        }
      })

      // Every Monday at 12:00am update users scores
      cron.schedule('0 0 0 * * 1', async () => {
        logger.info('--- Starting RAL Users Fetch & Update Job ---')
        try {
          await fetchUsers.fetch()
          fetchUsers.fetchScores()
        } catch (err) {
          logger.error(err)
        }
      })

      // Every 6 Hours | Refresh with TvDb
      //cron.schedule('0 0 */6 * * *', async () => {
      //  logger.info('--- Starting Refresh TVDB Auth Token Job ---')
      //  try {
      //    await refreshTvDb()
      //  } catch (err) {
      //    logger.error(err)
      //  }
      //})
    } else {
      logger.info('Running in dev mode, cron jobs halted.')
    }
  } catch (err) {
    console.log(err)
    logger.error(err)
  }
}
init()
