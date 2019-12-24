const Snoowrap = require('snoowrap')
const { environment } = require('../config')
const config = require('../config')[environment].reddit
const PushShift = require('../tools/pushshift-io.js')

const ps = new PushShift('submission')

const r = new Snoowrap({
  userAgent: 'search anime subreddit discussion posts',
  clientId: config.CLIENT_ID,
  clientSecret: config.CLIENT_SECRET,
  refreshToken: config.REFRESH_TOKEN,
})

module.exports = {
  async fetch() {
    const posts = await ps.search('episode%discussion', {
      subreddit: 'anime',
      author: 'AutoLovepon',
      after: '1d',
      size: 500,
      fields: 'id,title,score,num_comments,url,selftext,created_utc,',
    })
    return posts
  },
  async recursiveFetch(days) {
    let total = []
    let left = days
    let after = 0
    let before = 0
    const increment = 10
    let lastIncrement = 0
    if (days < 10) return []
    while (left > 0) {
      if (left >= increment) {
        after += increment
        before += lastIncrement
      } else {
        after += left
        before += lastIncrement
      }
      const posts = await ps.search('episode%discussion', {
        subreddit: 'anime',
        author: 'AutoLovepon',
        after: `${after}d`,
        before: `${before}d`,
        size: 500,
        fields: 'id,title,score,num_comments,url,selftext,created_utc,',
      })
      total = [...total, ...posts]
      lastIncrement = left >= increment ? increment : left
      left -= increment
    }
    return total
  },
  async fetchReddit() {
    const posts = await r
      .getSubreddit('anime')
      .search({
        query: '%episode%discussion',
        limit: 1000,
        time: 'month',
        sort: 'relevance',
      })
    return posts
  },

  async getSubmission(id) {
    try {
      const post = await r.getSubmission(id).fetch();
      return post
    } catch (err) {
      if (err.statusCode === 404) {
        return null
      }
      throw err
    }
  },
}
