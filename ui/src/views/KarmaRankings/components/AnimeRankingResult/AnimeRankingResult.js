import React from 'react'
import { makeStyles, withStyles } from '@material-ui/styles'
import { Grid, Paper, Hidden, Card, CardContent, Typography, CardMedia, Avatar, Tooltip } from '@material-ui/core'
import Chip from '@material-ui/core/Chip'
import ResultPosition from './ResultPosition/ResultPosition'
import ResultDetails from './ResultDetails/ResultDetails'
import ResultComments from './ResultComments/ResultComments'
import ResultScores from './ResultScores/ResultScores'
import ScoreIcon from '@material-ui/icons/Score'
import ForumIcon from '@material-ui/icons/Forum';
import PollIcon from '@material-ui/icons/Poll'
import SlideshowIcon from '@material-ui/icons/Slideshow'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import ForwardIcon from '@material-ui/icons/Forward'
import RemoveIcon from '@material-ui/icons/Remove'
import Zoom from '@material-ui/core/Zoom'
import LazyLoad from 'react-lazy-load'

import clsx from 'clsx'
import { deepOrange, deepPurple, green, lightGreen, yellow, lightBlue } from '@material-ui/core/colors'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    minWidth: 550,
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

const mobileStyles = makeStyles(theme => ({
  mobileWidth: {
    maxWidth: 500
  },
  card: {
    display: 'flex',
    position: 'relative',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 0,
    width: 330,
    height: 180,
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  content: {
    flex: '1 0 auto',
    padding: 8,
  },
  cover: {
    width: 125,
    // marginTop: 24,
  },
  mobileTitleFont: {
    fontSize: 14,
  },
  squareChip: {
    borderRadius: 0,
    margin: theme.spacing(0.5)
  },
  chip: {
    borderRadius: 5,
    margin: theme.spacing(0.5)
  },
  chipPositionFont: {
    fontSize: 18,
    fontWeight: 600
  },
  episode: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  episodePosChip: {
    marginLeft: 0,
    marginTop: 0,
    marginRight: 0,
    borderRadius: 0,
    borderColor: '#fff'
  },
  episodeChip: {
    marginLeft: 0,
    marginTop: 0,
    marginBottom: 0,
    marginRight: 0,
  },

  episodeColor: {
    color: '#fff',
    borderColor: '#fff',
    backgroundColor: 'rgba(255,255,255,0.2)'
  }
}))

const desktopStyles = makeStyles(theme => ({
  card: {
    display: 'flex',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 0,
    width: 560,
    height: 250
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
    width: 170,
  },
  hr: {
    marginTop: 5,
    borderColor: theme.palette.primary.dark
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  squareChip: {
    borderRadius: 0,
    margin: theme.spacing(0.5),
    width: 80,
    height: 31,
  },
  titleFont: {
    lineHeight: 1
  },
  positionChip: {
    borderRadius: 0,
    margin: theme.spacing(0.5),
    fontSize: 28,
    width: 70,
    height: 70,
  },
  positionChangeChip: {
    borderRadius: 0,
    margin: theme.spacing(0.5),
    width: 70,
  },
  chip: {
    borderRadius: 5,
    margin: theme.spacing(0.5)
  },
  chipRalMal: {
    width: 121,
  },
  chipContainer: {
    height: 39
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
  const mobile = mobileStyles()
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

  // let posColorClass = {}
  // if (pos === 0) posColorClass = classes.firstPlace
  // if (pos === 1) posColorClass = classes.secondPlace
  // if (pos === 2) posColorClass = classes.thirdPlace
  return (
    <Grid
      item
      xs={12}
    >

      <Hidden
        implementation="js"
        mdUp
      >
        <div
          onClick={() => handleSelection(result.result.id, result.show.id, result.assets, title)}
          style={{flexGrow: 0, cursor: 'pointer'}}
        >
          <Card
            className={mobile.card}
            style={{float: 'left'}}
          >
            <div className={mobile.episode}>
              <Chip
                className={clsx({[mobile.episodePosChip]: true, [mobile.chipPositionFont]: true, [classes.orangeColor]: posDirection === 'up', [classes.purpleColor]: posDirection === 'down'})}
                label={pos + 1}
                size="small"
                variant="outlined"
              />
            </div>
            <CardMedia
              title="Show poster art"
            >
              <LazyLoad
                debounce={false}
                offsetVertical={400}
                width={125}
              >
                <img
                  alt="poster art"
                  className={mobile.cover}
                  src={`https://animetrics.sfo2.cdn.digitaloceanspaces.com/${result.assets[0].s3_poster}`}
                />
              </LazyLoad>
            </CardMedia>
            <div className={mobile.details}>
              <CardContent className={mobile.content}>
                <Typography
                  className={mobile.mobileTitleFont}
                  component="h6"
                  display={'inline'}
                  variant="h6"
                >
                  {title}
                </Typography>
                <hr/>
                <Grid container>
                  <Chip
                    avatar={<ScoreIcon className={clsx({[classes.orangeColor]: scoreChangeDirection === 'up', [classes.purpleColor]: scoreChangeDirection === 'down'})}/>}
                    className={clsx({[mobile.squareChip]: true, [classes.orangeColor]: scoreChangeDirection === 'up', [classes.purpleColor]: scoreChangeDirection === 'down'})}
                    label={score}
                    size="small"
                    variant="outlined"
                  />
                  <Chip
                    avatar={<PollIcon className={clsx({[classes.orangeColor]: redditPollScoreDirection === 'up', [classes.purpleColor]: redditPollScoreDirection === 'down'})}/>}
                    className={clsx({[mobile.squareChip]: true, [classes.orangeColor]: redditPollScoreDirection === 'up', [classes.purpleColor]: redditPollScoreDirection === 'down'})}
                    label={pollScore}
                    size="small"
                    variant="outlined"
                  />
                  <Chip
                    avatar={<SlideshowIcon/>}
                    className={clsx({[mobile.squareChip]: true})}
                    label={episode}
                    size="small"
                    variant="outlined"
                  />
                  <Chip
                    avatar={<ForumIcon/>}
                    className={clsx({[mobile.squareChip]: true})}
                    label={commentCount}
                    size="small"
                    variant="outlined"
                  />
                  <Chip
                    avatar={<Avatar
                      className={clsx({[classes.orangeColor]: malScoreDirection === 'up', [classes.purpleColor]: malScoreDirection === 'down'})}
                      variant="square"
                    >M</Avatar>}
                    className={clsx({[mobile.squareChip]: true, [classes.orangeColor]: malScoreDirection === 'up', [classes.purpleColor]: malScoreDirection === 'down'})}
                    label={malScore > 0 ? malScore : '-----'}
                    size="small"
                    variant="outlined"
                  />
                  <Chip
                    avatar={<Avatar
                      className={clsx({[classes.orangeColor]: ralScoreDirection === 'up', [classes.purpleColor]: ralScoreDirection === 'down'})}
                      variant="square"
                    >R</Avatar>}
                    className={clsx({[mobile.squareChip]: true, [classes.orangeColor]: ralScoreDirection === 'up', [classes.purpleColor]: ralScoreDirection === 'down'})}
                    label={ralScore > 0 ? ralScore : '-----'}
                    size="small"
                    variant="outlined"
                  />
                </Grid>
              </CardContent>
            </div>
          </Card>
        </div>
      </Hidden>
      <Hidden
        implementation="js"
        smDown
      >
        <Card className={clsx(desktop.card)}>
          <div
            onClick={() => handleSelection(result.result.id, result.show.id, result.assets, title)}
            style={{flexGrow: 0, cursor: 'pointer'}}
          >
            <CardMedia
              title="Poster Art"
            >
              <LazyLoad
                debounce={false}
                offsetVertical={400}
                width={desktop.cover}
              >
                <img
                  alt="poster art"
                  className={desktop.cover}
                  src={`https://animetrics.sfo2.cdn.digitaloceanspaces.com/${result.assets[0].s3_poster}`}
                />
              </LazyLoad>
            </CardMedia>
          </div>
          <div className={desktop.details}>
            <CardContent>
              <Grid container>
                <Grid container>
                  <Grid
                    item
                    xs={9}
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
                    xs={3}
                  >
                    <Typography
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
                >
                  <Grid
                    item
                    xs={3}
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
                    style={{marginLeft: -10}}
                    xs={3}
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
                    xs={3}
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
                      xs={10}
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
        {/* <Grid item xs={12}>
            <div className={clsx(classes.root, 'grow')}>
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
          </Grid> */}
      </Hidden>
    </Grid>

  )
}

export default AnimeRankingResult
