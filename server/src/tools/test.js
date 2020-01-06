const service = {}
const moment = require('moment')
const { findAnime, rawTvDbSearch, authTvDb } = require('../services')
const fetchDiscussions = require('../fetch/fetchDiscussions')
const fetchAssets = require('../fetch/fetchAssets')
const cpoll = require('../tools/calculatePoll')
const logger = require('../logger')
const { Show, Asset, MALSnapshot, RedditPollResult, Week, Season, EpisodeResultLink, EpisodeDiscussion, EpisodeDiscussionResult, RedditUserScore, Op} = require('../models')

const Anilist = require('anilist-node')
const aniClient = new Anilist()

//create animetrics anilist app 

function getAnilistUrl(text) {
  const url = text.match(/https?:\/\/(www\.)?(\w*anilist\w*)\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]anime\/[0-9]*)/gm)
  return url ? url[0] : null
}

function parseAnilistId(post) {
  const anilistUrl = getAnilistUrl(post.selftext)
  if (anilistUrl) {
    const anilistId = anilistUrl.match(/([0-9]\d+)/g)
    return anilistId ? anilistId[0] : null
  }
  return null
}

async function fixMyHeroAcademia() {
  try {
    const shows = await Show.findAll({
      where: {
        anilist_id: null
      },
      include: [EpisodeDiscussion],
    })
    let index = 1
    for (const show of shows) {
      console.log(`updating ${index}/${shows.length}`)
      if (show.EpisodeDiscussions.length > 0) {
        const post = await fetchDiscussions.getSubmission(show.EpisodeDiscussions[0].post_id)
        if (post) {
          const id = parseAnilistId(post)
          if (!id) {
            console.log(`could not find an id for show: ${show.title}`)
          } else {
            show.anilist_id = id
            show.save()
          }
        }
      }
      index += 1
    }
  } catch (err) {
    console.log(err)
  }
}
fixMyHeroAcademia()