const Snoowrap = require('snoowrap')
const config = require('../config/config').dev.reddit

const r = new Snoowrap({
  userAgent: 'search anime subreddit discussion posts',
  clientId: config.CLIENT_ID,
  clientSecret: config.CLIENT_SECRET,
  refreshToken: config.REFRESH_TOKEN,
})

module.exports = {
  async fetch() {
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
    const post = await r.getSubmission(id).fetch();
    return post;
  },
}
