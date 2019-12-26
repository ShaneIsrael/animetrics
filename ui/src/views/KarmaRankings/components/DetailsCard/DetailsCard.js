import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';

import { AnimeDetailsService } from '../../../../services'
import { Hidden } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  link: {
    color: theme.palette.primary.main
  },
  card: {
    display: 'flex',
    borderRadius: 0,
    width: 500,
    height: 300,
  },
  cardMobile: {
    maxWidth: 305,
    // maxHeight: '100vh',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
  },
  contentMobile: {
    flex: '1 0 auto',
    width: 300,
    overflow: 'hidden',
    paddingBottom: 0
  },
  content: {
    flex: '1 0 auto',
    overflow: 'hidden',
    paddingBottom: 0
  },
  cover: {
    width: 350,
    cursor: 'pointer'
  },
  synopsisMobile: {
    maxHeight: 160,
    overflowY: 'auto',
    paddingRight: 10,
    boxSizing: 'content-box'
  },
  synopsis: {
    maxHeight: 160,
    overflowY: 'auto',
    // boxSizing: 'content-box'
  },
  actions: {
    padding: 0,
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
  },
  subtitleFont: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  titleFont: {
    fontSize: 16,
    lineHeight: 1.25,
  }
}))

export default function DetailsCard(props) {
  const classes = useStyles();
  const [ details, setDetails ] = React.useState(null)
  const [ hide, setHide ] = React.useState(false)
  const { selectedAnime } = props

  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false)
  }

  React.useEffect(() => {
    async function fetchData() {
      try {
        const deets = (await AnimeDetailsService.getAnimeDetailsByShowId(selectedAnime.id, selectedAnime.showId)).data
        setDetails(deets)
      } catch (err) {
        console.log(err)
      }
    }
    if (selectedAnime) {
      setOpen(true)
      setHide(false)
      fetchData()
    }
  }, [selectedAnime])

  const hideHandler = hide => {
    setHide(hide)
    setOpen(!hide)
  }

  const title = details && details.show.seriesName
  const posterUrl = selectedAnime.assets && selectedAnime.assets[0].s3_poster ? `https://animetrics.sfo2.cdn.digitaloceanspaces.com/${selectedAnime.assets[0].s3_poster}` : 'https://animetrics.sfo2.cdn.digitaloceanspaces.com/animetrics/missing_poster_art.png'
  const cardRender = (
    <div>
      <Hidden
        implementation="js"
        smDown
      >
        <Card className={classes.card}>
          <CardMedia
            onClick={() => hideHandler(true)}
            className={classes.cover}
            alt="Selected Anime Details"
            // height="500"
            image={posterUrl}
            title={title}
          />
          <div className={classes.details}>
            <CardContent className={classes.content}>
              <Typography className={classes.titleFont} gutterBottom variant="h6" component="h6">
                {title}
              </Typography>
              <Typography className={classes.subtitleFont} gutterBottom variant="subtitle2" component="h6">
                {details && details.show.genre && details.show.genre.split(',').join(' / ')}
              </Typography>
              <div style={{width: '100%', height: '100%', overflow: 'hidden'}}>
                <Typography className={classes.synopsis} variant="body2" color="textSecondary" component="p">
                  {details && details.show.synopsis}
                </Typography>
              </div>
            </CardContent>
            <CardActions className={classes.actions}>
              { details &&
                <div>
                  <Button size="small" color="primary">
                    <a className={classes.link} href={`${details.discussion.post_url}`} target="_blank" rel="noopener noreferrer">View Episode Discussion</a>
                  </Button>
                  <Button size="small" color="primary">
                    <a className={classes.link} href={`https://myanimelist.net/anime/${details.show.mal_id}`} target="_blank" rel="noopener noreferrer">Learn More</a>
                  </Button>
                </div>
              }
            </CardActions>
          </div>
        </Card>
      </Hidden>
      <Hidden
        implementation="js"
        mdUp
      >
        <Card className={classes.cardMobile}>
          <CardActionArea onClick={() => hideHandler(true)}>
            <CardMedia
              component="img"
              alt="Selected Anime Details"
              height="500"
              image={posterUrl}
              title={title}
            />
            <CardContent className={classes.contentMobile}>
              <Typography className={classes.titleFont} gutterBottom variant="h5" component="h2">
                {title}
              </Typography>
              <Typography className={classes.subtitleFont} gutterBottom variant="subtitle2" component="h6">
                {details && details.show.genre && details.show.genre.split(',').join(' / ')}
              </Typography>
              <Typography className={classes.synopsisMobile} variant="body2" color="textSecondary" component="p">
                {details && details.show.synopsis}
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions>
            { details &&
              <div>
                <Button size="small" color="primary">
                  <a className={classes.link} href={`${details.discussion.post_url}`} target="_blank" rel="noopener noreferrer">View Episode Discussion</a>
                </Button>
                <Button size="small" color="primary">
                  <a className={classes.link} href={`https://myanimelist.net/anime/${details.show.mal_id}`} target="_blank" rel="noopener noreferrer">Learn More</a>
                </Button>
              </div>
            }
          </CardActions>
        </Card>
      </Hidden>
    </div>
  )
  return (
    <div>
      {/* {selectedAnime && !hide && !isMobile && cardRender} */}
      {selectedAnime && !hide && 
        <div>
          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={open}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500,
            }}
          >
            <Fade in={open}>
              {cardRender}
            </Fade>
          </Modal>
        </div>
      }
    </div>
  )
}