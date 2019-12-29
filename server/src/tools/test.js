const service = {}
const moment = require('moment')
const { findAnime } = require('../services')
const fetchDiscussions = require('../fetch/fetchDiscussions')

const { Show, Week, Season, EpisodeResultLink, EpisodeDiscussion, EpisodeDiscussionResult, Op} = require('../models')

async function init() {
  // remove duplicate discussions and resulting links/results

  //get all shows and discussions
  //loop over each shows discussion,
    // if multiple of same episode,
    // look up each discussion via reddit api
    // if deleted, wipe from db

    const shows = await Show.findAll({
      include: [{model: EpisodeDiscussion}]
    })


    for(const show of shows) {
      let map = {}
      for(const d of show.EpisodeDiscussions) {
        if (map[d.season]) {
          if (map[d.season].episodes.map((e) => e.episode).indexOf(d.episode) === -1) {
            map[d.season].episodes.push({ episode: d.episode, url: d.post_id})
          } else {
            console.log(`Found duplicate for: ${d.post_title} ${d.post_id} ${d.season}`)
            const dupes = map[d.season].episodes.filter((e) => e.episode === d.episode).map((e) => e.url)
            console.log(`\t\t${dupes}`)
            let temp = await fetchDiscussions.getSubmission(d.post_id)
            if (temp.selftext === '[removed]') {
              const dis = await EpisodeDiscussion.findOne({
                where: {
                  post_id: d.post_id
                }
              })
              const erl = await EpisodeResultLink.findOne({
                where: {
                  episodeDiscussionId: dis.id
                },
                include: [EpisodeDiscussionResult]
              })
              if (erl) {
                console.log('removed duplicate')
                erl.EpisodeDiscussionResult.destroy()
                erl.destroy()
              }
              dis.destroy()
            } else {
              if (d.post_title.indexOf('(Preair)') >= 0) {
                d.destroy()
              }
              if (d.post_title.indexOf('Uchuu Senkan Tiramisù II') >= 0) {
                d.season = 2
                d.save()
              }
              if (d.post_title.indexOf('1st Season') >= 0) {
                d.season = 1
                d.save()
              }
              if (d.post_title.indexOf('2nd Season') >= 0) {
                d.season = 2
                d.save()
              }
              if (d.post_title.indexOf('3rd Season') >= 0) {
                d.season = 3
                d.save()
              }
              if (d.post_title.indexOf('4th Season') >= 0) {
                d.season = 4
                d.save()
              }
              if (d.post_title.indexOf('5th Season') >= 0) {
                d.season = 5
                d.save()
              }
            }


            for (const dupe of dupes) {
              let temp2 = await fetchDiscussions.getSubmission(dupe)
              const dis = await EpisodeDiscussion.findOne({
                where: {
                  post_id: dupe
                }
              })
              if (temp2.selftext === '[removed]') {
                const erl = await EpisodeResultLink.findOne({
                  where: {
                    episodeDiscussionId: dis.id
                  },
                  include: [EpisodeDiscussionResult]
                })
                if (erl) {
                  console.log('removed duplicate')
                  erl.EpisodeDiscussionResult.destroy()
                  erl.destroy()
                }
                dis.destroy()
              } else {
                if (d.post_title.indexOf('(Preair)') >= 0) {
                  d.destroy()
                }
                if (dis.post_title.indexOf('Uchuu Senkan Tiramisù II') >= 0) {
                  dis.season = 2
                  dis.save()
                }
                if (dis.post_title.indexOf('1st Season') >= 0) {
                  dis.season = 1
                  dis.save()
                }
                if (dis.post_title.indexOf('2nd Season') >= 0) {
                  dis.season = 2
                  dis.save()
                }
                if (d.post_title.indexOf('3rd Season') >= 0) {
                  dis.season = 3
                  dis.save()
                }
                if (d.post_title.indexOf('4th Season') >= 0) {
                  dis.season = 4
                  dis.save()
                }
                if (d.post_title.indexOf('5th Season') >= 0) {
                  dis.season = 5
                  dis.save()
                }
              }
            }
            // console.log(`\t\t${dupes}`)
          }
        } else {
          map[d.season] = {
            episodes: [{ episode: d.episode, url: d.post_id}]
          }
        }
      }
    }


    // EpisodeResult should link to a season for easier data grabbing
    // find all EpisodeResult where seasonId = # AND showId = #, include EpisodeDiscussion


}
init()