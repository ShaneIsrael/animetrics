import React from 'react'
import { makeStyles, withStyles } from '@material-ui/styles'
import { Grid, Hidden, Tooltip } from '@material-ui/core'
import clsx from 'clsx'
import { deepOrange, deepPurple, lightBlue } from '@material-ui/core/colors'
import Chip from '@material-ui/core/Chip'
import Avatar from '@material-ui/core/Avatar'
import ForwardIcon from '@material-ui/icons/Forward'
import PollIcon from '@material-ui/icons/Poll'
import ThumbsUpDownIcon from '@material-ui/icons/ThumbsUpDown'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import Zoom from '@material-ui/core/Zoom'
import LazyLoad from 'react-lazy-load'

const LightTooltip = withStyles(theme => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
}))(Tooltip)

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    minWidth: 415,
  },
  paper: {
    margin: 'auto',
    width: 400,
    height: '80px'
  },
  positionChangePaper: {
    height: '30px'
  },
  scorePaper: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    textAlign: 'right',
    height: '50px'
  },
  avatarPaper: {
    paddingTop: '3px',
    height: '80px'
  },
  titlePaper: {
    paddingTop: theme.spacing(0.5),
    height: '40px'
  },
  titleFont: {
    color: 'white',
    WebkitTextStrokeColor: 'black',
    WebkitTextStroke: '1px',
    fontFamily: 'Impact',
    flexWrap: 'wrap',
    fontSize: 15,
    lineHeight: 1,
    fontStyle: 'italic'
  },
  detailsPaper: {
    height: '40px'
  },
  backgroundPrimary: {
    backgroundColor: '#294e8a'
  },
  positionChangeFont: {
    color: 'white',
    WebkitTextStroke: '1px',
    WebkitTextStrokeColor: 'black',
    fontFamily: 'Impact, Oswald',
    fontWeight: 800,
    fontSize: 16,
    fontStyle: 'bold',
    alignItems: 'left',
    justifyContent: 'center',
  },
  scoreFont: {
    color: 'white',
    WebkitTextStroke: '2px',
    WebkitTextStrokeColor: 'black',
    fontFamily: 'Impact, Oswald',
    fontWeight: 800,
    fontSize: 24,
    fontStyle: 'italic',
    paddingLeft: theme.spacing(0.5),
    position: 'absolute',
    marginTop: -12
  },
  voteFont: {
    color: 'white',
    lineHeight: 1,
    WebkitTextStrokeColor: 'black',
    WebkitTextStroke: '1px',
    fontFamily: 'Arial, Helvetica, sans-serif',
    fontWeight: 800,
    fontSize: 16,
  },
  voteFontPrimary: {
    color: '#294e8a',
    lineHeight: 1,
    WebkitTextStrokeColor: 'black',
    WebkitTextStroke: '0.3px',
    fontFamily: 'Arial, Helvetica, sans-serif',
    fontWeight: 800,
    fontSize: 16,
  },
  episodeFont: {
    color: 'white',
    WebkitTextStrokeColor: 'black',
    WebkitTextStroke: '1px',
    fontFamily: 'Impact, Oswald',
    fontWeight: 'lighter',
    fontSize: 18,
    fontStyle: 'italic',
    marginLeft: '4px',
    marginTop: '4px'
  },
  upIcon: {
    transform: 'rotate(-90deg)',
    WebkitTextStroke: '1px',
    WebkitTextStrokeColor: 'black',
  },
  downIcon: {
    transform: 'rotate(90deg)',
  },
  orangeColor: {
    color: deepOrange[500],
    borderColor: deepOrange[500]
  },
  purpleColor: {
    color: deepPurple[300],
    borderColor: deepPurple[300]
  },
  avatar: {
    width: 74,
    height: 74,
    margin: 'auto',
  },
  avatarMobile: {
    width: 50,
    height: 50,
  },
  card: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 0,
    width: 300,
    height: '100%',
  },
  cardHeader: {
    padding: 8
  },
  cardContent: {
    padding: 8,
    '&:last-child': {
      paddingBottom: 8
    }
  },
  squareChip: {
    borderRadius: 0,
    margin: theme.spacing(0.5)
  },
  rankColor: {
    color: lightBlue['A400'],
    borderColor: lightBlue['A400'],
    backgroundColor: 'rgba(0,176,255,0.2)'
  },
}))

const desktopStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    minWidth: 415,
  },
  upIcon: {
    transform: 'rotate(-90deg)',
    WebkitTextStroke: '1px',
    WebkitTextStrokeColor: 'black',
  },
  downIcon: {
    transform: 'rotate(90deg)',
  },
  orangeColor: {
    color: deepOrange[500],
    borderColor: deepOrange[500]
  },
  purpleColor: {
    color: deepPurple[300],
    borderColor: deepPurple[300]
  },
  avatar: {
    width: 80,
    height: 80,
  },
  card: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 0,
    width: 450,
    height: '100%',
  },
  cardHeader: {
    padding: 8,
  },
  cardContent: {
    padding: 8,
    '&:last-child': {
      paddingBottom: 8
    }
  },
  squareChip: {
    borderRadius: 0,
    margin: theme.spacing(0.5)
  },
  positionChipFont: {
    fontSize: 24
  },
}))
//eslint-disable-next-line react/jsx-max-props-per-line
const AnimePollRanking = (props) => {
  const classes = useStyles()
  const desktop = desktopStyles()

  let { current, openRpGraphModal } = props
  
  const avatar = `https://cdn.animetrics.co/${current.assets[0].s3_avatar}`

  const posChangeUp = current.previous ? current.position < current.previous.position : false
  const posChangeDown = current.previous ? current.position > current.previous.position : false

  const seasonId = current.seasonId
  const showId = current.show.id

  return (
    <Grid item xs={12}>
      <Hidden
        implementation="js"
        mdUp
      >
        <Card className={classes.card}>
          <CardHeader
            className={classes.cardHeader}
            avatar={
              <LazyLoad debounce={true} offsetVertical={400} width={50} key={avatar}><Avatar className={classes.avatarMobile} src={avatar} /></LazyLoad>
            }
            title={current.show.english_title ? current.show.english_title : current.show.title}
            subheader={`Episode ${current.discussion.episode}`}
            subheaderTypographyProps={{color: 'primary'}}
          />
          <CardContent className={classes.cardContent}>
            <React.Fragment>
              <Chip
                className={clsx({[classes.squareChip]: true, [classes.rankColor]: true})}
                avatar={<PollIcon />}
                label={current.score}
                variant="outlined"
              />
              {(posChangeUp || posChangeDown) &&
                <Chip
                  className={clsx({[classes.squareChip]: true, [classes.orangeColor]: posChangeUp, 
                    [classes.purpleColor]: posChangeDown})}
                  avatar={<ForwardIcon className={clsx({[classes.upIcon]: posChangeUp, [classes.downIcon]: posChangeDown})}/>}
                  label={Math.abs(current.position - current.previous.position)}
                  variant="outlined"
                />
              }
              <Chip
                className={clsx({[classes.squareChip]: true})}
                avatar={<ThumbsUpDownIcon/>}
                label={current.votes}
                variant="outlined"
              />
            </React.Fragment>
          </CardContent>
        </Card>
      </Hidden>
      <Hidden
        implementation="js"
        smDown
      >
        <Card className={desktop.card}>
          <CardHeader
            className={desktop.cardHeader}
            avatar={
              <LazyLoad debounce={true} offsetVertical={400} width={80} key={avatar}><Avatar className={desktop.avatar} src={avatar} /></LazyLoad>
            }
            title={current.show.english_title ? current.show.english_title : current.show.title}
            titleTypographyProps={{variant: 'h6', component: 'h6'}}
            subheader={`Episode ${current.discussion.episode}`}
            subheaderTypographyProps={{color: 'primary'}}
          />
          <CardContent className={desktop.cardContent}>
            <React.Fragment>
              <LightTooltip enterDelay={500} TransitionComponent={Zoom} title="Current Rank" placement="top">
                <Chip
                  className={clsx({[desktop.squareChip]: true, [desktop.positionChipFont]: true, [classes.rankColor]: true})}
                  label={(current.position + 1)}
                  variant="outlined"
                />
              </LightTooltip>
              <LightTooltip enterDelay={500} TransitionComponent={Zoom} title="Episode Poll Result" placement="top">
                <Chip
                  className={clsx({[desktop.squareChip]: true, [classes.rankColor]: true})}
                  avatar={<PollIcon />}
                  label={current.score}
                  variant="outlined"
                  onClick={() => openRpGraphModal(seasonId, showId)}
                />
              </LightTooltip>
              {(posChangeUp || posChangeDown) &&
                <LightTooltip enterDelay={500} TransitionComponent={Zoom} title="Episode Poll Result Change" placement="top">
                  <Chip
                    className={clsx({[desktop.squareChip]: true, [desktop.orangeColor]: posChangeUp, 
                      [desktop.purpleColor]: posChangeDown})}
                    avatar={<ForwardIcon className={clsx({[desktop.upIcon]: posChangeUp, [desktop.downIcon]: posChangeDown})}/>}
                    label={Math.abs(current.position - current.previous.position)}
                    variant="outlined"
                  />
                </LightTooltip>
              }
              <LightTooltip enterDelay={500} TransitionComponent={Zoom} title="Total Votes in Poll" placement="top">
                <Chip
                  className={clsx({[desktop.squareChip]: true})}
                  avatar={<ThumbsUpDownIcon/>}
                  label={current.votes}
                  variant="outlined"
                />
              </LightTooltip>
            </React.Fragment>
          </CardContent>
        </Card>
      </Hidden>
    </Grid>
  )
}

export default AnimePollRanking
