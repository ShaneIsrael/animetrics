/* eslint-disable react/no-multi-comp */
import React, {useEffect} from 'react'
import { makeStyles } from '@material-ui/styles'
// eslint-disable-next-line
import { Grid, TextField, Paper, InputLabel, FormControl, Select, MenuItem } from '@material-ui/core'
import clsx from 'clsx'
import ls from 'local-storage'
import { ShowService, AssetService } from 'services'
import { AssetSelect, AssetOverrideCard, DetailsOverrideCard } from './components'

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(1),
  },
  tokenField: {
    width: 400
  }
}))


const Overrides = () => {
  const classes = useStyles()
  const [shows, setShows] = React.useState([])
  const [asset, setAsset] = React.useState(null)
  const [show, setShow] = React.useState(null)
  const [authToken, setAuthToken] = React.useState('')
  // eslint-disable-next-line

  useEffect(() => {
    async function fetchData() {
      try {
        const shows = (await ShowService.getShowsAndAssets()).data
        setShows(shows)
        setAuthToken(ls('authToken'))
      } catch (err) {
        console.log(err)
      }
    }
    fetchData()
  }, [])

  const setSelectedAsset = async (id) => {
    // get the asset with this id
    const a = (await AssetService.getAsset(id)).data
    setAsset(a)
  }
  const setSelectedShow = async (s) => {
    // get the asset with this id
    setShow(s)
  }

  const handleAuthTokenChange = (e) => {
    ls('authToken', e.target.value)
    setAuthToken(e.target.value)
  }

  return (
    <div className={clsx({[classes.root]: true})}>
      <Grid
        container
        justify="center"
        spacing={4}
      >
        <Grid container justify="center">
          <Grid style={{padding: 20}} item>
            <TextField variant="outlined" spellcheck="false" className={classes.tokenField} value={authToken} onChange={handleAuthTokenChange} label="Authorization Token"/>
          </Grid>
        </Grid>
        <Grid container justify="center">
          <Grid item>
            <AssetSelect shows={shows} setSelectedAsset={setSelectedAsset} setSelectedShow={setSelectedShow}/>
          </Grid>
        </Grid>
      </Grid>
      <Grid
        container
        justify="center"
        spacing={4}>
        {asset && 
          <React.Fragment>
            <Grid item>
              <AssetOverrideCard authToken={authToken} assetId={asset.id} type="poster" assetUrl={asset.s3_poster} title="Override Poster Art" subtitle="Please use: Dimensions [680w x 1000h] or 17:25 Aspect Ratio"/>
            </Grid>
            <Grid item >
              <AssetOverrideCard authToken={authToken} assetId={asset.id} type="banner" assetUrl={asset.s3_banner} title="Override Banner Art" subtitle="Please use: Dimensions [454w x 80h] or 227:40 Apect Ratio"/>
            </Grid>
            <Grid item >
              <AssetOverrideCard authToken={authToken} assetId={asset.id} type="avatar" assetUrl={asset.s3_avatar} title="Override Avatar Art" subtitle="Please use: Dimensions [162w x 162h] or 1:1 Aspect Ratio"/>
            </Grid>
            <Grid item >
              <DetailsOverrideCard authToken={authToken} showToUpdate={show} type="tvdb_id" title="Override TVDB ID" subtitle="If the following synopsis is incorrect, find the correct tvdb id at https://thetvdb.com/"/>
            </Grid>
          </React.Fragment>
        }
      </Grid>
    </div>
  )
}

export default Overrides
