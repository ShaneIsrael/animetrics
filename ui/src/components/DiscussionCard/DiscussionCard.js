import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Typography from '@material-ui/core/Typography'
import { LazyLoadImage } from 'components'

const useStyles = makeStyles(() => ({
  card: {
    maxWidth: '250px',
    margin: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',

  },
  subtitleFont: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  cardContent: {
  },
  cardContentTitle: {
  }
}))

const missingPosterUrl = 'https://cdn.animetrics.co/animetrics/missing_poster_art.png'

export default function DiscussionCard(props) {
  const classes = useStyles();

  const { title, episode, poster, href } = props

  return (
    <Card className={classes.card}>
      <CardActionArea onClick={() => window.open(href, '_blank')}>
        <CardMedia
          // component="img"
          alt="Discussion Card"
          title={title}
        >
          <LazyLoadImage
            verticalOffset={400}
            width={250}
            loadHeight={360}
            loadWidth={250}
            src={poster ? `https://cdn.animetrics.co/${poster}` : missingPosterUrl}
            alt="Poster art"
            key={poster}
          />
        </CardMedia>
        <CardContent className={classes.cardContent}>
          <Typography className={classes.cardContentTitle} gutterBottom variant="h6">
            {title}
          </Typography>
          <Typography variant="body1" color="textSecondary" component="p">
            {`Episode ${episode}`}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}
