/* eslint-disable react/no-multi-comp */
import React from 'react'
import { makeStyles } from '@material-ui/styles'
// eslint-disable-next-line
import { Grid, Typography, Paper } from '@material-ui/core'
import clsx from 'clsx'

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: '100%',
    maxHeight: '100%'
  },
  paper: {
    padding: theme.spacing(3, 2),
  },
}))

const Legend = () => {
  const classes = useStyles()

  return (
    <div className={clsx({[classes.root]: true})}>
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
        spacing={2}
      >
        <Grid
          item
          xs
        >
          <Paper className={classes.paper}>
            <Typography variant="h6" component="h3">
              Animetrics is a system for harvesting anime discussion data from the Reddit Anime community to use as a way to show the popularity of a series or episode on a weekly basis. 
            </Typography>
            <br/>
            <Typography component="p">
              How is this useful? An individual might watch an episode of a show and think "Man this episode sucked!" and proceed to rate it poorly on some rating site or vice versa, they think it's great and rate it highly.
              However, if that individual participated in a discussion about the episode they may change their initial opinion as people point out things they may have missed. 
            </Typography>
            <br/>
            <Typography component="p">
              By using data harvested from weekly discussions, Animetrics can display metrics based off people who participated in thoughtful discussions while also giving a visual of what the Reddit Anime community as a whole thinks of a series.
            </Typography>
          </Paper>
        </Grid>
        <Grid
          item
          xs={12}
        >
          <img alt="legend" src="https://cdn.animetrics.co/animetrics/legend.png" className={classes.root} />
        </Grid>
      </Grid>
    </div>
  )
}

export default Legend
