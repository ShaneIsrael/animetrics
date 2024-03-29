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
    paddingTop: 32,
    paddingLeft: 8,
    paddingRight: 8,
    height: 150 ,
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
    paddingLeft: 24,
    paddingRight: 24,
    paddingTop: 20,
    fontSize: 18,
    fontWeight: 100
  },
  recentAiredSection: {
    marginTop: 25,
    marginLeft: 32,
    marginRight: 32
  },
  recentAiredFont: {
    color: theme.palette.secondary.dark,
    fontWeight: 300,
    fontSize: 18
  },
}))

const Dashboard = () => {
  const classes = useStyles()

  const [recentDiscussions, setRecentDiscussions] = React.useState(null)

  useEffect(() => {
    async function fetch() {
      try {
        const discussions = (await DiscussionService.getRecentDiscussions()).data
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
                  <img
                    style={{cursor: 'pointer'}}
                    alt="Animetrics Logo"
                    className={classes.logo}
                    height={96}
                    src="/images/logos/logo_full_light_blue_wlb_stroke.png"
                    onClick={() => window.location.reload()}
                  />
                </Grid>
                <Grid
                  item
                  xs
                />
                <Grid item>
                  <Link
                    className={classes.link}
                    href="/anime/search"
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
                  <RouterLink to="/">
                    <img
                      alt="Animetrics Logo"
                      className={classes.logo}
                      height={72}
                      src="/images/logos/logo_full_light_blue_wlb_stroke.png"
                    />
                  </RouterLink>
                </Grid>
                <Grid item>
                  <Link
                    className={classes.linkMobile}
                    href="/anime/search"
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
          <Typography component="h1" className={classes.subheader}>Visualizing Anime metrics to gauge popularity through the Reddit community.</Typography>
          <div className={classes.recentAiredSection}>
            <Grid container>
              <Typography style={{paddingLeft: 40}} className={classes.recentAiredFont}>Recently Aired Discussions</Typography>
            </Grid>
            <Grid container justify="center">
              {recentDiscussions && recentDiscussions.map((elem, index) => {
                return <DiscussionCard title={elem.Show.english_title ? elem.Show.english_title : elem.Show.title} episode={elem.episode} poster={elem.Show.Assets[0].s3_poster_compressed} href={elem.post_url} key={index}/>
              })}
            </Grid>
          </div>
        </Hidden>
        <Hidden
          implementation="js"
          mdUp
        >
          <Typography component="h1" className={classes.subheaderMobile}>Visualizing Anime metrics to gauge popularity through the Reddit community.</Typography>
          <div className={classes.recentAiredSection}>
            <Grid container justify="center">
              <Typography className={classes.recentAiredFont}>Recently Aired Discussions</Typography>
            </Grid>
            <Grid container justify="center">
              {recentDiscussions && recentDiscussions.map((elem, index) => {
                return <DiscussionCard title={elem.Show.english_title ? elem.Show.english_title : elem.Show.title} episode={elem.episode} poster={elem.Show.Assets[0].s3_poster_compressed} href={elem.post_url} key={index}/>
              })}
            </Grid>
          </div>
        </Hidden>
      </div>
    </div>
  )
}

export default Dashboard
