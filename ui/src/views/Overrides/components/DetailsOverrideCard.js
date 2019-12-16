import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import { Typography, TextField } from '@material-ui/core';
import { OverridesService } from 'services'
import { Alert } from 'components'

const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: 345,
    maxHeight: '100vh',
    margin: 10,
  },
  subtitleFont: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  updateButton: {
    margin: theme.spacing(1)
  },
  textfield: {
    width: '100%',
  },
}))

export default function DetailsOverrideCard(props) {
  const classes = useStyles()
  const { showToUpdate, title, subtitle} = props

  const [newTvdbId, setNewTvdbId] = React.useState('')
  const [show, setShow] = React.useState(showToUpdate)
  const [disabled, setDisabled] = React.useState(false)
  const [token, setToken] = React.useState('')
  const [error, setError] = React.useState(null)
  const [message, setMessage] = React.useState(null)

  const updateTvdbId = async (showId) => {
    setDisabled(true)
    setError(null)
    setMessage(null)
    let updatedShow
    try {
      updatedShow = (await OverridesService.overrideShowTvdbId(showId, newTvdbId, token)).data
      console.log(updatedShow)
      setShow(updatedShow)
      setMessage('TVDB ID has been updated successfully!')
    } catch(err) {
      if (err.response) {
        setError(err.response.data)
      }
    }
    setDisabled(false)
  }
  React.useEffect(() => {
    setShow(showToUpdate)
  }, [showToUpdate])
  
  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="h2">
          {title}
        </Typography>
        <Typography className={classes.subtitleFont} gutterBottom variant="subtitle2" component="h6">
          {subtitle}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          {show && show.synopsis}
        </Typography>
        {error && 
          <Alert variant="error" message={error}/>
        }
        {message && 
          <Alert variant="success" message={message}/>
        }
        <div>
          <TextField className={classes.textfield} value={token} onChange={e => setToken(e.target.value)} label="Authorization Token"/>
          <TextField className={classes.textfield} value={newTvdbId} onChange={e => setNewTvdbId(e.target.value)} label="New TVDB ID" />
        </div>
        <div>
          <Button disabled={disabled} className={classes.updateButton} variant="outlined" color="secondary" onClick={() => updateTvdbId(showToUpdate.id)}>
            {disabled ? 'Updating...' : 'Update!'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}