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
  // eslint-disable-next-line
  const pollScoreChange = pollScore - pollScorePrevious
  
  // if (pos === 0) {
  //   setAnimeSelection({id: result.id, showId: result.showId, banner, title})
  // }
  const handleSelection = (id, showId, show, title) => {
    setAnimeSelection({id, showId, show, title})
  }
  return (
    <div
      onClick={() => handleSelection(result.result.id, result.show.id, result.show, title)}
      style={{margin: 2, flexGrow: 0, cursor: 'pointer'}}
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
    </div>
  )
}

export default AnimeRankingResult
