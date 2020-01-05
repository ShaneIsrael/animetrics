import React from 'react'
import { makeStyles, withStyles } from '@material-ui/styles'
import { Grid, Paper, Card, CardContent, Typography, CardMedia, Avatar, Tooltip } from '@material-ui/core'
import Chip from '@material-ui/core/Chip'
import ResultPosition from './ResultPosition/ResultPosition'
import ResultDetails from './ResultDetails/ResultDetails'
import ResultComments from './ResultComments/ResultComments'
import ResultScores from './ResultScores/ResultScores'
import ScoreIcon from '@material-ui/icons/Score'
import ForumIcon from '@material-ui/icons/Forum';
import PollIcon from '@material-ui/icons/Poll'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import ForwardIcon from '@material-ui/icons/Forward'
import RemoveIcon from '@material-ui/icons/Remove'
import Zoom from '@material-ui/core/Zoom'
import ls from 'local-storage'
import { LazyLoadImage } from 'components'
import {isMobileOnly} from 'react-device-detect'

import clsx from 'clsx'
import { deepOrange, deepPurple, lightBlue } from '@material-ui/core/colors'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    minWidth: 550,
  },
  cardContentRoot: {
    padding: isMobileOnly ? 8 : 16
  },
  paper: {
    margin: 'auto',
    maxWidth: 680,
    height: '80px'
  },
  upIcon: {
    transform: 'rotate(-90deg)',
    WebkitTextStroke: '1px',
    WebkitTextStrokeColor: 'black',
  },
  downIcon: {
    transform: 'rotate(90deg)',
  },
  orangeColor: {
    color: deepOrange[500],
    borderColor: deepOrange[500],
  },
  purpleColor: {
    color: deepPurple[300],
    borderColor: deepPurple[300]
  },
  backgroundColor: {
    color: theme.palette.primary.dark
  },
  rankColor: {
    color: lightBlue['A400'],
    borderColor: lightBlue['A400'],
    backgroundColor: 'rgba(0,176,255,0.2)'
  },
}))


const desktopStyles = makeStyles(theme => ({
  card: {
    display: 'flex',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 0,
    maxWidth: 560,
    maxHeight: 240,
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%'
  },
  content: {
    flex: '1 0 auto',
  },
  cover: {
    width: isMobileOnly ? 105 : 170,
  },
  hr: {
    marginTop: 5,
    borderColor: theme.palette.primary.dark
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: isMobileOnly ? 0 : theme.spacing(1),
    paddingBottom: isMobileOnly ? 0 : theme.spacing(1),
  },
  squareChip: {
    borderRadius: 0,
    marginLeft: isMobileOnly ? 5 : theme.spacing(.5),
    // marginRight: isMobileOnly ? 20 : theme.spacing(.5),
    marginBottom: isMobileOnly ? 1 : theme.spacing(.5),
    marginTop: isMobileOnly ? 0 : theme.spacing(.5),
    minWidth: 80,
    height: isMobileOnly ? 28 : 31,
  },
  titleFont: {
    lineHeight: 1,
    fontSize: isMobileOnly ? 14 : 18
  },
  episodeFont: {
    fontSize: isMobileOnly ? 14 : 16
  },
  positionChip: {
    borderRadius: 0,
    margin: isMobileOnly ? 0 : theme.spacing(.5),
    fontSize: 28,
    width: 70,
    height: isMobileOnly ? 50 : 70,
  },
  positionChangeChip: {
    borderRadius: 0,
    margin: isMobileOnly ? 0 : theme.spacing(0.5),
    marginTop: isMobileOnly ? 2 : theme.spacing(0.5),
    marginBottom: isMobileOnly ? 1 : theme.spacing(0.5),
    width: 70,
    height: isMobileOnly ? 34 : 31
  },
  chip: {
    borderRadius: 5,
    margin: isMobileOnly ? 10 : theme.spacing(0.5)
  },
  chipRalMal: {
    width: isMobileOnly ? 117 : 123,
    margin: isMobileOnly ? 0 : theme.spacing(0.5),
  },
  chipContainer: {
    // height: 39
  },
  statsContainer: {
    paddingTop: 5,
  },
  episode: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
}))

const LightTooltip = withStyles(theme => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
}))(Tooltip)

//eslint-disable-next-line react/jsx-max-props-per-line
const AnimeRankingResult = (props) => {
  const classes = useStyles()
  const desktop = desktopStyles()

  let {
    result,
    title,
    banner,
    pos,
    posPrevious,
    score, 
    scorePrevious,
    commentCount,
    commentCountPrevious,
    episode,
    malScore,
    malScorePrevious, 
    ralScore,
    ralScorePrevious,
    pollScore,
    pollScorePrevious,
    setAnimeSelection,
    openKarmaGraphModal,
    openRpGraphModal,
  } = props
  
  const posChange = pos - posPrevious
  const scoreChange = score - scorePrevious
  // eslint-disable-next-line
  const pollScoreChange = pollScore - pollScorePrevious
  const commentCountChange = commentCount - commentCountPrevious

  const handleSelection = (id, showId, assets, title) => {
    setAnimeSelection({id, showId, assets, title})
  }

  const posDirection = (!posPrevious && posPrevious !== 0) || pos === posPrevious ? 'none' : pos < posPrevious ? 'up' : 'down'

  const scoreChangeDirection = !scorePrevious || score === scorePrevious ? 'none' : score < scorePrevious ? 'down' : 'up'
  const commentCountChangeDirection = !commentCount || commentCount === commentCountPrevious ? 'none' : commentCount < commentCountPrevious ? 'down' : 'up'
  const redditPollScoreDirection = !pollScorePrevious || pollScore === pollScorePrevious ? 'none' : pollScore < pollScorePrevious ? 'down' : 'up'
  const malScoreDirection = !malScorePrevious || malScore === malScorePrevious ? 'none' : malScore < malScorePrevious ? 'down' : 'up'
  const ralScoreDirection = !ralScorePrevious || ralScore === ralScorePrevious ? 'none' : ralScore < ralScorePrevious ? 'down' : 'up'
  
  const seasonId = result.seasonId
  const showId = result.show.id

  const scoreChangeIcon = scoreChangeDirection === 'up' 
    ? <KeyboardArrowUpIcon className={classes.orangeColor}/> 
    : scoreChangeDirection === 'down' 
      ? <KeyboardArrowDownIcon className={classes.purpleColor}/>
      : null

  const redditPollScoreIcon = redditPollScoreDirection === 'up' 
    ? <KeyboardArrowUpIcon className={classes.orangeColor}/> 
    : redditPollScoreDirection === 'down' 
      ? <KeyboardArrowDownIcon className={classes.purpleColor}/>
      : null

  const commentCountChangeIcon = commentCountChangeDirection === 'up' 
    ? <KeyboardArrowUpIcon className={classes.orangeColor}/> 
    : commentCountChangeDirection === 'down' 
      ? <KeyboardArrowDownIcon className={classes.purpleColor}/>
      : null

  const posChangeIcon = posDirection === 'up' 
    ? <ForwardIcon className={clsx({[classes.upIcon]: true})}/> 
    : posDirection === 'down' 
      ? <ForwardIcon className={clsx({[classes.downIcon]: true})}/>
      : <RemoveIcon/>

  function formatZeroes(number) {
    if (number < 10) return `00${number}`
    if (number < 100) return `0${number}`
    return number
  }

  const modernCardStyle = ls.get('modernCardStyle')
  const posterUrl = result.assets && result.assets[0].s3_poster_compressed ? `https://cdn.animetrics.co/${result.assets[0].s3_poster_compressed}` : 'https://cdn.animetrics.co/animetrics/missing_poster_art.png'
  return (
    <Grid
      item
      xs={12}
    >
        {modernCardStyle &&
          <Card className={clsx(desktop.card)}>
            <div
              onClick={() => handleSelection(result.result.id, result.show.id, result.assets, title)}
              style={{flexGrow: 0, cursor: 'pointer'}}
            >
              <CardMedia
                title="Poster Art"
              >
                <LazyLoadImage
                  verticalOffset={400}
                  width={isMobileOnly ? 105 : 170}
                  loadHeight={isMobileOnly ? 130 : 200}
                  src={posterUrl}
                  alt="Poster art"
                  className={desktop.cover}
                  key={posterUrl}
                />
              </CardMedia>
            </div>
            <div className={desktop.details}>
              <CardContent className={classes.cardContentRoot}>
                <Grid container>
                  <Grid container>
                    <Grid
                      item
                      xs={isMobileOnly ? 7 : 9}
                    >
                      <Typography
                        className={desktop.titleFont}
                        component="h6"
                        variant="h6"
                      >
                        {title}
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={isMobileOnly ? 5 : 3}
                    >
                      <Typography
                        className={desktop.episodeFont}
                        align="right"
                        color="primary"
                        variant="subtitle1"
                      >
                        {`Episode ${episode}`}
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                    >
                      <hr className={desktop.hr}/>
                    </Grid>
                  </Grid>
                  <Grid
                    className={desktop.statsContainer}
                    container
                    item
                    xs={isMobileOnly ? 11 : 9}
                  >
                    <Grid
                      item
                      xs
                    >
                      <LightTooltip
                        enterDelay={500}
                        placement="left"
                        title="Current Rank"
                        TransitionComponent={Zoom}
                      >
                        <Chip
                          className={clsx({[desktop.positionChip]: true, [classes.rankColor]: true})}
                          label={pos + 1}
                          variant="outlined"
                        />
                      </LightTooltip>
                      <LightTooltip
                        enterDelay={500}
                        placement="left"
                        title="Rank Change"
                        TransitionComponent={Zoom}
                      >
                        <Chip
                          avatar={posChangeIcon}
                          className={clsx({[desktop.positionChangeChip]: true, [classes.orangeColor]: posDirection === 'up', [classes.purpleColor]: posDirection === 'down'})}
                          label={!isNaN(posChange) ? Math.abs(posChange) : ''}
                          variant="outlined"
                        />
                      </LightTooltip>
                    </Grid>
                    <Grid
                      item
                      style={{marginLeft: isMobileOnly ? 0 : -10}}
                      xs={4}
                    >
                      <Grid className={desktop.chipContainer}>
                        <LightTooltip
                          enterDelay={500}
                          placement={scoreChangeIcon ? 'top':'right'}
                          title="Karma Score"
                          TransitionComponent={Zoom}
                        >
                          <Chip
                            avatar={<ScoreIcon />}
                            className={clsx({[desktop.squareChip]: true, [classes.rankColor]: true})}
                            label={score}
                            variant="outlined"
                            onClick={() => openKarmaGraphModal(seasonId, showId)}
                          />
                        </LightTooltip>
                      </Grid>
                      <Grid className={desktop.chipContainer}>
                        <LightTooltip
                          enterDelay={500}
                          placement={redditPollScoreIcon ? 'top':'right'}
                          title="Episode Poll Score"
                          TransitionComponent={Zoom}
                        >
                          <Chip
                            avatar={<PollIcon className={clsx({[classes.orangeColor]: redditPollScoreDirection === 'up', [classes.purpleColor]: redditPollScoreDirection === 'down'})}/>}
                            className={clsx({[desktop.squareChip]: true})}
                            label={pollScore > 0 ? pollScore.toFixed(2) : '-----'}
                            variant="outlined"
                            onClick={() => openRpGraphModal(seasonId, showId)}
                          />
                        </LightTooltip>
                      </Grid>
                      <Grid className={desktop.chipContainer}>
                        <LightTooltip
                          enterDelay={500}
                          placement={commentCountChangeIcon ? 'top':'right'}
                          title="Discussion Comment Count"
                          TransitionComponent={Zoom}
                        >
                          <Chip
                            avatar={<ForumIcon/>}
                            className={clsx({[desktop.squareChip]: true})}
                            label={commentCount}
                            variant="outlined"
                          />
                        </LightTooltip>
                      </Grid>

                    </Grid>
                    <Grid
                      item
                      xs
                    >
                      <Grid className={desktop.chipContainer}>
                        <LightTooltip
                          enterDelay={500}
                          placement="right"
                          title="Score Change"
                          TransitionComponent={Zoom}
                        >
                          <Chip
                            avatar={scoreChangeDirection === 'none' ? <RemoveIcon/> : scoreChangeIcon}
                            className={clsx({[desktop.squareChip]: true, [classes.orangeColor]: scoreChangeDirection === 'up', [classes.purpleColor]: scoreChangeDirection === 'down'})}
                            label={scoreChangeDirection === 'none' ? '000' : formatZeroes(Math.abs(scoreChange))}
                            variant="outlined"
                          />
                        </LightTooltip>
                      </Grid>
                      <Grid className={desktop.chipContainer}>
                        <LightTooltip
                          enterDelay={500}
                          placement="right"
                          title="Poll Score Change"
                          TransitionComponent={Zoom}
                        >
                          <Chip
                            avatar={redditPollScoreDirection === 'none' ? <RemoveIcon/> : redditPollScoreIcon}
                            className={clsx({[desktop.squareChip]: true, [classes.orangeColor]: redditPollScoreDirection === 'up', [classes.purpleColor]: redditPollScoreDirection === 'down'})}
                            label={redditPollScoreDirection === 'none' ? '000' : Math.abs(pollScoreChange).toFixed(2)}
                            variant="outlined"
                          />
                        </LightTooltip>
                      </Grid>
                      <Grid className={desktop.chipContainer}>
                        <LightTooltip
                          enterDelay={500}
                          placement="right"
                          title="Comment Count Change"
                          TransitionComponent={Zoom}
                        >
                          <Chip
                            avatar={commentCountChangeDirection === 'none' ? <RemoveIcon/> : commentCountChangeIcon}
                            className={clsx({[desktop.squareChip]: true, [classes.orangeColor]: commentCountChangeDirection === 'up', [classes.purpleColor]: commentCountChangeDirection === 'down'})}
                            label={commentCountChangeDirection === 'none' ? '000' : formatZeroes(Math.abs(commentCountChange))}
                            variant="outlined"
                          />
                        </LightTooltip>
                      </Grid>
                    </Grid>
                    <Grid container>
                      <Grid
                        item
                        xs={12}
                      >
                        <LightTooltip
                          enterDelay={500}
                          placement="bottom"
                          title="MyAnimeList Score"
                          TransitionComponent={Zoom}
                        >
                          <Chip
                            avatar={<Avatar
                              className={clsx({[classes.backgroundColor]: true, [classes.orangeColor]: malScoreDirection === 'up', [classes.purpleColor]: malScoreDirection === 'down'})}
                              variant="square"
                            >M</Avatar>}
                            className={clsx({[desktop.squareChip]: true, [desktop.chipRalMal]: true, [classes.orangeColor]: malScoreDirection === 'up', [classes.purpleColor]: malScoreDirection === 'down'})}
                            label={malScore > 0 ? malScore : '-----'}
                            variant="outlined"
                          />
                        </LightTooltip>
                        <LightTooltip
                          enterDelay={500}
                          placement="bottom"
                          title="Reddit MyAnimeList Score"
                          TransitionComponent={Zoom}
                        >
                          <Chip
                            avatar={<Avatar
                              className={clsx({[classes.orangeColor]: ralScoreDirection === 'up', [classes.purpleColor]: ralScoreDirection === 'down'})}
                              variant="square"
                            >R</Avatar>}
                            className={clsx({[desktop.squareChip]: true, [desktop.chipRalMal]: true, [classes.orangeColor]: ralScoreDirection === 'up', [classes.purpleColor]: ralScoreDirection === 'down'})}
                            label={ralScore > 0 ? ralScore : '-----'}
                            variant="outlined"
                          />
                        </LightTooltip>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </CardContent>
            </div>
          </Card>
        }
        {!modernCardStyle && 
          <Grid item xs={12}>
            <div 
              className={clsx(classes.root, 'grow')}
              onClick={() => handleSelection(result.result.id, result.show.id, result.assets, title)}
              style={{flexGrow: 0, cursor: 'pointer'}}
            >
              <Paper
                className={classes.paper}
                square
              >
                <Grid container>
                  <ResultPosition 
                    direction={posDirection} 
                    position={pos} 
                    positionChange={posChange}
                  />
                  <ResultDetails 
                    banner={banner} 
                    episode={episode} 
                    rpScore={pollScore}
                    rpScoreDirection={redditPollScoreDirection}
                    score={score}
                    scoreChange={scoreChange}
                    scoreChangeDirection={scoreChangeDirection}
                    title={title}
                  />
                  <ResultComments count={commentCount}/>
                  <ResultScores 
                    malScore={malScore} 
                    malScoreDirection={malScoreDirection}
                    ralScore={ralScore}
                    ralScoreDirection={ralScoreDirection}
                  />
                </Grid>
              </Paper>
            </div>
          </Grid>
        }
    </Grid>

  )
}

export default AnimeRankingResult
