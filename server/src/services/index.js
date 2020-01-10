const WeekService = require('./WeekService')
const ResultsService = require('./ResultsService')
const DetailsService = require('./DetailsService')
const DigestService = require('./DigestService')
const MALService = require('./MALService')
const AssetService = require('./AssetService')
const TvDbService = require('./TvDbService')
const TokenService = require('./TokenService')
const OverridesService = require('./OverridesService')
const ShowService = require('./ShowService')
const DiscussionService = require('./DiscussionService')
const SeasonService = require('./SeasonService')
const DialogService = require('./DialogService')
const TopTenService = require('./TopTenService')
const TwilioService = require('./TwilioService')
const ResourceService = require('./ResourceService')

module.exports = {
  ...WeekService,
  ...ResultsService,
  ...DetailsService,
  ...DigestService,
  ...MALService,
  ...AssetService,
  ...TvDbService,
  ...TokenService,
  ...OverridesService,
  ...ShowService,
  ...DiscussionService,
  ...SeasonService,
  ...DialogService,
  ...TopTenService,
  ...TwilioService,
  ...ResourceService,
}
