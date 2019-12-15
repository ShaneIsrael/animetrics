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
    maxWidth: 345,
    maxHeight: '95vh',
    margin: 10,
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
}))

export default function DiscussionCard(props) {
  const classes = useStyles();

  const { title, episode, poster, href } = props
  console.log(`https://animetrics.sfo2.cdn.digitaloceanspaces.com/${poster}`)
  return (
    <Card className={classes.card}>
      <CardActionArea onClick={() => window.open(href, '_blank')}>
        <CardMedia
          component="img"
          alt="Discussion Card"
          // height="500"
          image={`https://animetrics.sfo2.cdn.digitaloceanspaces.com/${poster}`}
          title="Title"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {title}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {`Episode ${episode}`}
          </Typography>
        </CardContent>
      </CardActionArea>
      {/* <CardActions>
        <div>
          <Button size="small" color="primary">
            <a href={`the url`} target="_blank" rel="noopener noreferrer">View Episode Discussion</a>
          </Button>
        </div>
      </CardActions> */}
    </Card>
  )
}