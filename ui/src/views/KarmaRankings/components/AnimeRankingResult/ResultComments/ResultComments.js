import React from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/styles'
import { Grid, Paper, Typography } from '@material-ui/core'
import ChatBubbleIcon from '@material-ui/icons/ChatBubble'


const useStyles = makeStyles(theme => ({
  backgroundPrimary: {
    backgroundColor: '#294e8a'
  },
  commentCountPaper: {
    backgroundColor: 'rgba(255, 0, 255, 0)',
    textAlign: 'center',
    height: '80px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRight: '1px solid #3d629e',
  },
  commentCountFont: {
    color: '#294e8a',
    fontFamily: 'Impact, Oswald',
    fontSize: 18,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  commentCount: {
    textAlign: 'center', 
    position: 'absolute'
  },
  commentIcon: {
    marginTop: '5px',
    color: 'white',
    fontSize: '60px'
  }
}))

const ResultComments = (props) => {
  const classes = useStyles()

  const {count} = props
  
  return (
    <Grid item xs={1} className={classes.backgroundPrimary}>
      <Paper square={true} className={clsx(classes.backgroundPrimary, classes.commentCountPaper)} elevation={0}>
        <Typography className={classes.commentCountFont} align="left" variant="h6">
          <ChatBubbleIcon className={classes.commentIcon} />
          <div className={classes.commentCount}>
            {count}
          </div>
        </Typography>
      </Paper>
    </Grid>
  )
}

export default ResultComments