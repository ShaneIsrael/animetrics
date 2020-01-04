const service = {}
const moment = require('moment')
const { findAnime } = require('../services')
const fetchDiscussions = require('../fetch/fetchDiscussions')
const cpoll = require('../tools/calculatePoll')
const logger = require('../logger')
const { Show, Asset, MALSnapshot, RedditPollResult, Week, Season, EpisodeResultLink, EpisodeDiscussion, EpisodeDiscussionResult, RedditUserScore, Op} = require('../models')


// function getMyAnimeListUrl(text) {
//   const url = text.match(/https?:\/\/(www\.)?(\w*myanimelist\w*)\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]anime\/[0-9]*)/gm)
//   return url ? url[0] : null
// }
 
// function parseMalId(post) {
//   const myAnimeListUrl = getMyAnimeListUrl(post.selftext)
//   if (myAnimeListUrl) {
//     const malId = myAnimeListUrl.match(/([0-9]\d+)/g)
//     return malId ? malId[0] : null
//   }
//   return null
// }
// const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds))
// async function top5OfTheYear() {
//   const showUpdateMap = {}
//   const newShowsToCreate = {}
//   const parsedDiscussions = []

//   // let allDiscussions = await EpisodeDiscussion.findAll({
//   //   include: [Show]
//   // })

//   // console.log(`looping ${allDiscussions.length} discussions`)
//   // let workIndex = 1
//   // const updatedShowIds = []
//   // for (const discussion of allDiscussions) {
//   //   if (updatedShowIds.indexOf(discussion.Show.id) === -1 && discussion.Show.season === null) {
//   //     console.log(`working  ${workIndex}/${allDiscussions.length}`)
//   //     await sleep(500)
//   //     const rd = await fetchDiscussions.getSubmission(discussion.post_id)
//   //     const malId = parseMalId(rd)
//   //     discussion.Show.season = discussion.season
//   //     discussion.Show.mal_id = malId
//   //     await discussion.Show.save()
//   //     updatedShowIds.push(discussion.Show.id)
//   //   }
//   //   workIndex++
//   // }

//   let allDiscussions = await EpisodeDiscussion.findAll({
//     include: [Show]
//   })
//   for (const discussion of allDiscussions) {
//     const showDiscussionTag = `${discussion.Show.id}-${discussion.season}`
//     if (parsedDiscussions.indexOf(showDiscussionTag) === -1 && discussion.Show.season !== discussion.season) {
//       const rd = await fetchDiscussions.getSubmission(discussion.post_id)
//       let malId = parseMalId(rd)
      
//       if (!malId) {
//         console.log(`Skipped: ${discussion.Show.title}`)
//         continue
//       }
//       const malDetails = await findAnime(malId)
//       const originalShowId = discussion.Show.id
//       const season = discussion.season
//       // create new Show and update
//       if (Object.keys(newShowsToCreate).indexOf(malDetails.title) === -1) {
//         console.log(`creating new show, post_id=${discussion.post_id} originalShowId=${originalShowId} season=${season} title=${malDetails.title}`)
//         const title = malDetails.title
//         newShowsToCreate[title] = {
//           originalShowId,
//           originalShow: discussion.Show,
//           newShow: {
//             mal_id: malId,
//             title: malDetails.title,
//             alt_title: malDetails.title_synonyms ? malDetails.title_synonyms[0] : null,
//             english_title: malDetails.english_title,
//             season: season
//           }
//         }
//       }
//       parsedDiscussions.push(showDiscussionTag)
//     }
//   }

//   const total = Object.keys(newShowsToCreate).length
//   let index = 1
//   // update all affected ids
//   for (const key of Object.keys(newShowsToCreate)) {
//     try {
//       console.log(`working ${index}/${total}`)
//       const updated = newShowsToCreate[key]
//       const idsToUpdate = [updated.originalShowId]
//       console.log(`destroying ${updated.originalShowId}`)
//       await updated.originalShow.destroy()
//       console.log(`creating...`)
//       const dupes = await Show.findAll({
//         where: {
//           title: updated.newShow.title
//         }
//       })
//       for (const dupe of dupes) {
//         idsToUpdate.push(dupe.id)
//         await dupe.destroy()
//       }
//       const newShow = await Show.create(updated.newShow)
//       console.log('updating Asset...')
//       await Asset.update({showId: newShow.id}, {where: {showId: {[Op.in]: idsToUpdate} }})
//       console.log('updating EpisodeDiscussion...')
//       await EpisodeDiscussion.update({showId: newShow.id}, {where: {showId: {[Op.in]: idsToUpdate} }})
//       console.log('updating EpisodeDiscussionResult...')
//       await EpisodeDiscussionResult.update({showId: newShow.id}, {where: {showId: {[Op.in]: idsToUpdate} }})
//       console.log('updating EpisodeResultLink...')
//       await EpisodeResultLink.update({showId: newShow.id}, {where: {showId: {[Op.in]: idsToUpdate} }})
//       console.log('updating MALSnapshot...')
//       await MALSnapshot.update({showId: newShow.id}, {where: {showId: {[Op.in]: idsToUpdate} }})
//       console.log('updating RedditPollResult...')
//       await RedditPollResult.update({showId: newShow.id}, {where: {showId: {[Op.in]: idsToUpdate} }})
//       // update show details across all shows.
//       index++
//     } catch (err) {
//       console.log(err)
//     }
//   }

//   console.log(Object.keys(newShowsToCreate))
// }
// // top5OfTheYear()

// // async function updateRalScores() {
// //   const results = await EpisodeDiscussionResult.findAll({
// //     where: {
// //       [Op.or]: [
// //         {
// //           ralScore: 0
// //         },
// //         {
// //           ralScore: null
// //         }
// //       ]
// //     }
// //   })
// //   for (const r of results) {
// //     const score = await cpoll.calculateRedditMalRating(r.showId)
// //     r.ralScore = score[0]
// //     r.save()
// //   }
// // }
// // updateRalScores()
// // 
// async function updateShowDetails() {
//   const shows = await Show.findAll()

//   let index = 1
//   for (const show of shows) {
//     try {
//       if (index > 371) {
//         console.log(`working ${index}/${shows.length}`)
//         const malDetails = await findAnime(show.mal_id)
//         if (malDetails) {
//           show.title = malDetails.title
//           alt_title = malDetails.title_synonyms ? malDetails.title_synonyms[0] : null,
//           english_title = malDetails.english_title
//           await show.save()
//         }
//       }
//       index++
//     } catch(err) {
//       console.log(err)
//     }
//   }
// }
// updateShowDetails()

// async function updateMissingPolls() {
//   const results = await Show.findOne({
//     where: {
//       title: {
//         [Op.like]: "%Shingeki no Kyojin Season 3%"
//       }
//     },
//     include: [{model: EpisodeDiscussion, include: [RedditPollResult]}]
//   })

//   const polls = await RedditPollResult.findAll({
//     where: {
//       [Op.or]: [
//         {
//           score: NaN,
//         },
//         {
//           score: null,
//         }
//       ]
//     }
//   })
//   for (const poll of polls) {
//     const score = await cpoll.calculateRating(poll.poll)
//     console.log(poll.poll)
//     if (score) {
//       console.log(score)
//       poll.score = score[0]
//       poll.votes = score[1]
//     } else {
//       console.log(poll.poll)
//     }
//   }
// }
// updateMissingPolls()

async function updateEnglishTitles() {
  const shows = await Show.findAll({
    where: {
      english_title: null
    }
  })
  for(const show of shows) {
    if (show.mal_id) {
      const malDetails = await findAnime(show.mal_id)
      show.english_title = malDetails.title_english
      if (show.english_title) {
        console.log(`udpated: ${show.english_title}`)
        show.save()
      }
    }
  }
}
updateEnglishTitles()