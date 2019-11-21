const WeekController = require('./WeekController')
const ResultsController = require('./ResultsController')
const DetailsController = require('./DetailsController')

module.exports = {
  ...WeekController,
  ...ResultsController,
  ...DetailsController,
}
