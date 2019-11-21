
import React from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/styles'
import { deepPurple, deepOrange } from '@material-ui/core/colors'
import { Grid, Paper, Typography } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  backgroundPrimary: {
    backgroundColor: '#294e8a'
  },
  malRatingPaper: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    textAlign: 'center',
    height: '40px',
    fontWeight: 600,
    fontSize: 12,
    borderLeft: '1px solid #3d629e',
    borderBottom: '1px solid #3d629e',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  redditRatingPaper: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    textAlign: 'center',
    height: '40px',
    fontWeight: 600,
    fontSize: 12,
    borderLeft: '1px solid #3d629e',
    borderTop: '1px solid #3d629e',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  malRalFont: {
    color: 'white',
    WebkitTextStroke: '0.5px',
    WebkitTextStrokeColor: 'black',
    fontFamily: 'Impact, Oswald',
    fontWeight: 800,
    fontSize: 20,
  },
  malRalScoreFont: {
    color: 'white',
    WebkitTextStroke: '0.3px',
    WebkitTextStrokeColor: 'black',
    fontFamily: 'Arial, Helvetica, sans-serif',
    fontWeight: 800,
    fontSize: 16,
  },
  scoreTitleMal: {
    paddingRight: 8, 
    paddingLeft: 8, 
    border: '0.2px solid white', 
    background: 'white'
  },
  scoreTitleRal: {
    paddingRight: 10, 
    paddingLeft: 10, 
    border: '0.2px solid white', 
    background: 'white'
  },
  scoreContent: {
    paddingRight: 6, 
    paddingLeft: 6, 
    border: '0.2px solid white', 
    backgroundColor: '#294e8a'
  },
  orangeColor: {
    color: deepOrange[500],
  },
  purpleColor: {
    color: deepPurple[300]
  },
}))

const ResultScores = (props) => {
  const classes = useStyles()

  const {malScore, malScoreDirection, ralScore, ralScoreDirection} = props
  
  return (
    <Grid item xs={2} className={classes.backgroundPrimary}>
      <Paper elevation={0} square={true} className={classes.malRatingPaper}>
        <Typography display="inline" className={clsx({[classes.scoreTitleMal]: true, [classes.malRalFont]: true, [classes.orangeColor]: malScoreDirection === 'up', [classes.purpleColor]: malScoreDirection === 'down'})}>M</Typography>
        <Typography display="inline" className={clsx(classes.scoreContent, classes.malRalScoreFont)}>
          {malScore}
        </Typography>  
      </Paper>
      <Paper elevation={0} square={true} className={classes.redditRatingPaper}>
        <Typography display="inline" className={clsx({[classes.scoreTitleRal]: true, [classes.malRalFont]: true, [classes.orangeColor]: ralScoreDirection === 'up', [classes.purpleColor]: ralScoreDirection === 'down'})}>R</Typography>
        <Typography display="inline" className={clsx(classes.scoreContent, classes.malRalScoreFont)}>
          {ralScore}
        </Typography>  
      </Paper>
    </Grid>
  )
}

export default ResultScores