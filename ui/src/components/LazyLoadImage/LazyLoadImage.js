import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import LazyLoad from 'react-lazy-load'


const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: ({ loadWidth }) => loadWidth,
    height: ({ loadHeight }) => loadHeight,

    '& > * + *': {
      marginLeft: theme.spacing(2),
    },
  },
}))

export default function LazyLoadImage(props) {
  const { src, altComponent, width, alt, verticalOffset, className } = props
  let {  loadWidth, loadHeight } = props
  loadWidth = loadWidth ? loadWidth : '100%'
  loadHeight = loadHeight ? loadHeight : '100%'
  const classes = useStyles({ loadWidth, loadHeight })
  const [loaded, setLoaded] = React.useState(false)

  let defaultComponent = (
    <div className={classes.root}>
      <CircularProgress />
    </div>
  )
  if (altComponent) {
    defaultComponent = altComponent
  }
  return (
    <LazyLoad
      debounce={false}
      offsetVertical={verticalOffset ? verticalOffset : 400}
      width={width}
    >
      <div>
        <img style={{display: `${loaded ? 'block' : 'none'}`}} className={loaded ? className : ''} alt={alt} width={width} src={src} onLoad={() => setLoaded(true)}/>
        {!loaded &&
          defaultComponent
        }
      </div>
    </LazyLoad>
  )
}
