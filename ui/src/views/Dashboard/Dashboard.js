/* eslint-disable react/no-multi-comp */
import React, {useEffect} from 'react'
import { makeStyles } from '@material-ui/styles'
import { Link as RouterLink } from 'react-router-dom'
import ReactGA from 'react-ga'
import clsx from 'clsx'
import { AppBar, Toolbar, Grid, Link, Typography } from '@material-ui/core'

ReactGA.pageview(window.location.pathname + window.location.search)

const lightColor = 'rgba(255, 255, 255, 0.4)';


const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(0.5),
    margin: 'auto',
    fontFamily: 'Roboto'
  },
  header: {
    padding: 64,
    height: 96,
    backgroundColor: 'rgba(0,0,0,0)',
    boxShadow: 'none'
  },
  logo: {
    // marginTop: theme.spacing(4)
  },
  link: {
    textDecoration: 'none',
    fontSize: 20,
    color: lightColor,
    '&:hover': {
      color: theme.palette.primary.light,
      textDecoration: 'none'
    },
  },
  subheader: {
    color: lightColor,
    marginLeft: 96,
    fontSize: 32,
    fontWeight: 100
  }
}))

const Dashboard = () => {
  const classes = useStyles()
 
  return (
    <div className={clsx({[classes.root]: true})}>
      <div>
        <AppBar
          className={clsx(classes.header)}
          position="static"
        >
          <Toolbar>
            <Grid container spacing={6} alignItems="center">
              <Grid item>
                <RouterLink to="/dashboard">
                  <img
                    alt="ANIRANKS Logo"
                    src="/images/logos/logo_full_light_blue_wlb_stroke.png"
                    height={96}
                    className={classes.logo}
                  />
                </RouterLink>
              </Grid>
              <Grid item xs />
              <Grid item>
                <Link className={classes.link} href="/karma-rankings" variant="body2">
                  Anime Metrics
                </Link>
              </Grid>
              <Grid item>
                <Link className={classes.link} href="#" variant="body2">
                  Manga Metrics
                </Link>
              </Grid>
              <Grid item xs />
            </Grid>
          </Toolbar>
        </AppBar>
        <Typography className={classes.subheader}>Visualizing Anime metrics through the Reddit community.</Typography>
      </div>
    </div>
  )
}

export default Dashboard
