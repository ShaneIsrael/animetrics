import React from 'react'
import { makeStyles, withStyles } from '@material-ui/styles'
import { Grid, Card, CardContent, Typography, CardMedia, Tooltip } from '@material-ui/core'
import Chip from '@material-ui/core/Chip'
import ScoreIcon from '@material-ui/icons/Score'
import PollIcon from '@material-ui/icons/Poll'
import Zoom from '@material-ui/core/Zoom'
import { LazyLoadImage } from 'components'

import clsx from 'clsx'
import { yellow} from '@material-ui/core/colors'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    minWidth: 550,
  },
  paper: {
    margin: 'auto',
    maxWidth: 680,
    height: '80px'
  },

  backgroundColor: {
    color: theme.palette.primary.dark
  },
  rankColor: {
    color: yellow['A200'],
    borderColor: yellow['A200'],
  },
  card: {
    display: 'flex',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 0,
    width: 450,
    height: 205,
    margin: theme.spacing(1)
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%'
  },
  content: {
    flex: '1 0 auto',
  },
  cover: {
    width: 140,
  },
  hr: {
    marginTop: 5,
    borderColor: theme.palette.primary.dark
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  squareChip: {
    borderRadius: 0,
    margin: theme.spacing(0.5),
    minWidth: 85,
    height: 31,
  },
  titleFont: {
    lineHeight: 1,
    fontSize: 18
  },
  positionChip: {
    borderRadius: 0,
    margin: theme.spacing(0.5),
    fontSize: 36,
    width: 85,
    height: 85,
  },
  positionChangeChip: {
    borderRadius: 0,
    margin: theme.spacing(0.5),
    width: 70,
  },
  chip: {
    borderRadius: 5,
    margin: theme.spacing(0.5)
  },
  chipContainer: {
    height: 39
  },
  statsContainer: {
    paddingTop: 5,
  },
  episode: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
}))


const LightTooltip = withStyles(theme => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
}))(Tooltip)

const TopFiveCard = (props) => {
  const classes = useStyles()

  const { title, position, poster, score, malId, type} = props

  return (
    <Card className={clsx(classes.card)}>
      <div
        onClick={() => window.open(`https://myanimelist.net/anime/${malId}`, '_blank')}
        style={{flexGrow: 0, cursor: 'pointer'}}
      >
        <CardMedia
          title="Poster Art"
        >
          <LazyLoadImage
            verticalOffset={400}
            width={140}
            loadHeight={205}
            src={`https://cdn.animetrics.co/${poster}`}
            alt="Poster art"
            className={classes.cover}
            key={poster}
          />
        </CardMedia>
      </div>
      <div className={classes.details}>
        <CardContent>
          <Grid container>
            <Grid container>
              <Grid
                item
                xs={12}
              >
                <Typography
                  className={classes.titleFont}
                  component="h6"
                  variant="h6"
                >
                  {title}
                </Typography>
              </Grid>
              <Grid
                item
                xs={12}
              >
                <hr className={classes.hr}/>
              </Grid>
            </Grid>
            <Grid
              className={classes.statsContainer}
              container
            >
              <Grid
                item
                xs={4}
              >
                <LightTooltip
                  enterDelay={500}
                  placement="right"
                  title="Rank"
                  TransitionComponent={Zoom}
                >
                  <Chip
                    className={clsx({[classes.positionChip]: true, [classes.rankColor]: true})}
                    label={position}
                    variant="outlined"
                  />
                </LightTooltip>
                <LightTooltip
                  enterDelay={500}
                  placement={'right'}
                  title="Score"
                  TransitionComponent={Zoom}
                >
                  <Chip
                    avatar={type === 'karma' ? <ScoreIcon /> : <PollIcon />}
                    className={clsx({[classes.squareChip]: true, [classes.rankColor]: true})}
                    label={score}
                    variant="outlined"
                  />
                </LightTooltip>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </div>
    </Card>
  )
}

export default TopFiveCard
