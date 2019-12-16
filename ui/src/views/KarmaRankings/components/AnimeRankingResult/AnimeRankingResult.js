import React from 'react'
import { makeStyles, useTheme } from '@material-ui/styles'
import { Grid, Paper, Hidden, Card, CardContent, Typography, IconButton, CardMedia, Avatar } from '@material-ui/core'
import { isMobile } from 'react-device-detect'
import Chip from '@material-ui/core/Chip'
import ResultPosition from './ResultPosition/ResultPosition'
import ResultDetails from './ResultDetails/ResultDetails'
import ResultComments from './ResultComments/ResultComments'
import ResultScores from './ResultScores/ResultScores'
import ScoreIcon from '@material-ui/icons/Score'
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'

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
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 0,
    width: 400,
    height: 150,
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
    width: 125,
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  playIcon: {
    height: 38,
    width: 38,
  },
  mobileTitleFont: {
    fontSize: 14,
  },
  chips: {
    // marginTop: theme.spacing(0.5)
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
  orangeColor: {
    color: deepOrange[500],
    borderColor: deepOrange[500],
  },
  purpleColor: {
    color: deepPurple[300],
    borderColor: deepPurple[300]
  },
}))
//eslint-disable-next-line react/jsx-max-props-per-line
const AnimeRankingResult = (props) => {
  const classes = useStyles()
  const theme = useTheme()

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
  const scoreDirection = !scorePrevious || score === scorePrevious ? 'none' : score < scorePrevious ? 'down' : 'up'

  const scoreChangeDirection = !scorePrevious || score === scorePrevious ? 'none' : score < scorePrevious ? 'down' : 'up'

  let scoreChangeIcon = (scoreChangeDirection === 'up' ? <KeyboardArrowUpIcon className={clsx({[classes.orangeColor]: scoreChangeDirection === 'up', [classes.purpleColor]: scoreChangeDirection === 'down'})}/> : scoreChangeDirection === 'down' ? <KeyboardArrowDownIcon className={clsx({[classes.orangeColor]: scoreChangeDirection === 'up', [classes.purpleColor]: scoreChangeDirection === 'down'})}/> : null)
  

  return (
    <div
      onClick={() => handleSelection(result.result.id, result.show.id, result.assets, title)}
      style={{margin: 2, flexGrow: 0, cursor: 'pointer'}}
    >
      <Hidden
        implementation="js"
        mdUp
      >
        <Card className={classes.card}>
          <CardMedia
            className={classes.cover}
            image={'https://animetrics.sfo2.cdn.digitaloceanspaces.com/anime_assets/0d291ad9-5866-47b9-96b3-31fb8cd78118_poster.jpg'}
            title="Show poster art"
          />
          <div className={classes.details}>
            <CardContent className={classes.content}>
              <Chip
                className={clsx({[classes.squareChip]: true, [classes.chipPositionFont]: true, [classes.orangeColor]: posDirection === 'up', [classes.purpleColor]: posDirection === 'down'})}
                // avatar={<ScoreIcon className={clsx({[classes.orangeColor]: posDirection === 'up', [classes.purpleColor]: posDirection === 'down'})}/>}
                label={pos}
                variant="outlined"
                size="small"
                color=""
              />
              <Typography className={classes.mobileTitleFont} display={'inline'} component="h6" variant="h6">
                {title}
              </Typography>
              <hr/>
              <div className={classes.chips}>
                <Chip
                  className={clsx({[classes.chip]: true, [classes.orangeColor]: scoreDirection === 'up', [classes.purpleColor]: scoreDirection === 'down'})}
                  avatar={<ScoreIcon className={clsx({[classes.orangeColor]: scoreDirection === 'up', [classes.purpleColor]: scoreDirection === 'down'})}/>}
                  label={score}
                  variant="outlined"
                  size="small"
                  color=""
                />
                {scoreChangeIcon && 
                  <Chip
                    className={clsx({[classes.chip]: true, [classes.orangeColor]: scoreChangeDirection === 'up', [classes.purpleColor]: scoreChangeDirection === 'down'})}
                    avatar={scoreChangeIcon}
                    label={Math.abs(scoreChange)}
                    variant="outlined"
                    size="small"
                    color=""
                  />
                }
              </div>
            </CardContent>
            <div className={classes.controls}>
              {/* <IconButton aria-label="previous">
                {theme.direction === 'rtl' ? <SkipNextIcon /> : <SkipPreviousIcon />}
              </IconButton>
              <IconButton aria-label="play/pause">
                <PlayArrowIcon className={classes.playIcon} />
              </IconButton>
              <IconButton aria-label="next">
                {theme.direction === 'rtl' ? <SkipPreviousIcon /> : <SkipNextIcon />}
              </IconButton> */}
            </div>
          </div>

        </Card>
      </Hidden>
      <Hidden
        implementation="js"
        smDown
      >
        <div className={clsx(classes.root, 'grow')}>
          <Paper
            className={classes.paper}
            square
          >
            <Grid container>
              <ResultPosition 
                direction={!posPrevious || pos === posPrevious ? 'none' : pos < posPrevious ? 'up' : 'down'} 
                position={pos} 
                positionChange={posChange}
              />
              <ResultDetails 
                banner={banner} 
                episode={episode} 
                rpScore={pollScore}
                rpScoreDirection={!pollScorePrevious || pollScore === pollScorePrevious ? 'none' : pollScore < pollScorePrevious ? 'down' : 'up'}
                score={score}
                scoreChange={scoreChange}
                scoreChangeDirection={!scorePrevious || score === scorePrevious ? 'none' : score < scorePrevious ? 'down' : 'up'}
                title={title}
              />
              <ResultComments count={commentCount}/>
              <ResultScores 
                malScore={malScore} 
                malScoreDirection={!malScorePrevious || malScore === malScorePrevious ? 'none' : malScore < malScorePrevious ? 'down' : 'up'}
                ralScore={ralScore}
                ralScoreDirection={!ralScorePrevious || ralScore === ralScorePrevious ? 'none' : ralScore < ralScorePrevious ? 'down' : 'up'}
              />
            </Grid>
          </Paper>
        </div>
      </Hidden>
    </div>
  )
}

export default AnimeRankingResult
