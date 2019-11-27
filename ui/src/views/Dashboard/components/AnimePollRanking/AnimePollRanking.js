import React from 'react'
import { makeStyles } from '@material-ui/styles'
import { Grid, Paper, Typography } from '@material-ui/core'
import { isMobile } from 'react-device-detect'
import clsx from 'clsx'
import { red, green, blue, deepOrange, deepPurple } from '@material-ui/core/colors'
import Avatar from '@material-ui/core/Avatar'
import RemoveIcon from '@material-ui/icons/Remove'
import ForwardIcon from '@material-ui/icons/Forward'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    minWidth: 415,
    marginBottom: '10px'
  },
  paper: {
    margin: 'auto',
    width: 400,
    height: '80px'
  },
  positionChangePaper: {
    height: '20px'
  },
  scorePaper: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    textAlign: 'right',
    height: '60px'
    // paddingRight: '10px',
  },
  avatarPaper: {
    // backgroundColor: green[400],
    paddingTop: '3px',
    height: '80px'
  },
  titlePaper: {
    paddingTop: theme.spacing(0.5),
    height: '40px'
  },
  titleFont: {
    color: 'white',
    WebkitTextStrokeColor: 'black',
    WebkitTextStroke: '0.7px',
    fontFamily: 'Impact',
    fontWeight: 'lighter',
    flexWrap: 'wrap',
    fontSize: 14,
    lineHeight: 1,
    fontStyle: 'italic'
  },
  detailsPaper: {
    height: '40px'
  },
  backgroundPrimary: {
    backgroundColor: '#294e8a'
  },
  positionChangeFont: {
    color: 'white',
    WebkitTextStroke: '.5px',
    WebkitTextStrokeColor: 'black',
    fontFamily: 'Impact, Oswald',
    fontWeight: 800,
    fontSize: 14,
    fontStyle: 'bold',
    // display: 'flex',
    alignItems: 'left',
    justifyContent: 'center',
  },
  scoreFont: {
    color: 'white',
    WebkitTextStroke: '.5px',
    WebkitTextStrokeColor: 'black',
    fontFamily: 'Impact, Oswald',
    fontWeight: 800,
    fontSize: 28,
    fontStyle: 'italic',
    paddingLeft: '10px',
    position: 'absolute',
  },
  voteFont: {
    color: 'white',
    lineHeight: 1,
    WebkitTextStrokeColor: 'black',
    WebkitTextStroke: '0.3px',
    fontFamily: 'Arial, Helvetica, sans-serif',
    fontWeight: 800,
    fontSize: 16,
  },
  voteFontPrimary: {
    color: '#294e8a',
    lineHeight: 1,
    WebkitTextStrokeColor: 'black',
    WebkitTextStroke: '0.3px',
    fontFamily: 'Arial, Helvetica, sans-serif',
    fontWeight: 800,
    fontSize: 16,
  },
  episodeFont: {
    color: 'white',
    lineHeight: 1,
    WebkitTextStrokeColor: 'black',
    WebkitTextStroke: '0.6px',
    fontFamily: 'Impact, Oswald',
    fontWeight: 'lighter',
    fontSize: 10,
    fontStyle: 'italic'
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
  },
  purpleColor: {
    color: deepPurple[300]
  },
  avatar: {
    width: 74,
    height: 74,
    margin: 'auto',
  }

}))
//eslint-disable-next-line react/jsx-max-props-per-line
const AnimePollRanking = (props) => {
  const classes = useStyles()

  let { current } = props
  

  if (current && current.title === 'Stars Align') {
    console.log(current.position, current.prevPosition)
  }
  return (
    <div className={clsx(classes.root, 'grow')}>
      <Paper
        className={classes.paper}
        square
      >
        <Grid container className={classes.backgroundPrimary}>
          <Grid
            item
            xs={2}
          >
            <Paper
              className={clsx(classes.positionChangePaper, classes.backgroundPrimary)}
              elevation={0}
              square
            >
              <Typography 
                align="left" 
                className={clsx({[classes.positionChangeFont]: true, 
                  [classes.orangeColor]: current.position < current.prevPosition, 
                  [classes.purpleColor]: current.position > current.prevPosition})} 
                variant="subtitle2"
              >
                {current.position === current.prevPosition && <RemoveIcon/>}
                {current.position !== current.prevPosition && <ForwardIcon className={clsx({[classes.upIcon]:  current.position < current.prevPosition, [classes.downIcon]: current.position > current.prevPosition})}/>}
                {current.position !== current.prevPosition && Math.abs(current.position - current.prevPosition)}
              </Typography>
            </Paper>
            <Paper
              className={clsx(classes.backgroundPrimary, classes.scorePaper)}
              elevation={0}
              square
            >
              {current.poll.score < current.prevPoll.score && <KeyboardArrowUpIcon className={classes.orangeColor}/>}
              {current.poll.score > current.prevPoll.score && <KeyboardArrowDownIcon className={classes.purpleColor}/>}
              <Typography className={clsx(classes.scoreFont)} align="right" variant="subtitle2">
                {current.poll.score}
              </Typography>
            </Paper>
          </Grid>
          <Grid
            item
            xs={3}
          >
            <Paper
              className={clsx(classes.backgroundPrimary, classes.avatarPaper)}
              elevation={0}
              square
            >
              <Avatar className={classes.avatar} src={`/images/assets/banners/${current.avatar}`} variant="rounded" />
            </Paper>
          </Grid>
          <Grid
            item
            xs={7}
          >
            <Paper
              className={clsx(classes.backgroundPrimary, classes.titlePaper)}
              elevation={0}
              square
            >
              <Typography align="left" className={clsx(classes.titleFont)} variant="h5">
                {current.title.toUpperCase()}
              </Typography>
            </Paper>
            <Paper
              className={clsx(classes.backgroundPrimary, classes.detailsPaper)}
              elevation={0}
              square
            >
              <Typography className={clsx(classes.episodeFont)} align="left" component="p">
                {`EPISODE ${current.episode}`}
              </Typography>
              <Typography style={{paddingRight: 2, paddingLeft: 2, border: '0.2px solid white', background: 'white'}} display="inline" className={clsx({[classes.fontBase]:true, [classes.voteFontPrimary]: true})}>
              V
              </Typography>
              <Typography style={{paddingRight: 6, paddingLeft: 6, border: '0.2px solid white', backgroundColor: '#294e8a'}} display="inline" className={clsx({[classes.fontBase]:true, [classes.voteFont]: true})}>
                {current.poll.votes}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </div>
  )
}

export default AnimePollRanking