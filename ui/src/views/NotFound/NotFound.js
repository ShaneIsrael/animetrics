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
  }
}))

const NotFound = () => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <a href="/dashboard">
          <img
            alt="404 Page Not Found"
            className={classes.image}
            src="https://animetrics.sfo2.cdn.digitaloceanspaces.com/animetrics/404/komi-404.png"
            
          />
        </a>
      </div>
    </div>
  )
}

export default NotFound
