const axios = require('axios')
const cheerio = require('cheerio')
const moment = require('moment')
const { RedditUser, RedditUserScore, Op } = require('../models')
const { findUser } = require('../services')
const logger = require('../logger')

module.exports = {
  async fetch() {
    logger.info('fetching reddit mal users...')
    const ral = (await axios.get('http://www.redditanimelist.net/users.php', {
    })).data;
    const $ = cheerio.load(ral);
    const users = []
    $('table tbody tr').each(
      async (i, elem) => {
        let redditName; let malName; let
          lastActiveDt
        $(elem).find('td').each((index, element) => {
          switch (index) {
          case 1:
            redditName = $(element).text()
            break
          case 2:
            malName = $(element).text()
            break
          case 3:
            lastActiveDt = moment(new Date($(element).text())).format('YYYY-MM-DD HH:mm:ss')
            break
          default:
          }
        })
        if (redditName && malName && lastActiveDt) {
          users.push({ reddit_username: redditName, mal_username: malName, lastActiveAt: lastActiveDt })
        }
      },
    );
    await RedditUser.bulkCreate(users, {
      ignoreDuplicates: true,
    })
  },
  async fetchScores() {
    logger.info('Populating Reddit User Scores... this could take some time.')
    const users = await RedditUser.findAll({
      where: {
        lastActiveAt: {
          [Op.gt]: moment().subtract(3, 'months').toDate(),
        },
      },
      order: [['lastActiveAt', 'DESC']],
    })
    const times = []
    let startTime; let
      elapsed
    let current = 1
    for (const user of users) {
      startTime = Date.now()
      try {
        const animes = await findUser(user.mal_username, 'animelist')
        elapsed = Date.now() - startTime
        times.push(elapsed)
        // Stop rate limits (30 requests a minute max)
        logger.info(`Lookup took: ${elapsed / 1000} seconds (${current}/${users.length}) | ~${(((2000 + ((times.reduce((a, b) => a + b, 0) / times.length))) / 1000) * (users.length - current)) / 60} minutes remaining...`)
        current += 1
        for (const anime of animes.anime) {
          if (anime.score !== 0) {
            const score = {
              redditUserId: user.id,
              mal_show_id: anime.mal_id,
              score: anime.score,
            }
            const found = await RedditUserScore.findOne({
              where: {
                mal_show_id: anime.mal_id,
                redditUserId: user.id,
              },
            })
            if (found) {
              if (found.score !== anime.score) {
                found.score = anime.score
                found.save()
              }
            } else {
              await RedditUserScore.create(score)
            }
          }
        }
      } catch (err) {
        logger.error(err)
      }
    }
    const totalTime = (times.reduce((a, b) => a + b, 0))
    logger.info(`Populating Users Scores took ${(totalTime / 1000) / 60} minutes`)
  },
}
