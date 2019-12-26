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

function getMalSeasonName(season) {
  switch (Number(season)) {
  case 1:
    return '1st Season';
  case 2:
    return '2nd Season';
  case 3:
    return '3rd Season';
  case 21:
    return '21st Season';
  case 22:
    return '22nd Season';
  case 23:
    return '23rd Season';
  default:
    return `${season}th Season`;
  }
}

utils.searchMal = async (seasonNumber, showTitle) => {
  const malTitleFormat = seasonNumber > 1
    ? `${showTitle} ${getMalSeasonName(seasonNumber)}`
    : showTitle;
  const anime = await searchAnime(showTitle)
  let result = {};
  const latest = { id: anime.results[0].mal_id, result: anime.results[0] };
  // Attempt to find correct MAL data via general MAL Title Format
  for (const r of anime.results) {
    if (r.title.toLowerCase() === malTitleFormat.toLowerCase()) {
      result = r;
      break;
    }
    // Set latest to the latest TV with the showTitle in the MAL title
    if (
      r.type === 'TV'
      && r.title.toLowerCase().indexOf(showTitle.toLowerCase()) >= 0
    ) {
      if (r.mal_id > latest.id) {
        latest.id = r.mal_id;
        latest.result = r;
      }
    }
  }
  // If it couldn't find it based of general MAL Title Format, use latest entry
  if (Object.keys(result).length === 0) {
    // console.log(`using latest result for: ${showTitle}`)
    result = latest.result;
  }
  return result;
}


module.exports = utils