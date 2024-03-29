const logger = require('../logger')
const {
 scrapePollData,
} = require('../services')

const calculatePoll = require('./calculatePoll')
const fetchDiscussions = require('../fetch/fetchDiscussions')
const {
 EpisodeDiscussion, RedditPollResult, Op,
} = require('../models')

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds))

module.exports = {
  async init() {
    try {
      const polls = await RedditPollResult.findAll({
        where: {
          [Op.or]: [
            {
              poll: null
            },
            {
              poll: {
                [Op.substring]: '{}'
              }
            }
          ]
        },
        include: [EpisodeDiscussion],
      })
      for (const poll of polls) {
        try {
          logger.info(`Attempting to fix poll with id: ${poll.id}`)
          // rate limit prevention
          await sleep(200)
          let post_poll_url = poll.EpisodeDiscussion.post_pull_url
          if (!post_poll_url) {
            logger.info(`no pull url, attempting to retrieve...`)
            const post = await fetchDiscussions.getSubmission(poll.EpisodeDiscussion.post_id)
            let pollUrl
            if (post.selftext === '[removed]' || post.selftext.indexOf('youpoll.me') === -1) {
              logger.info(`could not retrieve poll url, setting default values...`)
              // give it a default value so that future fixes don't pick this poll up
              poll.poll = {like: 0, dislike: 0}
              poll.score = 0
              poll.votes = 0
              poll.save()
              continue
            }
            if (post.selftext && post.selftext.indexOf('Rate this episode here.') >= 0) {
              pollUrl = post.selftext
                .split('[Rate this episode here.](')[1]
                .split(')')[0]
            } else if (post.selftext_html && post.selftext_html.indexOf('>Rate') >= 0) {
              pollUrl = post.selftext_html
              .split('">Rate')[0]
              .split('<h1><a href="')[1]
            }
            // attempt to get it from the table
            if (!pollUrl) {
              logger.info(`Attempt to get poll url from table for discussion ${poll.EpisodeDiscussion.post_id}`)
              if (post.selftext.split(`${poll.EpisodeDiscussion.episode}|`).length > 1) {
                const chunk1 = post.selftext.split(`${poll.EpisodeDiscussion.episode}|`)[1]
                let chunk2, chunk3
                if (chunk1) chunk2 = chunk1.split('[]')[1]
                if (chunk2) chunk3 = chunk2.split(')')[0]
                if (chunk3) {
                  pollUrl = chunk3.replace('(', '').replace('/r', '')
                }
              }
            }
            if (!pollUrl) {
              logger.info(`all attempts to retrieve poll url failed for discussion id: ${poll.EpisodeDiscussion.id}`)
            }
            post_poll_url = pollUrl
            await EpisodeDiscussion.update({
              post_poll_url: pollUrl
            },
            {
              where: {
                post_id: poll.EpisodeDiscussion.post_id
              }
            })
          }
          let pollDetails = null
          if (post_poll_url) {
            if (post_poll_url === 'https://youpoll.me//') {
              // in some cases, discussions are not given a proper poll url so default to 0's
              logger.info(`Invalid poll url ${post_poll_url}... Defaulting to 0 score.`)
              poll.poll = {like: 0, dislike: 0}
              poll.score = 0
              poll.votes = 0
              poll.save()
            } else {
              logger.info('scraping poll data and generating result...')
              pollDetails = await scrapePollData(post_poll_url)
              const pollResult = calculatePoll.calculateRating(pollDetails)
              if (pollResult) {
                poll.poll = pollDetails
                poll.score = pollResult[1] === 0 ? 0 : pollResult[0]
                poll.votes = pollResult[1]
                poll.save()
                logger.info(`Poll details: ${pollDetails}`)
              }
            }
          }
        }
        catch (err) {
          logger.error(err)
        }
      }
    } catch (err) {
      logger.error(err)
    }
  }
}
