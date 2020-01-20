import React from 'react'
import { Grid, Paper, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

import { LazyLoadImage } from 'components'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  card: {
    backgroundColor: 'purple'
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: 'center',
  },
  info: {
    height: '100%',
    backgroundColor: '#232f3ea8',

  },
  title: {
    padding: theme.spacing(1),
    textAlign: 'left',
    color: theme.palette.primary.main,
    backgroundColor: '#111b29c7'
  },
  synopsis: {
    padding: theme.spacing(1),
    color: 'beige'
  },
  details: {
    padding: theme.spacing(1),
    fontStyle: 'italic',
    color: theme.palette.secondary.light,
    backgroundColor: '#111b29c7'
  },
  coverImage: {
    '& > * + *': {
      margin: 0,
    },
  },
}))
export default function Header(props) {
  var classes = useStyles()

  const { animeInfo } = props

  const poster = animeInfo.Assets ? animeInfo.Assets[0].s3_poster_compressed : null
  const title = animeInfo.english_title || animeInfo.title
  const synopsis = animeInfo.synopsis
  const detailsText = animeInfo.season === 1 ? 'Season 1' : `Season ${animeInfo.season} of ${animeInfo.seriesName}`
  const missingPosterUrl = 'https://cdn.animetrics.co/animetrics/missing_poster_art.png'

  return (
    <Grid container item sm={12} spacing={1}>
      <Grid item>
        <Paper square={true} className={classes.paper}>
          <LazyLoadImage
            className={classes.coverImage}
            width={200}
            loadHeight={310}
            loadWidth={200}
            src={poster ? `https://cdn.animetrics.co/${poster}` : missingPosterUrl}
            alt="Poster art"
          />
        </Paper>
      </Grid>
      <Grid item sm>
        <Paper square={true} className={classes.info}>
          <Typography className={classes.title} variant={'h5'}>{title}</Typography>
          <Typography className={classes.details} variant={'subtitle2'}>{detailsText}</Typography>
          <Typography className={classes.synopsis} variant={'subtitle2'}>{synopsis}</Typography>
        </Paper>
      </Grid>
    </Grid>
  )
}