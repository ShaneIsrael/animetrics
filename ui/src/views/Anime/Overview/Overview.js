import React from 'react'
import { Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { AnimeService } from 'services'

import Header from './components/header'

const useStyles = makeStyles(theme => ({
  card: {
    backgroundColor: 'purple'
  },
  header: {
    // backgroundColor: 'green'
  },
  stats: {
    backgroundColor: 'red'
  },
  footer: {
    backgroundColor: 'blue'
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }
}))
export default function Overview(props) {
  var classes = useStyles()
  const [ animeInfo, setAnimeInfo ] = React.useState({})

  React.useEffect(() => {
    async function fetch() {
      try {
        const info = (await AnimeService.getAnime(props.match.params['0'])).data
        if (!info) {
          return props.history.push('/404')
        }
        setAnimeInfo(info)
      } catch(err) {
        console.log(err)
      }
    }
    fetch()
  }, [setAnimeInfo])

  return (
    <React.Fragment>
      <Grid className={classes.header} container direction='column' spacing={1}>
        <Header animeInfo={animeInfo} />
      </Grid>
      <Grid className={classes.stats} container spacing={1}>

      </Grid>
      <Grid className={classes.footer} container spacing={1}>

      </Grid>
    </React.Fragment>
  )
}