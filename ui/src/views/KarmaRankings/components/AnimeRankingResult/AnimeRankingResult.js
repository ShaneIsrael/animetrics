import React from 'react'
import { makeStyles, useTheme } from '@material-ui/styles'
import { Grid, Paper, Hidden, Card, CardContent, Typography, CardMedia, Avatar } from '@material-ui/core'
import Chip from '@material-ui/core/Chip'
import ResultPosition from './ResultPosition/ResultPosition'
import ResultDetails from './ResultDetails/ResultDetails'
import ResultComments from './ResultComments/ResultComments'
import ResultScores from './ResultScores/ResultScores'
import ScoreIcon from '@material-ui/icons/Score'
import ChatBubbleIcon from '@material-ui/icons/ChatBubble'
import PollIcon from '@material-ui/icons/Poll'

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
    width: 320,
    height: 150,
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

  const scoreChangeDirection = !scorePrevious || score === scorePrevious ? 'none' : score < scorePrevious ? 'down' : 'up'
  const redditPollScoreDirection = !pollScorePrevious || pollScore === pollScorePrevious ? 'none' : pollScore < pollScorePrevious ? 'down' : 'up'
  const malScoreDirection = !malScorePrevious || malScore === malScorePrevious ? 'none' : malScore < malScorePrevious ? 'down' : 'up'
  const ralScoreDirection = !ralScorePrevious || ralScore === ralScorePrevious ? 'none' : ralScore < ralScorePrevious ? 'down' : 'up'
  
  console.log(ralScoreDirection, malScoreDirection, redditPollScoreDirection)
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
            image={`https://animetrics.sfo2.cdn.digitaloceanspaces.com/${result.assets[0].s3_poster}`}
            title="Show poster art"
          />
          <div className={classes.details}>
            <CardContent className={classes.content}>
              <Chip
                className={clsx({[classes.squareChip]: true, [classes.chipPositionFont]: true, [classes.orangeColor]: posDirection === 'up', [classes.purpleColor]: posDirection === 'down'})}
                label={pos}
                variant="outlined"
                size="small"
              />
              <Typography className={classes.mobileTitleFont} display={'inline'} component="h6" variant="h6">
                {title}
              </Typography>
              <hr/>
              <div className={classes.chips}>
                <Chip
                  className={clsx({[classes.squareChip]: true})}
                  avatar={<ScoreIcon/>}
                  label={score}
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
              </div>
            </CardContent>
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
      </Hidden>
    </div>
  )
}

export default AnimeRankingResult
