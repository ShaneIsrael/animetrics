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

function digest(post) {
  if (post.link_flair_text && post.link_flair_text !== 'Episode') return
  if (post.title.indexOf('Megathread') !== -1) return
  if (post.title.indexOf('- Episode ') === -1) return
  const seasonSplit = post.title.split(/ Season /)[1];
  const seasonNumber = seasonSplit ? seasonSplit.split(' ')[0] : 1
  const showTitle = post.title.split(' - Episode')[0].split(' Season')[0]
  const episodeNumber = post.title.split('- Episode ')[1].split(' ')[0]
  let pollUrl = null
  if (post.selftext && post.selftext.indexOf('Rate this episode here.') >= 0) {
    pollUrl = post.selftext
      .split('[Rate this episode here.](')[1]
      .split(')')[0]
  } else if (post.selftext_html && post.selftext_html.indexOf('>Rate') >= 0) {
    pollUrl = post.selftext_html
    .split('">Rate')[0]
    .split('<h1><a href="')[1]
  }
  console.log({
    title: showTitle,
    seasonNumber: seasonNumber,
    episode: episodeNumber,
    pollUrl: pollUrl
  })
}
const PushShift = require('./tools/pushshift-io.js')
const ps = new PushShift('submission')
const fetchDiscussions = require('./fetch/fetchDiscussions')
async function test() {
  try {
    const results = await fetchDiscussions.recursiveFetch(23)
    for (const r of results) {
      digest(r)
    }
  } catch(err) {
    console.log(err)
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