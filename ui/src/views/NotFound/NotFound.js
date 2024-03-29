import React from 'react'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles(() => ({
  root: {
    backgroundColor: '#2e2f34',
    height: '100%'
  },
  content: {
    marginBottom: -5,
    position: 'fixed',
    bottom: 0
  },
  image: {
    maxWidth: '100%',
    maxHeight: '100%'
  }
}))

const NotFound = () => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <a href="/">
          <img
            alt="404 Page Not Found"
            className={classes.image}
            src="https://cdn.animetrics.co/animetrics/404/komi-blush-404.png"
            
          />
        </a>
      </div>
    </div>
  )
}

export default NotFound
