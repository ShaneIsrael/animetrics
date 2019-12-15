const WeekController = require('./WeekController')
const ResultsController = require('./ResultsController')
const DetailsController = require('./DetailsController')
const TokenController = require('./TokenController')
const OverridesController = require('./OverridesController')
const ShowController = require('./ShowController')
const AssetController = require('./AssetController')
const DiscussionController = require('./DiscussionController')

module.exports = {
  ...WeekController,
  ...ResultsController,
  ...DetailsController,
  ...TokenController,
  ...OverridesController,
  ...ShowController,
  ...AssetController,
  ...DiscussionController,
}
