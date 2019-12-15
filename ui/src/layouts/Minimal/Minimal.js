import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/styles'

 const useStyles = makeStyles(() => ({
  root: {
    height: '100%'
  },
  content: {
    height: '100%',
    background: '#111b29',
  }
}))

const Minimal = props => {
  const { children } = props

  const classes = useStyles()

  return (
    <div className={classes.root}>
      <main className={classes.content}>{children}</main>
    </div>
  )
}

Minimal.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
}

export default Minimal
