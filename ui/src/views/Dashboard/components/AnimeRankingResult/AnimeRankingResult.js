import React from 'react'
import { makeStyles } from '@material-ui/styles'
import { Grid, Paper } from '@material-ui/core'
import { isMobile } from 'react-device-detect'
import ResultPosition from './ResultPosition/ResultPosition'
import ResultDetails from './ResultDetails/ResultDetails'
import ResultComments from './ResultComments/ResultComments'
import ResultScores from './ResultScores/ResultScores'
import clsx from 'clsx'

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
  const malScoreChange = malScore - malScorePrevious
  const ralScoreChange = ralScore - ralScorePrevious
  // eslint-disable-next-line
  const pollScoreChange = pollScore - pollScorePrevious

  // if (pos === 0) {
  //   setAnimeSelection({id: result.id, showId: result.showId, banner, title})
  // }
  const handleSelection = (id, showId, banner, title) => {
    setAnimeSelection({id, showId, banner, title})
  }
  return (
    <div onClick={() => handleSelection(result.id, result.showId, banner, title)} style={{margin: 2, flexGrow: 0, cursor: 'pointer'}}>
      <div className={clsx(classes.root, 'grow')}>
        <Paper className={classes.paper} square={true}>
          <Grid container>
            <ResultPosition 
              position={pos} 
              positionChange={posChange} 
              direction={posChange < 0 ? 'up' : posChange > 0 ? 'down' : 'none'}/>
            <ResultDetails 
              score={score} 
              scoreChange={scoreChange} 
              scoreChangeDirection={scoreChange < 0 ? 'down' : scoreChange > 0 ? 'up' : 'none'}
              rpScore={pollScore}
              title={title}
              episode={episode}
              banner={banner}
            />
            <ResultComments count={commentCount}/>
            <ResultScores 
              malScore={malScore} 
              ralScore={ralScore}
              malScoreDirection={malScoreChange < 0 ? 'down' : malScoreChange > 0 ? 'up' : 'none'}
              ralScoreDirection={ralScoreChange < 0 ? 'down' : ralScoreChange > 0 ? 'up' : 'none'}
            />
          </Grid>
        </Paper>
      </div>
    </div>
  )
}

export default AnimeRankingResult
