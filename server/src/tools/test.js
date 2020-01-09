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
  console.log(url)
  return url ? url[0] : null
}

function parseAnilistId(post) {
  const anilistUrl = getAnilistUrl(post.selftext)
  console.log(anilistUrl)
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
      const resp = await aniClient.search('anime', show.title, 1, 5)
      console.log(resp)
      // show.anilist_id = id
      // show.save()
      index += 1
    }
  } catch (err) {
    console.log(err)
  }
}
fixMyHeroAcademia()

  // const s3params = {
  //   Bucket: 'animetrics',
  //   MaxKeys: 100,
  //   Prefix: 'resources/rwc',
  // };
  // s3.listObjectsV2 (s3params, (err, data) => {
  //   for (const d of data.Contents) {
  //     let { Key } = d
  //     Key = Key.replace('.png', '')
  //     const name = Key.split('/')[Key.split('/').length - 1]
  //     if (name) {
  //       const split = name.split('_')
  //       if (split[0] === 'week') {
  //         console.log(`Week ${split[1]} ${split[2].toUpperCase()} ${split[3]} - https://cdn.animetrics.co/${Key}`)
  //       } else {
  //         console.log(`Season Overview ${split[2].toUpperCase()} ${split[3]} - https://cdn.animetrics.co/${Key}`)
  //       }
  //     }
  //   }
  // })