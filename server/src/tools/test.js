const service = {}
const moment = require('moment')

const fetchDiscussions = require('../fetch/fetchDiscussions')

async function init() {
  const discussions = await fetchDiscussions.fetch()
  if (discussions) {
    for (const discussion of discussions) {
      const createdDt = moment.utc(discussion.created_utc)
      const dt15MinsAgo = moment.utc().subtract(15, 'minutes')
      // don't process if the discussion isn't at least 15 minutes old. This is to help prevent getting
      // discussions made by non-mods that get deleted.
      if (createdDt.isSameOrBefore(dt15MinsAgo)) {
        // await digestDiscussionPost(discussion)
        console.log(discussion.title)
      }
    }
  }
}
init()