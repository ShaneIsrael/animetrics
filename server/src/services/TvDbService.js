/* eslint-disable no-useless-escape */
/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */

const axios = require('axios')
const config = require('../config/config').dev.tvdb
const { Show } = require('../models')
const logger = require('../logger')

const tvdb = axios.create({
  baseURL: 'https://api.thetvdb.com/',
  timeout: 5000,
  headers: {
    Authorization: `Bearer ${process.env.TVDB_JWT_TOKEN}`
  }
})

const service = {}

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds))

async function updateSeriesInformation(id) {
  const show = await Show.findByPk(id)
  logger.info(`updating ${show.id}`)
  const info = (await tvdb.get(`/series/${show.tvdb_id}`)).data.data;
  show.seriesName = info.seriesName
  show.synopsis = info.overview
  show.airsDayOfWeek = info.airsDayOfWeek
  show.genre = info.genre.join(',')
  show.save()
}

async function search(t, original, attempt) {
  let title = t
  try {
    const series = await tvdb.get('/search/series', {
      params: {
        name: title,
      }
    })
    return series;
  } catch (err) {
    if (err.response.status === 404) {
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
    const seasonPoster = (await tvdb.get(`/series/${id}/images/query`,
      {
        params: { keyType: 'poster' },
      },
    )).data;
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

service.getSeriesById = async (id) => {
  const result = (await axios.get(`/series/${id}`)).data.data
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

service.updateTvDbIds = async () => {
  const shows = await Show.findAll({ where: { tvdb_id: null } });
  for (const show of shows) {
    let result = await search(show.title, show.title, 0);
    if (!result && show.alt_title) result = await search(show.alt_title, show.alt_title, 0);
    const match = {};
    if (result && result.data) {
      for (const re of result.data.data) {
        if (show.alt_title) {
          if (show.title.toLowerCase().indexOf(re.seriesName.toLowerCase()) >= 0 || show.alt_title.toLowerCase().indexOf(re.seriesName.toLowerCase()) >= 0) {
            match.id = re.id
            match.result = re
          }
        } else if (show.title.toLowerCase().indexOf(re.seriesName.toLowerCase()) >= 0) {
          match.id = re.id
          match.result = re
        }
        // if (!earliestMatch.id) {
        //   earliestMatch.id = r.id;
        //   earliestMatch.result = r;
        // } else if (earliestMatch.id > r.id) {
        //   earliestMatch.id = r.id;
        //   earliestMatch.result = r;
        // }
      }
      if (match.id) {
        logger.info(`Found tvdb match: ${match.result.seriesName} --> ${show.title}`)
        show.tvdb_id = match.id
      } else {
        logger.info(`NO TVDB MATCH, using first found: ${result.data.data[0].seriesName}`)
        show.tvdb_id = result.data.data[0].id
      }
      show.save();
      await updateSeriesInformation(show.id)
    }
  }
}

async function getSeasonPoster(id, season) {
  try {
    const seasonPoster = (await tvdb.get(`/series/${id}/images/query`,
      {
        params: { keyType: 'season', subKey: season }
      },
    )).data;
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

module.exports = service
