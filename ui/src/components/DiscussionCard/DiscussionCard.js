import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';


const useStyles = makeStyles(theme => ({
  card: {
    // maxHeight: '85vh',
    maxWidth: '250px',
    margin: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',

  },
  // paper: {
  //   backgroundColor: theme.palette.background.paper,
  //   border: '2px solid #000',
  //   boxShadow: theme.shadows[5],
  // },
  subtitleFont: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  cardContent: {
    // position: 'absolute',
    // bottom: 0,
    // backgroundColor: 'rgba(0, 0, 0, 0.9)',
    // width: '100%',
    // height: '120px',
    // maxHeight: '120px'
  },
  cardContentTitle: {
    // WebkitTextStrokeColor: 'black',
    // WebkitTextStroke: '1px',
  }
}))

export default function DiscussionCard(props) {
  const classes = useStyles();

  const { title, episode, poster, href } = props
  return (
    <Card className={classes.card}>
      <CardActionArea onClick={() => window.open(href, '_blank')}>
        <CardMedia
          component="img"
          alt="Discussion Card"
          image={`https://animetrics.sfo2.cdn.digitaloceanspaces.com/${poster}`}
          title={title}
        />
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
