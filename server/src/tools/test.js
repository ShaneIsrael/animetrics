const service = {}
const moment = require('moment')
const { findAnime } = require('../services/MALService')
const {
  Show,
  Op
} = require('../models')

async function init() {
  const shows = await Show.findAll()
  for (const show of shows) {
    console.log(`updating ${show.id}`)
    const malDetails = await findAnime(show.mal_id)
    if (malDetails.title_english) {
      show.english_title = malDetails.title_english
      show.alt_title = malDetails.title_synonyms ? malDetails.title_synonyms[0] : null

      console.log(show.dataValues)
      show.save()
    } 
  }
}
init()