import React from 'react'
import { makeStyles } from '@material-ui/styles'
import { Grid, Paper, Hidden, Card, CardContent, Typography, CardMedia, Avatar } from '@material-ui/core'
import Chip from '@material-ui/core/Chip'
import ResultPosition from './ResultPosition/ResultPosition'
import ResultDetails from './ResultDetails/ResultDetails'
import ResultComments from './ResultComments/ResultComments'
import ResultScores from './ResultScores/ResultScores'
import ScoreIcon from '@material-ui/icons/Score'
import ChatBubbleIcon from '@material-ui/icons/ChatBubble'
import PollIcon from '@material-ui/icons/Poll'
import SlideshowIcon from '@material-ui/icons/Slideshow';
import LazyLoad from 'react-lazy-load'

import clsx from 'clsx'
import { deepOrange, deepPurple } from '@material-ui/core/colors'

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
  mobileWidth: {
    maxWidth: 500
  },
  card: {
    display: 'flex',
    position: 'relative',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 0,
    width: 320,
    height: 160,
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
  orangeColor: {
    color: deepOrange[500],
    borderColor: deepOrange[500],
  },
  purpleColor: {
    color: deepPurple[300],
    borderColor: deepPurple[300]
  },
  episodeColor: {
    color: '#fff',
    borderColor: '#fff',
    backgroundColor: 'rgba(255,255,255,0.2)'
  }
}))
//eslint-disable-next-line react/jsx-max-props-per-line
const AnimeRankingResult = (props) => {
  const classes = useStyles()
  let {
    result,
    title,
    banner,
    pos,
    posPrevious,
    score, 
    scorePrevious,
    commentCount,
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


  const handleSelection = (id, showId, assets, title) => {
    setAnimeSelection({id, showId, assets, title})
  }

  const posDirection = !posPrevious || pos === posPrevious ? 'none' : pos < posPrevious ? 'up' : 'down'

  const scoreChangeDirection = !scorePrevious || score === scorePrevious ? 'none' : score < scorePrevious ? 'down' : 'up'
  const redditPollScoreDirection = !pollScorePrevious || pollScore === pollScorePrevious ? 'none' : pollScore < pollScorePrevious ? 'down' : 'up'
  const malScoreDirection = !malScorePrevious || malScore === malScorePrevious ? 'none' : malScore < malScorePrevious ? 'down' : 'up'
  const ralScoreDirection = !ralScorePrevious || ralScore === ralScorePrevious ? 'none' : ralScore < ralScorePrevious ? 'down' : 'up'
  
  return (
    <Grid item xs={12}>
      <div
        onClick={() => handleSelection(result.result.id, result.show.id, result.assets, title)}
        style={{flexGrow: 0, cursor: 'pointer'}}
      >
        <Hidden
          implementation="js"
          mdUp
        >
            <Card style={{float: 'left'}} className={classes.card}>
              <div className={classes.episode}>
                <Chip
                  className={clsx({[classes.episodePosChip]: true, [classes.chipPositionFont]: true, [classes.orangeColor]: posDirection === 'up', [classes.purpleColor]: posDirection === 'down'})}
                  label={pos + 1}
                  variant="outlined"
                  size="small"
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
                    <img alt="poster art" className={classes.cover} src={`https://animetrics.sfo2.cdn.digitaloceanspaces.com/${result.assets[0].s3_poster}`}/>
                  </LazyLoad>
                </CardMedia>
              <div className={classes.details}>
                <CardContent className={classes.content}>
                  <Typography className={classes.mobileTitleFont} display={'inline'} component="h6" variant="h6">
                    {title}
                  </Typography>
                  <hr/>
                  <Grid container>
                    <Chip
                      className={clsx({[classes.squareChip]: true, [classes.orangeColor]: scoreChangeDirection === 'up', [classes.purpleColor]: scoreChangeDirection === 'down'})}
                      avatar={<ScoreIcon className={clsx({[classes.orangeColor]: scoreChangeDirection === 'up', [classes.purpleColor]: scoreChangeDirection === 'down'})}/>}
                      label={score}
                      variant="outlined"
                      size="small"
                    />
                    <Chip
                      className={clsx({[classes.squareChip]: true, [classes.orangeColor]: redditPollScoreDirection === 'up', [classes.purpleColor]: redditPollScoreDirection === 'down'})}
                      avatar={<PollIcon className={clsx({[classes.orangeColor]: redditPollScoreDirection === 'up', [classes.purpleColor]: redditPollScoreDirection === 'down'})}/>}
                      label={pollScore}
                      variant="outlined"
                      size="small"
                    />
                    <Chip
                      className={clsx({[classes.squareChip]: true})}
                      avatar={<SlideshowIcon/>}
                      label={episode}
                      variant="outlined"
                      size="small"
                    />
                    <Chip
                      className={clsx({[classes.squareChip]: true})}
                      avatar={<ChatBubbleIcon/>}
                      label={commentCount}
                      variant="outlined"
                      size="small"
                    />
                    <Chip
                      className={clsx({[classes.squareChip]: true, [classes.orangeColor]: malScoreDirection === 'up', [classes.purpleColor]: malScoreDirection === 'down'})}
                      avatar={<Avatar variant="square" className={clsx({[classes.orangeColor]: malScoreDirection === 'up', [classes.purpleColor]: malScoreDirection === 'down'})}>M</Avatar>}
                      label={malScore > 0 ? malScore : '-----'}
                      variant="outlined"
                      size="small"
                    />
                    <Chip
                      className={clsx({[classes.squareChip]: true, [classes.orangeColor]: ralScoreDirection === 'up', [classes.purpleColor]: ralScoreDirection === 'down'})}
                      avatar={<Avatar variant="square" className={clsx({[classes.orangeColor]: ralScoreDirection === 'up', [classes.purpleColor]: ralScoreDirection === 'down'})}>R</Avatar>}
                      label={ralScore > 0 ? ralScore : '-----'}
                      variant="outlined"
                      size="small"
                    />
                  </Grid>
                </CardContent>
              </div>
            </Card>
        </Hidden>
        <Hidden
          implementation="js"
          smDown
        >
          <Grid item xs={12}>
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
          </Grid>
        </Hidden>
      </div>
    </Grid>

  )
}

export default AnimeRankingResult
