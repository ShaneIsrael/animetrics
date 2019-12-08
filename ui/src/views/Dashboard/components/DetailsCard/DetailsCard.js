import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {isMobile} from 'react-device-detect'
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

const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: 345,
    maxHeight: '100vh',
    margin: 10,
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
}))

export default function DetailsCard(props) {
  const classes = useStyles();
  const [ details, setDetails ] = React.useState(null)
  const [ hide, setHide ] = React.useState(false)
  const { selectedAnime } = props

  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true)
  }

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
  const cardRender = (
    <Card className={classes.card}>
      <CardActionArea onClick={() => hideHandler(true)}>
        <CardMedia
          component="img"
          alt="Selected Anime Details"
          height="500"
          image={`${selectedAnime.show.s3_poster}`}
          title={title}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {title}
          </Typography>
          <Typography className={classes.subtitleFont} gutterBottom variant="subtitle2" component="h6">
            {details && details.show.genre && details.show.genre.split(',').join(' / ')}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {details && details.show.synopsis}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        { details &&
          <div>
            <Button size="small" color="primary">
              <a href={`${details.discussion.post_url}`} target="_blank" rel="noopener noreferrer">View Episode Discussion</a>
            </Button>
            <Button size="small" color="primary">
              <a href={`https://myanimelist.net/anime/${details.show.mal_id}`} target="_blank" rel="noopener noreferrer">Learn More</a>
            </Button>
          </div>
        }
      </CardActions>
    </Card>
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
              <div className={classes.paper}>
                {cardRender}
              </div>
            </Fade>
          </Modal>
        </div>
      }
    </div>
  )
}