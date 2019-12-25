const service = {}

const { Show, Asset } = require('../models')

/**
 * Gets shows
 * @returns {array} Shows
 */
service.getShows = async () => {
  const shows = await Show.findAll({
    attributes: ['id', 'title', 'alt_title', 'genre', 'synopsis'],
    order: [['title', 'ASC']],
    raw: true,
  })
  return shows
}

/**
 * Gets shows and assets
 * @returns {array} Shows with their respective assets
 */
service.getShowsAndAssets = async () => {
  const shows = await Show.findAll({
    attributes: ['id', 'title', 'alt_title', 'genre', 'synopsis'],
    order: [['title', 'ASC']],
    include: [{ model: Asset, attributes: ['id', 'season', 's3_avatar', 's3_banner', 's3_poster'] }],
  })
  return shows
}

const { EpisodeDiscussion, EpisodeDiscussionResult, MALSnapshot, RedditPollResult } = require('../models')

service.fix = async(req, res) => {
  const show1 = req.query.correct
  const show2 = req.query.incorrect

  const correctShow = await Show.findByPk(show1)
  const incorrectShow = await Show.findByPk(show2)

  if (correctShow && incorrectShow) {
    let rows = await Asset.findAll({where: {showId: incorrectShow.id}})
    replaceShowId(correctShow.id, rows)
    rows = await EpisodeDiscussion.findAll({where: {showId: incorrectShow.id}})
    replaceShowId(correctShow.id, rows)
    rows = await EpisodeDiscussionResult.findAll({where: {showId: incorrectShow.id}})
    replaceShowId(correctShow.id, rows)
    rows = await MALSnapshot.findAll({where: {showId: incorrectShow.id}})
    replaceShowId(correctShow.id, rows)
    rows = await RedditPollResult.findAll({where: {showId: incorrectShow.id}})
    replaceShowId(correctShow.id, rows)
    rows = await EpisodeDiscussionResult.findAll({where: {showId: incorrectShow.id}})
    replaceShowId(correctShow.id, rows)

    await incorrectShow.destroy()
    res.send('done!')
  } else {
    res.send('invalid shows')
  }
}

function replaceShowId(id, rows) {
  for(const row of rows) {
    row.showId = id
    row.save()
  }
}
module.exports = service
