const WeekService = require('./WeekService')
const ResultsService = require('./ResultsService')
const DetailsService = require('./DetailsService')
const DigestService = require('./DigestService')
const MALService = require('./MALService')
const AssetService = require('./AssetService')
const TvDbService = require('./TvDbService')

module.exports = {
  ...WeekService,
  ...ResultsService,
  ...DetailsService,
  ...DigestService,
  ...MALService,
  ...AssetService,
  ...TvDbService,
}
