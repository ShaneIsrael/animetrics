const { getYearlyTopTenAnimeByKarma, getYearlyTopTenAnimeByRedditScore, getYearlyTopTenAnimeByRedditAnimeListScore } = require('../services')

const controller = {}

/**
 * Gets the top 10 anime in a year
 */
controller.getYearlyTopTen = async (req, res, next) => {
  const { year, scoreType} = req.query
  try {
    if (isNaN(year)) return res.status(400).send('year must be a number')
    if (typeof scoreType !== 'string') return res.status(400).send('scoreType must be a string')
    if (['karma', 'poll', 'ral'].indexOf(scoreType) === -1) return res.status(400).send('Invalid score type given')
    if ([2018, 2019, 2020].indexOf(Number(year)) === -1) return res.status(400).send('Invalid year given')

    if (scoreType === 'karma') {
      const results = await getYearlyTopTenAnimeByKarma(year)
      return res.status(200).send(results)
    }
    if (scoreType === 'poll') {
      const results = await getYearlyTopTenAnimeByRedditScore(year)
      return res.status(200).send(results)
    }
    if (scoreType === 'ral') {
      const results = await getYearlyTopTenAnimeByRedditAnimeListScore(year)
      return res.status(200).send(results)
    }
  } catch (err) {
    return next(err)
  }
  return next(new Error('Unexpected server error while trying to get yearly top ten'))
}

module.exports = controller
