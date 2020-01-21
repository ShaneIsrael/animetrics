/* eslint-disable react/no-multi-comp */
import React from 'react'
import { makeStyles } from '@material-ui/styles'
// eslint-disable-next-line
import { Grid, Paper, InputLabel, FormControl, Select, MenuItem, TextField } from '@material-ui/core'
import clsx from 'clsx'
import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Typography from '@material-ui/core/Typography'
import { LazyLoadImage } from 'components'
import { AnimeService } from 'services'

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(1),
    '& > *': {
      margin: theme.spacing(1),
      width: '100%',
      paddingRight: theme.spacing(2),
    }
  },
  card: {
    maxWidth: 200,
    margin: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  subtitleFont: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  cardTitle: {
    fontSize: 16,
  }
}))

const SeriesSearch = () => {
  const classes = useStyles()

  const [searchQuery, setSearchQuery] = React.useState('')
  const [searchResults, setSearchResults] = React.useState([])


  function createSeriesCards(searchResults) {
    if (searchResults.length === 0) return []
    const seriesCards = searchResults.map((series) => {
      const poster = series.Assets[0] ? `https://cdn.animetrics.co/${series.Assets[0].s3_poster_compressed}` : 'https://cdn.animetrics.co/animetrics/missing_poster_art.png'
      const title = series.english_title ? series.english_title : series.title
      return (
        <Card className={classes.card} key={series.id}>
          <CardActionArea onClick={() => window.location.href = `/anime/${series.id}`}>
            <CardMedia
              // component="img"
              alt={title}
              title={title}
            >
              <LazyLoadImage
                verticalOffset={400}
                width={200}
                loadHeight={290}
                loadWidth={200}
                src={poster}
                alt="Poster art"
              />
            </CardMedia>
            <CardContent>
              <Typography className={classes.cardTitle} gutterBottom variant="h6">
                {title}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      )
    })
    return seriesCards
  }

  React.useEffect(() => {
    async function fetch() {
      try {
        const results = (await AnimeService.searchSeries(searchQuery)).data
        setSearchResults(results)
      } catch (err) {
        console.log(err)
      }
    }
    fetch()
  }, [searchQuery])

  async function onSubmit(e) {
    e.preventDefault()
  }

  const seriesCards = createSeriesCards(searchResults)

  return (
    <div className={clsx({[classes.root]: true})}>
      <Grid
        container
        justify="center"
        spacing={2}
      >
        <Grid
          item
          xs={12}
        >
          <form
            autoComplete="off"
            className={classes.root}
            noValidate
            onSubmit={onSubmit}
          >
            <TextField
              autoFocus
              id="outlined-basic"
              label="Series Title"
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={'Sword Art Online'}
              spellCheck="false"
              variant="outlined"
            />
          </form>
        </Grid>
        <Grid
          container
          item
          justify="center"
          direction="row"
        >
          {seriesCards}
        </Grid>
      </Grid>
    </div>
  )
}

export default SeriesSearch
