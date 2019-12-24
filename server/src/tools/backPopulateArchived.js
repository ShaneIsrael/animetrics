const moment = require('moment')
const cheerio = require('cheerio')
const axios = require('axios')
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
  await fetchAssets.fetch()
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
        throw err
      }
    }
  }
}

async function digestArchivedDiscussions(year) {
  const archived = (await axios.get(`https://www.reddit.com/r/anime/wiki/discussion_archive/${year}`, {
  })).data;
  const $ = cheerio.load(archived)
  const postIds = []
  $('td a').each(async (index, elem) => {
    const split = $(elem).attr('href').split('comments/')

    if (split[1]) {
      let postId
      if (split[1].indexOf('/' >= 0)) {
        postId = split[1].split('/')[0]
      } else {
        postId = split[1]
      }
      postIds.push(postId)
    }
  })
  const toDo = postIds.length
  let at = 0
  for (const id of postIds) {
    logger.info(`back populating archived posts: ${at}/${toDo}`)
    const exists = await EpisodeDiscussion.findOne({
      where: {
        post_id: id
      }
    })
    if (!exists) {
      const post = await fetchDiscussions.getSubmission(id)
      if (post) {
        await digestDiscussionPost(post, true)
      } else {
        logger.info(`Could not find post with id: ${id}`)
      }
    } else {
      logger.info('already tracked, skipping.')
    }
    at += 1
  }
  await updateTvDbIds()
  await updatePosters()
  await generateDiscussionResults()
}

async function init() {
  try {
    const args = process.argv.slice(2)
    logger.info(`back populating ${args[0]}`)
    await authTvDb()
    await digestArchivedDiscussions(args[0])
  } catch (err) {
    logger.error(err.message)
  }
}
init()
