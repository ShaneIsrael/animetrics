const _ = require('lodash')
const { Show, RedditUserScore } = require('../models')

module.exports = {
  /**
   * Calculates the rating based on the poll. Returns null if there are less than 50 votes
   * @param {Object} poll youpoll result
   * @returns {Array} Result the result containing the calculated rating, the total votes, and poll type.
   */
  calculateRating(poll) {
    if (!poll) return [0, 0, 'no-result']
    let total = 0
    const keys = Object.keys(poll)

    if (_.difference(keys, ['Excellent', 'Great', 'Good', 'Bad', 'Mediocre']).length === 0) {
      let weighted = 0
      for (const key of keys) {
        const value = poll[key]
        total += Number(value)
        switch (key) {
        case 'Excellent':
          weighted += value * 1
          break
        case 'Great':
          weighted += value * 0.8
          break
        case 'Good':
          weighted += value * 0.7
          break
        case 'Mediocre':
          weighted += value * 0.5
          break
        case 'Bad':
          weighted += value * 0.2
          break
        default:
          weighted += 0
          total -= value
        }
      }
      return [((weighted / total) * 10).toFixed(2), total, 'weighted']
    }
    if (_.difference(keys, ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']).length === 0) {
      let weighted = 0
      for (const key of keys) {
        const value = poll[key]
        total += Number(value)
        weighted += value * (value/10)
      }
      return [((weighted / total) * 10).toFixed(2), total, 'weighted']
    }
    if (_.difference(keys, ['Dislike', 'Like']).length === 0) {
      for (const key of keys) {
        const value = poll[key]
        total += Number(value)
      }
      return [((poll.Like / total) * 10).toFixed(2), total, 'simple']
    }
    return null
  },
  /**
   * Calculates a MAL rating using only MAL Scores done by Reddit Users. Must have at least 10 Reddit User scores.
   * @param {number} showId the id of the show to calculate the rating for.
   * @returns {Array} result containing the calculated rating and total votes
   */
  async calculateRedditMalRating(showId) {
    const show = await Show.findByPk(showId)
    const ratings = await RedditUserScore.findAll({
      attributes: ['score'],
      where: {
        mal_show_id: show.mal_id,
      },
      raw: true,
    })
    let rating = 0
    for (const r of ratings) {
      rating += (r.score / 10)
    }
    if (ratings.length >= 10) return [((rating / ratings.length) * 10).toFixed(2), ratings.length]
    return [0, 0]
  },
}
