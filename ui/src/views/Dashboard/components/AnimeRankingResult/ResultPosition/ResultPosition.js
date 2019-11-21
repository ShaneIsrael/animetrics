import React from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/styles'
import { deepPurple, deepOrange } from '@material-ui/core/colors'
import { Grid, Paper, Typography } from '@material-ui/core'
import RemoveIcon from '@material-ui/icons/Remove'
import ForwardIcon from '@material-ui/icons/Forward'

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: '#294e8a',
    textAlign: 'center',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  positionPaper: {
    borderBottom: '1px solid #3d629e',
  },
  positionChangePaper: {
    borderTop: '1px solid #3d629e',
  },
  positionFont: {
    color: 'white',
    WebkitTextStroke: '1px',
    WebkitTextStrokeColor: 'black',
    fontFamily: 'Impact, Oswald',
    fontWeight: 800,
    fontSize: 24,
    fontStyle: 'bold'
  },
  positionChangeFont: {
    color: 'white',
    WebkitTextStroke: '.5px',
    WebkitTextStrokeColor: 'black',
    fontFamily: 'Impact, Oswald',
    fontWeight: 800,
    fontSize: 20,
    fontStyle: 'bold',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundPrimary: {
    backgroundColor: '#294e8a'
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
}))
const ResultPosition = (props) => {
  const classes = useStyles()

  const {position, positionChange, direction} = props
  return (
    <Grid item xs={1} className={classes.backgroundPrimary}>
      <Paper elevation={0} square={true} className={clsx({[classes.root]: true, [classes.positionPaper]: true})}>
        <Typography className={classes.positionFont} variant="h1">
          {position + 1}
        </Typography>
      </Paper>
      <Paper elevation={0} square={true} className={clsx({[classes.root]: true, [classes.positionChangePaper]: true})}>
        <Typography 
          className={clsx({[classes.positionChangeFont]: true, 
                            [classes.orangeColor]: direction === 'up', 
                            [classes.purpleColor]: direction === 'down'})} 
          align="left" 
          variant="subtitle2">
          {direction === 'none' && <RemoveIcon/>}
          {direction !== 'none' && <ForwardIcon className={clsx({[classes.upIcon]: direction === 'up', [classes.downIcon]: direction === 'down'})}/>}
          {direction !== 'none' && Math.abs(positionChange)}
        </Typography>
      </Paper>
    </Grid>
  )
}

export default ResultPosition