const axios = require('axios');
const snoowrap = require('snoowrap');
const cheerio = require('cheerio');
const Jikan = require('jikan-node');

const mal = new Jikan();

const CLIENT_ID = 'o1P2JRGCX5FQlA';
const CLIENT_SECRET = 'zGvwomVvHhEzqgSrXP8dhUuFzSY';

const TVDB_API_KEY = 'A2I7IOGLBSTNR757';
const TVDB_JWT_TOKEN = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NzQyNjMyNzksImlkIjoiIiwib3JpZ19pYXQiOjE1NzQxNzY4Nzl9.HaY1S-QxZAhRc76LvhEi4N2ap2MXwFD6ZXTEvyNxK30iQvPWYwxc9-2k7plak-rr_FP_unqJKDjULg_LNRLqiHNmJMbS8qKsCURQj0iFpBTbww7XDQJTGmRcA8XWNe58Cyzx8fN4k18LUAni5WRIJ344sKMn580adbx98BAY33U61uPOWDcbUyPLllp-PWYQZ4gRdDrHUeJeC18ThQzxMQdd4T09l2r4MAYqpqBwK2s8H-HrwZRmPQ5PgyDTTKVuCoawPLuke4d5ELKmfNBELeBraYn5ZrdilxoN-pzY8mrFaOhZFYUcw_LaiknJL38cC0Vz1VoILoly95qO8pn4_A';

const r = new snoowrap({
  userAgent: 'search subreddit posts',
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  refreshToken: '10419841-pv1qeYS2Y8t0LhHSYQzyaOjLySk',
});

async function authTvDB() {
  const loginResp = (await axios.post('https://api.thetvdb.com/login', {
    apikey: TVDB_API_KEY,
  })).data;
  console.log(loginResp);
}

async function getLatestSeason(tvdbid) {
  try {
    let latestSeason = null
    const info = await axios.get(`https://api.thetvdb.com/series/${tvdbid}/episodes/summary`, {
      headers: {
        Authorization: `Bearer ${TVDB_JWT_TOKEN}`,
      },
    });
    if (info && info.data.data.airedSeasons) {
      for (const season of info.data.data.airedSeasons) {
        if (latestSeason === null && season !== 0) latestSeason = season
        if (latestSeason < season) latestSeason = season
      }
    }
    return latestSeason;
  } catch (err) {
    return null
  }
}
async function searchTvDb(title, original, attempt) {
  try {
    const series = await axios.get('https://api.thetvdb.com/search/series', {
      params: {
        name: title,
      },
      headers: {
        Authorization: `Bearer ${TVDB_JWT_TOKEN}`,
      },
    });
    return series;
  } catch (err) {
    if (err.response.status === 404) {
      if (attempt === 0) {
        title = title.replace(/[(0-9)]/g, '')
        const r = await searchTvDb(title, original, (attempt += 1));
        return r;
      }
      // left of colon
      if (attempt === 1) {
        title = original.split(':')[0]
        if (title) {
          title = title.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '')
          const r = await searchTvDb(title, original, (attempt += 1));
          return r;
        }
        const r = await searchTvDb(original, original, (attempt += 1));
        return r;
      }
      // right of colon
      if (attempt === 2) {
        title = original.split(':')[1]
        if (title) {
          title = title.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '')
          const r = await searchTvDb(title, original, (attempt += 1));
          return r;
        }
        const r = await searchTvDb(original, original, (attempt += 1));
        return r;
      }
      if (attempt === 3) {
        title = original.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '')
        const r = await searchTvDb(title, original, (attempt += 1));
        return r;
      }
      // Remove first word
      if (attempt === 4) {
        title = title.split(' ').slice(1).join(' ')
        const r = await searchTvDb(title, original, (attempt += 1));
        return r;
      }
      // Sometimes theres a pointless 'no' after first word. Ex: Boku no Hero Academia
      if (attempt === 5) {
        title = title.replace(' no', '')
        const r = await searchTvDb(title, original, (attempt += 1));
        return r;
      }
    }
    return null;
  }
}

async function searchMal(seasonNumber, showTitle) {
  const malTitleFormat = seasonNumber > 1
    ? `${showTitle} ${getMalSeasonName(seasonNumber)}`
    : showTitle;
  const anime = await mal.search('anime', showTitle)
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

// Tables
// Show
// id, title, mal_id, tvdb_id
// Assets
// id, showId, season, banner, poster
// Week
// id, start_dt, end_dt
// EpisodeDiscussion
// id, showId, weekId, post_id, season, episode, post_title, post_url, post_created_dt
// MALSnapshot
// id, showId, weekId, score, scored_by, rank, episodes, favorites, popularity, members
// EpisodeDiscussionResults
// id, episodeDiscussionId, malSnapshotId, ups, comment_count, mal_snapshot, poll_results

// run()
// authTvDB()
// runTvDB()
// scrapePollData()
// getMalDetails(37140)

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

async function scrapePollData(url) {
  const html = (await axios.get(`${url}/r`)).data;
  const $ = cheerio.load(html);
  const results = {};
  $('.results-area.basic-type-results .basic-option-wrapper').each(
    (i, elem) => {
      const option = $(elem)
        .find('.basic-left-container span.basic-option-title')
        .text();
      const score = $(elem)
        .find('.basic-right-container span.basic-option-total')
        .text();
      results[option] = score;
    },
  );
  return results;
}

async function getSeasonPoster(id, season) {
  try {
    const seasonPoster = (await axios.get(
      `https://api.thetvdb.com/series/${id}/images/query`,
      {
        params: { keyType: 'season', subKey: season },
        headers: {
          Authorization: `Bearer ${TVDB_JWT_TOKEN}`,
        },
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
async function getPoster(id) {
  try {
    const seasonPoster = (await axios.get(
      `https://api.thetvdb.com/series/${id}/images/query`,
      {
        params: { keyType: 'poster' },
        headers: {
          Authorization: `Bearer ${TVDB_JWT_TOKEN}`,
        },
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
async function getBannerPoster(id) {
  try {
    const banners = (await axios.get(
      `https://api.thetvdb.com/series/${id}/images/query`,
      {
        params: {
          keyType: 'series',
          subKey: 'graphical',
        },
        headers: {
          Authorization: `Bearer ${TVDB_JWT_TOKEN}`,
        },
      },
    )).data;
    let highestRated = {}
    for (const banner of banners.data) {
      if (!highestRated.ratingsInfo || highestRated.ratingsInfo.average < banner.ratingsInfo.average) {
        highestRated = banner
      }
    }
    return highestRated.fileName;
  } catch (err) {
    return null;
  }
}

async function getRedditPostDetails(id) {
  const post = await r.getSubmission(id).fetch();
  return post;
}

async function populateShowTableAndEpisodeDiscussions() {
  const posts = await r
    .getSubreddit('anime')
    .search({
      query: '%episode%discussion',
      limit: 1000,
      time: 'week',
      sort: 'relevance',
    });
  for (const post of posts) {
    await digestDiscussionPost(post)
  }
}

async function digestDiscussionPost(post) {
  if (post.link_flair_text !== 'Episode') return
  if (post.title.indexOf('Megathread') !== -1) return
  if (post.title.indexOf('- Episode ') === -1) return
  console.log(post.title)
  const seasonSplit = post.title.split(/ Season /)[1];
  const seasonNumber = seasonSplit ? seasonSplit.split(' ')[0] : 1;
  const showTitle = post.title.split(' - Episode')[0].split(' Season')[0];
  const episodeNumber = post.title.split('- Episode ')[1].split(' ')[0];
  const pollUrl = post.selftext_html
    .split('">Rate')[0]
    .split('<h1><a href="')[1];

  let showRow = await Show.findOne({ where: { title: showTitle } });
  if (!showRow) {
    const malResult = await searchMal(seasonNumber, showTitle);
    const malDetails = await mal.findAnime(malResult.mal_id)
    const altTitle = malDetails.title_english
      ? malDetails.title_english
      : malDetails.title_synonyms
        ? malDetails.title_synonyms[0]
        : null;
    showRow = await Show.create({
      title: showTitle,
      alt_title: altTitle,
      mal_id: malDetails.mal_id,
    });
  }
  let discussion = await EpisodeDiscussion.findOne({
    where: { post_id: post.id },
  });
  const postWeekStartDt = moment(post.created_utc * 1000)
    .utc()
    .startOf('week')
    .format('YYYY-MM-DD HH:mm:ss');
  const postWeekEndDt = moment(post.created_utc * 1000)
    .utc()
    .endOf('week')
    .format('YYYY-MM-DD HH:mm:ss');
  let weekRow = await Week.findOne({ where: { start_dt: postWeekStartDt } });
  if (!weekRow) {
    weekRow = await Week.create({
      start_dt: postWeekStartDt,
      end_dt: postWeekEndDt,
    });
  }
  if (!discussion) {
    discussion = await EpisodeDiscussion.create({
      showId: showRow.id,
      weekId: weekRow.id,
      post_id: post.id,
      season: Number(seasonNumber),
      episode: Number(episodeNumber),
      post_poll_url: pollUrl,
      post_title: post.title,
      post_url: post.url,
      post_created_dt: moment(post.created_utc * 1000)
        .utc()
        .format('YYYY-MM-DD HH:mm:ss'),
    });
  }
  const assetExists = await Asset.findOne({
    where: { showId: discussion.showId},
  });
  if (!assetExists) {
    await Asset.create({
      showId: discussion.showId,
      season: discussion.season,
    });
  }
}

async function updateTvDbIds() {
  const shows = await Show.findAll({ where: { tvdb_id: null } });
  for (const show of shows) {
    let result = await searchTvDb(show.title, show.title, 0);
    if (!result && show.alt_title) result = await searchTvDb(show.alt_title, show.alt_title, 0);
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
        console.log(`Found tvdb match: ${match.result.seriesName} --> ${show.title}`)
        show.tvdb_id = match.id
      } else {
        console.log(`NO TVDB MATCH, using first found: ${result.data.data[0].seriesName}`)
        show.tvdb_id = result.data.data[0].id
      }
      await show.save();
    }
  }
}

const moment = require('moment');

async function createWeek() {
  const today = moment().utc();
  const weekStart = today
    .clone()
    .startOf('week')
    .format('YYYY-MM-DD HH:mm:ss');
  const weekEnd = today
    .clone()
    .endOf('week')
    .format('YYYY-MM-DD HH:mm:ss');
  const exists = await Week.findOne({ where: { start_dt: weekStart } });
  if (!exists) {
    await Week.create({ start_dt: weekStart, end_dt: weekEnd });
  }
}
// async function populateMalSnapshots() {
//   const weekRow = await Week.findOne({where: {start_dt: moment().utc().startOf('week').format('YYYY-MM-DD HH:mm:ss')}})
//   if (weekRow) {
//     const discussions = await EpisodeDiscussion.findAll({where: {weekId: weekRow.id}})
//     if (discussions) {
//       for (let discussion of discussions) {
//         const exists = await MALSnapshot.findOne({where: {showId: discussion.showId, weekId: weekRow.id}})
//         if (!exists) {
//           let showRow = await Show.findOne({where: {id: discussion.showId}})
//           let malDetails = await getMalDetails(showRow.mal_id)

//           await MALSnapshot.create({
//             showId: discussion.showId,
//             weekId: weekRow.id,
//             score: malDetails.score,
//             scored_by: malDetails.scored_by,
//             rank: malDetails.rank,
//             episodes: malDetails.episodes,
//             favorites: malDetails.favorites,
//             popularity: malDetails.popularity,
//             members: malDetails.members
//           })
//         }
//       }
//     }
//   }
//   console.log('done creating mal snapshots')
// }

async function populateAssetData() {
  // let missingBanners = await Asset.findAll({ where: { banner_art: null } });
  const missingPosters = await Asset.findAll({ where: { poster_art: null } });

  for (const asset of missingPosters) {
    const showRow = await Show.findOne({ where: { id: asset.showId } });
    // let poster;
    // if (asset.season > 1) {
    //   poster = await getSeasonPoster(showRow.tvdb_id, asset.season);
    //   if (!poster) {
    //     poster = await getPoster(showRow.tvdb_id)
    //   }
    // } else {
    //   poster = await getPoster(showRow.tvdb_id);
    // }
    const poster = await getPoster(showRow.tvdb_id)
    asset.poster_art = poster;
    asset.save();
  }
  // for (let asset of missingBanners) {
  //   const showRow = await Show.findOne({ where: { id: asset.showId } });
  //   let banner;
  //   poster = await getBannerPoster(showRow.tvdb_id);
  //   asset.banner_art = poster;
  //   asset.save();
  // }
}

async function populateWeeklyResults() {
  // get the previous weeks (not current week)
  const prevWeeks = await Week.findAll({
    where: {
      start_dt: {
        [Op.not]: moment()
          .utc()
          .startOf('week')
          .format('YYYY-MM-DD HH:mm:ss'),
      },
    },
    include: [
      {
        model: EpisodeDiscussion,
        include: [{ model: Show }, { model: EpisodeDiscussionResult }],
      },
    ],
  });
  for (const week of prevWeeks) {
    for (const discussion of week.EpisodeDiscussions) {
      if (!discussion.EpisodeDiscussionResult) {
        const malDetails = await mal.findAnime(discussion.Show.mal_id)
        if (malDetails) {
          const malSnapshot = await MALSnapshot.create({
            showId: discussion.Show.id,
            weekId: week.id,
            score: malDetails.score,
            scored_by: malDetails.scored_by,
            rank: malDetails.rank,
            episodes: malDetails.episodes,
            favorites: malDetails.favorites,
            popularity: malDetails.popularity,
            members: malDetails.members,
          });
          let pollDetails = null
          if (discussion.post_poll_url) {
            pollDetails = await scrapePollData(discussion.post_poll_url);
          }
          const post = await getRedditPostDetails(discussion.post_id);
          await EpisodeDiscussionResult.create({
            episodeDiscussionId: discussion.id,
            malSnapshotId: malSnapshot.id,
            weekId: week.id,
            showId: discussion.Show.id,
            ups: post.ups,
            comment_count: post.num_comments,
            poll_results: pollDetails,
          });
        } else {
          console.log(
            `could not get MAL Details for Show ID: ${discussion.Show.id}`,
          );
        }
      }
    }
  }
}

async function updateAssetSeasons() {
  const assets = await Asset.findAll({include: [Show]})
  for (const asset of assets) {
    const latestSeason = await getLatestSeason(asset.Show.tvdb_id)
    if (latestSeason) {
      asset.season = latestSeason
      asset.save()
    }
  }
}

async function getArchivedDiscussions() {
  const archived = (await axios.get('https://www.reddit.com/r/anime/wiki/discussion_archive/2019', {
  })).data;
  const $ = cheerio.load(archived)
  const postIds = []
  $('td a').each(async (index, elem) => {
    const split = $(elem).attr('href').split('/')
    const postId = split[split.length - 2]
    postIds.push(postId)
  })
  for (const id of postIds) {
    const post = await r.getSubmission(id).fetch()
    try {
      await digestDiscussionPost(post)
    } catch (err) {
      console.log(err)
    }
  }
  // console.log(archived)
}


async function populate() {
  try {
    // await createWeek();
    console.log('\n\n\nPOPULATING SHOWS AND DISCUSSIONS');
    // await populateShowTableAndEpisodeDiscussions();
    // await getArchivedDiscussions()
    console.log('\n\n\nUPDATING TVDB IDS');
    await updateTvDbIds();
    console.log('\n\n\nUPDATING ASSET SEASONS')
    await updateAssetSeasons()
    console.log('\n\n\nPOPULATING ASSET INFORMATION');
    await populateAssetData();
    console.log('\n\n\nPOPULATING WEEKLY RESULTS');
    await populateWeeklyResults();
    await fetchAssets()
    // await populateRedditUsers()
    // await populateRedditUsersScores()
  } catch (err) {
    console.log(err);
  }
}
async function print() {
  const weeks = await Week.findAll({ include: [{ model: EpisodeDiscussionResult, order: [['ups', 'DESC']], include: [{ model: Show }] }], order: [['start_dt', 'ASC']] })
  console.log('\n\n')
  for (const week of weeks) {
    if (week.EpisodeDiscussionResults.length > 0) {
      console.log(`-- ${moment(week.start_dt).format('MMMM Do')} to ${moment(week.end_dt).format('MMMM Do')}`)
      console.log(`\tDiscussions: ${week.EpisodeDiscussionResults.length}`)
      console.log(`\t#1 Show: ${week.EpisodeDiscussionResults[0].Show.title}`)
      console.log(`\tKarma: ${week.EpisodeDiscussionResults[0].ups}`)
      console.log(`\tLeading by ${week.EpisodeDiscussionResults[0].ups - week.EpisodeDiscussionResults[1].ups} Karma`)
      console.log(`\tLeast Popular Show: ${week.EpisodeDiscussionResults[week.EpisodeDiscussionResults.length - 1].Show.title} | ${week.EpisodeDiscussionResults[week.EpisodeDiscussionResults.length - 1].Show.alt_title}`)
      console.log(`\tWith Karma of: ${week.EpisodeDiscussionResults[week.EpisodeDiscussionResults.length - 1].ups}`)
      console.log('\n')
    }
  }

  const shows = await Show.findAll()
  const missingAssets = await Show.findAll({ where: { tvdb_id: null } })
  const missingMalDetails = await Show.findAll({ where: { mal_id: null } })
  const discussions = await EpisodeDiscussion.findAll()
  const discussionResults = await EpisodeDiscussionResult.findAll()
  console.log(`${shows.length} Shows Catelogued`)
  console.log(`${discussions.length} Episode Discussions Recorded`)
  console.log(`${discussionResults.length} Weekly Episode Discussion Results Created`)
  console.log(`${missingAssets.length} show(s) are missing TVDB Asset Data (${Math.round(100 - (missingAssets.length / shows.length * 100))}% success rate)`)
  console.log(`${missingMalDetails.length} shows(s) are missing MAL Details`)
}

const gm = require('gm');
const spawn = require('await-spawn');

async function crop(width, height, path, savePath) {
  const pyProg = await spawn('python', ['./tools/detectFace.py', path]);
  const jsonLoc = `${path.split('.jpg')[0]}_faces.json`
  if (fs.existsSync(jsonLoc)) {
    const facedata = fs.readFileSync(jsonLoc);
    const faces = JSON.parse(facedata);
    // store all the faces y values in an array to average them

    const yValues = []
    const faceAreas = []
    let largestFaceArea = 1
    let largestFaceYValue

    // let yValuesTwoThirds = []
    // let faceAreasTwoThirds = []
    // for (const face of faces) {
    //   let faceMidY = face.y + (face.height/2)
    //   if (faceMidY < 333 || faceMidY > 666) continue
    //   yValuesTwoThirds.push(faceMidY)
    //   faceAreasTwoThirds.push(face.width * face.height)
    // }
    for (const face of faces) {
      const faceArea = face.width * face.height
      yValues.push(face.y)
      faceAreas.push(faceArea)
      // largestFaceArea = faceArea > largestFaceArea ? faceArea : largestFaceArea
      if (faceArea > largestFaceArea) {
        largestFaceArea = faceArea
        largestFaceYValue = face.y + face.height / 2
      }
    }
    // if (yValuesTwoThirds.length !== 0) {
    //   yValues = yValuesTwoThirds
    //   faceAreas = faceAreasTwoThirds
    // }

    const weightedFaces = []
    for (const fa of faceAreas) {
      weightedFaces.push(fa / largestFaceArea)
    }
    const sumArrayValues = (values) => values.reduce((p, c) => p + c, 0)

    const weightedMean = (factorsArray, weightsArray) => sumArrayValues(factorsArray.map((factor, index) => factor * weightsArray[index])) / sumArrayValues(weightsArray)

    // let avgY = Math.round(weightedMean(yValues, weightedFaces))
    // let avgY = Math.round(yValues.reduce((a, b) => a + b, 0) / yValues.length)
    let avgY = largestFaceYValue

    // console.log(avgY)
    if ((avgY - (height / 2)) < 0) {
      avgY -= (avgY - (height / 2))
      console.log(`New Y Value: ${avgY}`)
    }

    gm(path)
      .gravity('NorthWest')
      .crop(width, height, (680 - 454) / 2, avgY - (height / 2))
      .write(savePath, (err) => {
        if (err) {
          console.log(err);
        }
        // gm(savePath).append(path, false).write(`${savePath.split('.png')[0]}_appended.png`, (err) => {
        //   if (err) {
        //     console.log(err)
        //   }
        // })
      })
  } else {
    gm(path)
      .gravity('NorthWest')
      .crop(width, height, (680 - 454) / 2, 333 - (height / 2))
      .write(savePath, (err) => {
        if (err) {
          console.log(err);
        }
        // gm(savePath).append(path, false).write(`${savePath.split('.png')[0]}_noface_appended.png`, (err) => {
        //   if (err) {
        //     console.log(err)
        //   }
        // })
      })
  }
}

const download = require('image-downloader')
const fs = require('fs')
const {
  Show,
  Week,
  EpisodeDiscussion,
  EpisodeDiscussionResult,
  MALSnapshot,
  Asset,
  RedditUser,
  RedditUserScore,
  Op,
} = require('./models/index');

async function fetchAssets() {
  console.log('Fetching assets and cropping banners...')
  if (!fs.existsSync('/Users/sisrael/git/anime-episode-ranking/ui/public/images/assets')) {
    fs.mkdirSync('/Users/sisrael/git/anime-episode-ranking/ui/public/images/assets');
  }
  if (!fs.existsSync('/Users/sisrael/git/anime-episode-ranking/ui/public/images/assets/banners')) {
    fs.mkdirSync('/Users/sisrael/git/anime-episode-ranking/ui/public/images/assets/banners');
  }
  if (!fs.existsSync('/Users/sisrael/git/anime-episode-ranking/ui/public/images/assets/posters')) {
    fs.mkdirSync('/Users/sisrael/git/anime-episode-ranking/ui/public/images/assets/posters');
  }
  const shows = await Show.findAll({ include: [{ model: Asset }] })
  // https://www.thetvdb.com/banners/
  for (const show of shows) {
    const postersDir = '/Users/sisrael/git/anime-episode-ranking/ui/public/images/assets/posters'
    const bannersDir = '/Users/sisrael/git/anime-episode-ranking/ui/public/images/assets/banners'
    for (const asset of show.Assets) {
      try {
        if (!asset.poster_art) continue
        console.log(`downloading asset for: ${show.title}`)
        // if (!fs.existsSync(dir)){
        //   fs.mkdirSync(dir);
        // }

        if (!fs.existsSync(`${postersDir}/${show.id}_${asset.season}.jpg`)) {
          const { filename } = await download.image({
            url: `https://www.thetvdb.com/banners/${asset.poster_art}`,
            dest: `${postersDir}/${show.id}_${asset.season}.jpg`,
          })
        } else {
          console.log('\tposter asset exists, skipping...')
        }

        if (!fs.existsSync(`${bannersDir}/${show.id}_${asset.season}.png`)) {
          // await crop(758, 140, `${postersDir}/${show.id}.jpg`, `${bannersDir}/${show.id}.png`)
          await crop(454, 80, `${postersDir}/${show.id}_${asset.season}.jpg`, `${bannersDir}/${show.id}_${asset.season}.png`)
        } else {
          console.log('\tbanner asset exists, skipping...')
        }
      } catch (err) {
        console.log(err)
      }
    }
  }
}

async function populateRedditUsers() {
  console.log('Populating Reddit Users...')
  const ral = (await axios.get('http://www.redditanimelist.net/users.php', {
  })).data;
  const $ = cheerio.load(ral);
  const users = []
  $('table tbody tr').each(
    async (i, elem) => {
      let redditName; let malName; let
        lastActiveDt
      $(elem).find('td').each((i, elem) => {
        switch (i) {
        case 1:
          redditName = $(elem).text()
          break
        case 2:
          malName = $(elem).text()
          break
        case 3:
          lastActiveDt = moment(new Date($(elem).text())).format('YYYY-MM-DD HH:mm:ss')
          break
        }
      })
      if (redditName && malName && lastActiveDt) {
        users.push({ reddit_username: redditName, mal_username: malName, lastActiveAt: lastActiveDt })
      }
    },
  );
  console.log('Bulk adding users...')
  await RedditUser.bulkCreate(users, {
    ignoreDuplicates: true,
  })
  console.log('Complete!')

  // console.log(ral)
}

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds))
async function populateRedditUsersScores() {
  console.log('Populating Reddit User Scores... this could take some time.')
  const users = await RedditUser.findAll({
    where: {
      lastActiveAt: {
        [Op.gt]: moment().subtract(1, 'months').toDate(),
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
    const skip = await RedditUserScore.findOne({ where: { redditUserId: user.id } })
    if (skip) continue
    try {
      const animes = await mal.findUser(user.mal_username, 'animelist')
      elapsed = Date.now() - startTime
      times.push(elapsed)
      // Stop rate limits (30 requests a minute max)
      await sleep(2000)
      console.log(`Lookup took: ${elapsed / 1000} seconds (${current}/${users.length}) | ~${(((2000 + ((times.reduce((a, b) => a + b, 0) / times.length))) / 1000) * (users.length - current)) / 60} minutes remaining...`)
      current += 1
      for (const anime of animes.anime) {
        if (anime.score === 0) continue
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
    } catch (err) {
      console.log(err)
      console.log(user.mal_username)
    }
  }
  const totalTime = (times.reduce((a, b) => a + b, 0))
  console.log(`Populating Users Scores took ${(totalTime / 1000) / 60} minutes`)
}

// print()
// populate()
// fetchAssets()

async function test() {
  // 305074
  const shows = await Show.findAll({where: {tvdb_id: {[Op.ne]: null}}})
  for (const show of shows) {
    console.log(`updating ${show.id}`)
    const info = (await axios.get(
      `https://api.thetvdb.com/series/${show.tvdb_id}`,
      {
        headers: {
          Authorization: `Bearer ${TVDB_JWT_TOKEN}`,
        },
      },
    )).data.data;
    show.seriesName = info.seriesName
    show.synopsis = info.overview
    show.airsDayOfWeek = info.airsDayOfWeek
    show.genre = info.genre.join(',')
    show.save()
  }
}
test()
// authTvDB()


// OPTION 1 - Crop at Largest Face midpoint (1)
// OPTION 2 - Weighted Mean of Y (weight is value 0 - 1.0 based off size of face relative to largest face)
// OPTION 3 - Simple Average of Y (1)
// OPTION 4 - Simple Average of Y, Ignore Faces NOT within middle 1/3 of image
// OPTION 5 - Weighted Mean of Y, Ignore Faces NOT within middle 1/3 of image


// Week Start: Friday, Week End: Thursday

// 1. Scan subreddit every hour for discussions, extract and store data
// 2. Scan subreddit for MAL users every (x) hours
// 3. Update MAL users scores for current weeks shows being ranked every (x) hours. 2 requests per second.

// 4. When a discussion reaches 48 hours in age, generate results for it (Discussion Points, Reddit Poll, MAL Score, RAL Score)
// 5. 48 hours after the last discussion thread on Friday, generate rankings for previous week with change stats from the previous ranking week (new table perhaps)

// 6. Display results on Front End.


// BANNER WIDTH: 454 pixels, center the cropping

// add more details about each show to the show table so a lookup isn't required each time. (synopsis, etc)