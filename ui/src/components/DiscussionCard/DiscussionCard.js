import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import LazyLoad from 'react-lazyload'

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
          <LazyLoad
            debounce={false}
            offsetVertical={400}
            width={250}
          >
            <img alt="poster art" width={250} src={`https://animetrics.sfo2.cdn.digitaloceanspaces.com/${poster}`} />
          </LazyLoad>
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
