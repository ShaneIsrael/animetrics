/* eslint-disable no-useless-escape */
/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */
const service = {}
const axios = require('axios')
const { environment } = require('../config')
const config = require('../config')[environment].tvdb
const { Show } = require('../models')
const logger = require('../logger')
const { findAnime } = require('./MALService')

const tvdb = axios.create({
  baseURL: 'https://api.thetvdb.com/',
  timeout: 5000,
})


const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds))

async function get(url, options) {
  const ops = { ...options }
  ops.headers = {
    Authorization: `Bearer ${process.env.TVDB_JWT_TOKEN}`,
  }
  const resp = await tvdb.get(url, ops)
  return resp
}

async function updateSeriesInformation(id) {
  const show = await Show.findByPk(id)
  logger.info(`updating ${show.id}`)
  if (show.tvdb_id) {
    const info = (await get(`/series/${show.tvdb_id}`)).data.data;
    show.seriesName = info.seriesName
    show.synopsis = info.overview
    show.airsDayOfWeek = info.airsDayOfWeek
    show.genre = info.genre.join(',')
  } else {
    logger.info('using mal info instead of tvdb')
    if (show.mal_id && (!show.synopsis || !show.genre || !show.airsDayOfWeek)) {
      const info = await findAnime(show.mal_id)
      if (!show.synopsis && info.synopsis)
        show.synopsis = info.synopsis
      if (!show.genre && info.genres) {
        let genres = []
        for (const g of info.genres) {
          genres.push(g.name)
        }
        show.genre = genres.toString()
      }
      if (!show.airsDayOfWeek && info.broadcast) {
        const airDay = info.broadcast.match(/\b((mon|tues|wed(nes)?|thur(s)?|fri|sat(ur)?|sun)(days)?(day)?)\b/gi)
      	if (airDay) {
	  show.airsDayOfWeek = airDay[0]
	}
      }
      show.tvdb_id = -1
    }
  }
  show.save()
  return show
}

async function search(t, original, attempt) {
  let title = t
  try {
    const series = await get('/search/series', {
      params: {
        name: title,
      },
    })
    return series;
  } catch (err) {
    if (err.response && err.response.status === 404) {
      if (attempt === 0) {
        title = title.replace(/[(0-9)]/g, '')
        const r = await search(title, original, (attempt += 1));
        return r;
      }
      // left of colon
      if (attempt === 1) {
        title = original.split(':')[0]
        if (title) {
          title = title.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '')
          const r = await search(title, original, (attempt += 1));
          return r;
        }
        const r = await search(original, original, (attempt += 1));
        return r;
      }
      // right of colon
      if (attempt === 2) {
        title = original.split(':')[1]
        if (title) {
          title = title.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '')
          const r = await search(title, original, (attempt += 1));
          return r;
        }
        const r = await search(original, original, (attempt += 1));
        return r;
      }
      if (attempt === 3) {
        title = original.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '')
        const r = await search(title, original, (attempt += 1));
        return r;
      }
      // Remove first word
      if (attempt === 4) {
        title = title.split(' ').slice(1).join(' ')
        const r = await search(title, original, (attempt += 1));
        return r;
      }
      // Sometimes theres a pointless 'no' after first word. Ex: Boku no Hero Academia
      if (attempt === 5) {
        title = title.replace(' no', '')
        const r = await search(title, original, (attempt += 1));
        return r;
      }
    }
    return null;
  }
}

async function getPoster(id) {
  try {
    logger.info(`getting poster for series tvdb_id=${id}`)
    const seasonPoster = (await get(`/series/${id}/images/query`,
      {
        params: { keyType: 'poster' },
      })).data;
    let highestRated = {}
    logger.info(`found posters: ${seasonPoster.data}`)
    for (const poster of seasonPoster.data) {
      if (!highestRated.ratingsInfo || highestRated.ratingsInfo.average < poster.ratingsInfo.average) {
        highestRated = poster
      }
    }
    return highestRated.fileName;
  } catch (err) {
    logger.error(err.message)
    return null;
  }
}

service.getSeriesById = async (id) => {
  const result = (await get(`/series/${id}`)).data.data
  return result
}

service.searchByTitle = async (title, original) => {
  const result = await search(title, original, 0)
  return result
}

service.authTvDb = async () => {
  const res = (await tvdb.post('/login', {
    apikey: config.API_KEY,
  })).data;
  process.env.TVDB_JWT_TOKEN = res.token
}
service.refreshTvDb = async () => {
  await get('/refresh_token')
}

service.updateTvDbIds = async () => {
  logger.info('updating tvdb ids')
  const shows = await Show.findAll({ where: { tvdb_id: null } });
  for (const show of shows) {
    logger.info(`Attempting to update TVDB ID for showId=${show.id} title=${show.title}`)
    let result = await search(show.title, show.title, 0);
    if (!result && show.english_title) result = await search(show.english_title, show.english_title, 0)
    if (!result && show.alt_title) result = await search(show.alt_title, show.alt_title, 0);
    const match = {};
    if (result && result.data) {
      for (const re of result.data.data) {
        if (re.status === 'Continuing' && re.slug.indexOf(show.title.toLowerCase()) >= 0) {
          match.id = re.id
          match.result = re
          break
        } else if (show.alt_title) {
          if (show.title.toLowerCase().indexOf(re.seriesName.toLowerCase()) >= 0 || show.alt_title.toLowerCase().indexOf(re.seriesName.toLowerCase()) >= 0) {
            match.id = re.id
            match.result = re
            break
          }
        } else if (show.title.toLowerCase().indexOf(re.seriesName.toLowerCase()) >= 0) {
          match.id = re.id
          match.result = re
          break
        }
      }
      if (match.id) {
        logger.info(`Found tvdb match: ${match.result.seriesName} --> ${show.title}`)
        show.tvdb_id = match.id
      } else {
        logger.info(`NO TVDB MATCH, using first found: ${result.data.data[0].seriesName}`)
        show.tvdb_id = result.data.data[0].id
      }
      show.save()
    }
    await updateSeriesInformation(show.id)
  }
}

async function getSeasonPoster(id, season) {
  try {
    const seasonPoster = (await get(`/series/${id}/images/query`,
      {
        params: { keyType: 'season', subKey: season },
      })).data;
    let highestRated = {}
    for (const poster of seasonPoster.data) {
      if (!highestRated.ratingsInfo || highestRated.ratingsInfo.average < poster.ratingsInfo.average) {
        highestRated = poster
      }
    }
    return highestRated.fileName;
  } catch (err) {
    return null;
  }
}

service.getSeriesPoster = async (id) => {
  const poster = await getPoster(id)
  return poster
}

service.getSeriesPosterBySeason = async (id, season) => {
  const poster = await getSeasonPoster(id, season)
  return poster
}

service.updateSeriesInformation = (id) => updateSeriesInformation(id)

module.exports = service
