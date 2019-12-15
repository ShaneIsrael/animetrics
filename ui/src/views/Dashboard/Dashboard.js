/* eslint-disable react/no-multi-comp */
import React, {useEffect} from 'react'
import { makeStyles } from '@material-ui/styles'
import { Link as RouterLink } from 'react-router-dom'
import clsx from 'clsx'
import { AppBar, Toolbar, Grid, Link, Typography, Hidden } from '@material-ui/core'

import { DiscussionCard } from 'components'
import { DiscussionService } from 'services'

const lightColor = 'rgba(255, 255, 255, 0.4)';


const useStyles = makeStyles(theme => ({
  root: {
    // padding: theme.spacing(0.5),
    margin: 'auto',
    fontFamily: 'Roboto',
    backgroundColor: '#111b29'
  },
  header: {
    padding: 48,
    height: 112,
    backgroundColor: 'rgba(0,0,0,0)',
    boxShadow: 'none'
  },
  headerMobile: {
    padding: 32,
    height: 200 ,
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
  linkMobile: {
    textDecoration: 'none',
    padding: 0,
    fontSize: 20,
    color: lightColor,
    '&:hover': {
      color: theme.palette.primary.light,
      textDecoration: 'none'
    },
  },
  subheader: {
    color: theme.palette.primary.main,
    marginLeft: 72,
    fontSize: 32,
    fontWeight: 100
  },
  subheaderMobile: {
    color: theme.palette.primary.main,
    marginLeft: 48,
    fontSize: 24,
    fontWeight: 100
  },
  recentAiredSection: {
    marginTop: 50,
    marginLeft: 32,
    marginRight: 32
  },
  recentAiredFont: {
    color: theme.palette.secondary.dark,
    fontWeight: 300,
    fontSize: 24
  },
}))

const Dashboard = () => {
  const classes = useStyles()

  const [recentDiscussions, setRecentDiscussions] = React.useState(null)

  useEffect(() => {
    async function fetch() {
      try {
        const discussions = (await DiscussionService.getTodaysDiscussions()).data
        setRecentDiscussions(discussions)
      } catch (err) {
        console.log(err)
      }
    }
    fetch()
  }, [])
 
  return (
    <div className={clsx({[classes.root]: true})}>
      <div>
        <Hidden
          implementation="js"
          smDown
        >
          <AppBar
            className={clsx(classes.header)}
            position="static"
          >
            <Toolbar>

              <Grid
                alignItems="center"
                container
                spacing={6}
              >
                <Grid item>
                  <RouterLink to="/dashboard">
                    <img
                      alt="ANIRANKS Logo"
                      className={classes.logo}
                      height={96}
                      src="/images/logos/logo_full_light_blue_wlb_stroke.png"
                    />
                  </RouterLink>
                </Grid>
                <Grid
                  item
                  xs
                />
                <Grid item>
                  <Link
                    className={classes.link}
                    href="/karma-rankings"
                    variant="body2"
                  >
                    Anime Metrics
                  </Link>
                </Grid>
                <Grid item>
                  <Link
                    className={classes.link}
                    href="#"
                    variant="body2"
                  >
                    Manga Metrics
                  </Link>
                </Grid>
                <Grid
                  item
                  xs
                />
              </Grid>
            </Toolbar>
          </AppBar>
        </Hidden>
        <Hidden
          implementation="css"
          mdUp
        >
          <AppBar
            className={clsx(classes.headerMobile)}
            position="static"
          >
            <Toolbar>
              <Grid
                alignItems="center"
                container
                spacing={3}
              >
                <Grid
                  item
                  xs={12}
                >
                  <RouterLink to="/dashboard">
                    <img
                      alt="ANIRANKS Logo"
                      className={classes.logo}
                      height={96}
                      src="/images/logos/logo_full_light_blue_wlb_stroke.png"
                    />
                  </RouterLink>
                </Grid>
                <Grid item>
                  <Link
                    className={classes.linkMobile}
                    href="/karma-rankings"
                    variant="body2"
                  >
                          Anime Metrics
                  </Link>
                </Grid>
                <Grid item>
                  <Link
                    className={classes.linkMobile}
                    href="#"
                    variant="body2"
                  >
                          Manga Metrics
                  </Link>
                </Grid>
              </Grid>
            </Toolbar>
          </AppBar>
        </Hidden>
        <Hidden
          implementation="js"
          smDown
        >
          <Typography className={classes.subheader}>Visualizing Anime metrics through the Reddit community.</Typography>
        </Hidden>
        <Hidden
          implementation="js"
          mdUp
        >
          <Typography className={classes.subheaderMobile}>Visualizing Anime metrics through the Reddit community.</Typography>
        </Hidden>
      </div>
      <div className={classes.recentAiredSection}>
        <Typography className={classes.recentAiredFont}>Recently Aired Discussions</Typography>
        <Grid container>
          {recentDiscussions && recentDiscussions.map((elem, index) => {
            return <DiscussionCard title={elem.Show.title} episode={elem.episode} poster={elem.Show.Assets[0].s3_poster} href={elem.post_url} key={index}/>
          })}
        </Grid>
      </div>
    </div>
  )
}

export default Dashboard
