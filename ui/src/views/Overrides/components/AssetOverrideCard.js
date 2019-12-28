import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
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

export default function AssetOverrideCard(props) {
  const classes = useStyles()
  const { authToken, assetId, type, assetUrl, title, subtitle} = props
  const [assetURL, setAssetURL] = React.useState(assetUrl)

  const [newAssetUrl, setNewAssetUrl] = React.useState('')
  const [disabled, setDisabled] = React.useState(false)
  const [error, setError] = React.useState(null)
  const [message, setMessage] = React.useState(null)


  const updateAsset = async (id) => {
    setDisabled(true)
    setError(null)
    setMessage(null)
    let newAsset
    try {
      switch (type) {
        case 'poster':
          newAsset = (await OverridesService.overrideAssetPoster(id, newAssetUrl, authToken)).data
          setAssetURL(newAsset.s3_poster)
          break
        case 'banner':
          newAsset = (await OverridesService.overrideAssetBanner(id, newAssetUrl, authToken)).data
          setAssetURL(newAsset.s3_banner)
          break
        default:
          newAsset = (await OverridesService.overrideAssetAvatar(id, newAssetUrl, authToken)).data
          setAssetURL(newAsset.s3_avatar)
          break
      }
      setMessage('Art has been updated successfully!')
    } catch(err) {
      if (err.response) {
        setError(err.response.data)
      }
    }
    setDisabled(false)
  }
  React.useEffect(() => {
    setAssetURL(assetUrl)
  }, [assetUrl])
  
  return (
    <Card className={classes.card}>
      <CardMedia
        component="img"
        image={`https://cdn.animetrics.co/${assetURL}`}
        title={title}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="h2">
          {title}
        </Typography>
        <Typography className={classes.subtitleFont} gutterBottom variant="subtitle2" component="h6">
          {subtitle}
        </Typography>
        {error && 
          <Alert variant="error" message={error}/>
        }
        {message && 
          <Alert variant="success" message={message}/>
        }
        <div>
          <TextField className={classes.textfield} value={newAssetUrl} onChange={e => setNewAssetUrl(e.target.value)} label="New Asset URL" />
        </div>
        <div>
          <Button disabled={disabled} className={classes.updateButton} variant="outlined" color="secondary" onClick={() => updateAsset(assetId)}>
            {disabled ? 'Updating...' : 'Update!'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}