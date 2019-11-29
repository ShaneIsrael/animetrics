import React from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/styles'
import { deepPurple, deepOrange } from '@material-ui/core/colors'
import { Grid, Paper, Typography } from '@material-ui/core'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    minWidth: 680,
  },
  backgroundPrimary: {
    backgroundColor: '#294e8a'
  },
  orangeColor: {
    color: deepOrange[500],
  },
  purpleColor: {
    color: deepPurple[300]
  },
  transparent: {
    backgroundColor: 'rgba(0, 0, 0, 0)'
  },
  scoreChangePaper: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    textAlign: 'center',
    marginTop: 15,
    height: '25px',
    fontWeight: 600,
    fontSize: 20,
  },
  scorePaper: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    textAlign: 'center',
    height: '55px',
    WebkitTextStrokeColor: 'black',
    WebkitTextStroke: '2px',
    fontWeight: 600,
    fontSize: 24
  },
  titlePaper: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    textAlign: 'center',
    height: '55px',
    paddingRight: 5
  },
  malScorePaper: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    textAlign: 'center',
    height: '25px',
    fontWeight: 600,
    fontSize: 20
  },
  fontBase: {
    color: 'white',
    fontFamily: 'Impact, Oswald',
    fontWeight: 400,
    fontStyle: 'italic'
  },
  titleFont: {
    WebkitTextStrokeColor: 'black',
    WebkitTextStroke: '1px',
    fontFamily: 'Oswald',
    fontWeight: 900,
    flexWrap: 'wrap',
    fontSize: 20,
    lineHeight: 1,
    fontStyle: 'italic'
  },
  episodeFont: {
    WebkitTextStrokeColor: 'black',
    WebkitTextStroke: '1px',
    fontFamily: 'Impact, Oswald',
    fontWeight: 'lighter',
    fontSize: 16,
    fontStyle: 'italic'
  },
  rpFont: {
    WebkitTextStrokeColor: 'black',
    WebkitTextStroke: '1px',
    fontFamily: 'Arial, Helvetica, sans-serif',
    fontWeight: 800,
    fontSize: 16,
  },
  rpFontPrimary: {
    color: '#294e8a',
    WebkitTextStrokeColor: 'black',
    WebkitTextStroke: '0.3px',
    fontFamily: 'Arial, Helvetica, sans-serif',
    fontWeight: 800,
    fontSize: 16,
    fontStyle: 'italic'
  },
  scoreChangeFont: {
    WebkitTextStrokeColor: 'black',
    WebkitTextStroke: '1px',
    fontFamily: 'Impact, Oswald',
    fontWeight: 'lighter',
    fontSize: 15,
    // fontStyle: 'italic'
  },
}))

const ResultDetails = (props) => {
  const classes = useStyles()

  const {score, scoreChange, scoreChangeDirection, rpScore, title, episode, banner} = props
  
  return (
    <Grid item xs={8}>
      <Paper elevation={0} square={true} style={{height: '80px', background: `linear-gradient(to left, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 40%), linear-gradient(to right, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 40%), url(${banner})`, backgroundSize: 'cover'}}>
        <Grid className={classes.root} container>
          <Grid item xs={2}>
            <Paper className={classes.scoreChangePaper} elevation={0} square={true}>
              <Typography className={clsx(classes.fontBase, classes.scoreChangeFont)} align="left" variant="subtitle2">
                {scoreChangeDirection === 'up' && <KeyboardArrowUpIcon className={classes.orangeColor}/>}
                {scoreChangeDirection === 'down' && <KeyboardArrowDownIcon className={classes.purpleColor}/>}
                {!Number(scoreChange) || scoreChangeDirection === 'none' ? '' : Math.abs(scoreChange)}
              </Typography>
            </Paper>
            <Paper className={classes.scorePaper} elevation={0} square={true}>
              <Typography className={classes.fontBase} align="left" variant="h1">
                {score}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper className={classes.titlePaper} elevation={0} square={true}>
              <Typography className={clsx(classes.fontBase, classes.titleFont)} align="right" variant="h5">
                {title.toUpperCase()}
              </Typography>
            </Paper>
            <Paper className={classes.malScorePaper} elevation={0} square={true}>
              <Grid style={{marginBottom: 0}} container>
                <Grid item xs={9}>
                  <Paper className={classes.transparent} elevation={0} square={true}>
                    <Typography style={{paddingTop: 5, marginRight: 5}} className={clsx(classes.fontBase, classes.episodeFont)} align="right" variant="h5">
                      {`EPISODE ${episode}`}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={3} className={classes.backgroundPrimary}>
                  <Paper className={classes.backgroundPrimary} elevation={0} square={true}>
                    <Typography style={{paddingRight: 2, paddingLeft: 2, border: '0.2px solid white', background: 'white'}} display="inline" className={clsx({[classes.fontBase]:true, [classes.rpFontPrimary]: true})}>
                    RP
                    </Typography>
                    <Typography style={{paddingRight: 6, paddingLeft: 6, border: '0.2px solid white', backgroundColor: '#294e8a'}} display="inline" className={clsx({[classes.fontBase]:true, [classes.rpFont]: true})}>
                      {!rpScore || rpScore === 0 ? '------' : rpScore}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  )
}

export default ResultDetails