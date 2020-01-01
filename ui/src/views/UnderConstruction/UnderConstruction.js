import React from 'react'
import { makeStyles } from '@material-ui/styles'
import { Typography } from '@material-ui/core'

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
  },
}))

const NotFound = () => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Typography variant="h3">Coming Soon!</Typography>
    </div>
  )
}

export default NotFound
