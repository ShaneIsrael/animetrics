const logger = require('../logger')
const {
 scrapePollData,
} = require('../services')

const calculatePoll = require('./calculatePoll')
const fetchDiscussions = require('../fetch/fetchDiscussions')
const {
 EpisodeDiscussion, RedditPollResult, Op,
} = require('../models')


async function init() {
  try {
    const polls = await RedditPollResult.findAll({
      where: {
        score: {
          [Op.gte]: 10
        }
      }
    })
    for (const poll of polls) {
      const pollResult = calculatePoll.calculateRating(poll.poll)
      poll.score = pollResult[1] === 0 ? 0 : pollResult[0]
      poll.save()
    }
    // const polls = await RedditPollResult.findAll({
    //   where: {
    //     [Op.or]: [
    //       {
    //         poll: null
    //       },
    //       {
    //         poll: {
    //           [Op.substring]: '{}'
    //         }
    //       }
    //     ]
    //   },
    //   include: [EpisodeDiscussion],
    // })
    // for (const poll of polls) {
    //   logger.info(`Attempting to fix poll with id: ${poll.id}`)
    //   let post_poll_url = poll.EpisodeDiscussion.post_pull_url
    //   if (!post_poll_url) {
    //     logger.info(`no pull url, attempting to retrieve...`)
    //     const post = await fetchDiscussions.getSubmission(poll.EpisodeDiscussion.post_id)
    //     let pollUrl
    //     if (post.selftext === '[removed]' || post.selftext.indexOf('youpoll.me') === -1) {
    //       logger.info(`could not retrieve poll url, setting default values...`)
    //       // give it a default value so that future fixes don't pick this poll up
    //       poll.poll = {like: 0, dislike: 0}
    //       poll.score = 0
    //       poll.votes = 0
    //       poll.save()
    //       continue
    //     }
    //     if (post.selftext && post.selftext.indexOf('Rate this episode here.') >= 0) {
    //       pollUrl = post.selftext
    //         .split('[Rate this episode here.](')[1]
    //         .split(')')[0]
    //     } else if (post.selftext_html && post.selftext_html.indexOf('>Rate') >= 0) {
    //       pollUrl = post.selftext_html
    //       .split('">Rate')[0]
    //       .split('<h1><a href="')[1]
    //     }
    //     // attempt to get it from the table
    //     if (!pollUrl) {
    //       if (post.selftext.split(`${poll.EpisodeDiscussion.episode}|`).length > 1) {
    //         pollUrl = post.selftext.split(`${poll.EpisodeDiscussion.episode}|`)[1].split('[Poll]')[1].split('/)')[0].replace('(', '')
    //       }
    //     }
    //     if (!pollUrl) {
    //       logger.info(`all attempts to retrieve poll url failed for discussion id: ${poll.EpisodeDiscussion.id}`)
    //     }
    //     post_poll_url = pollUrl
    //     await EpisodeDiscussion.update({
    //       post_poll_url: pollUrl
    //     },
    //     {
    //       where: {
    //         post_id: poll.EpisodeDiscussion.post_id
    //       }
    //     })
    //   }
    //   let pollDetails = null
    //   if (post_poll_url) {
    //     logger.info('scraping poll data and generating result...')
    //     pollDetails = await scrapePollData(post_poll_url)
    //     const pollResult = calculatePoll.calculateRating(pollDetails)
    //     poll.poll = pollDetails
    //     poll.score = pollResult[1] === 0 ? 0 : pollResult[0]
    //     poll.votes = pollResult[1]
    //     poll.save()
    //     logger.info(pollDetails)
    //   }
    // }
  } catch (err) {
    console.log(err)
    logger.error(err.message)
  }
}
init()
