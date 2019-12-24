const moment = require('moment')
const utils = {}

utils.getAnimeSeason = (date) => {
  const utc = moment.utc(date)
  
  switch (utc.month()) {
    case 0:
      return 'winter'
    case 1:
      return 'winter'
    case 2:
      return 'winter'
    case 3:
      return 'spring'
    case 4:
      return 'spring'
    case 5:
      return 'spring'
    case 6:
      return 'summer'
    case 7:
      return 'summer'
    case 8:
      return 'summer'
    default:
      return 'fall'
  }
}

module.exports = utils