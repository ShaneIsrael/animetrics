import React, { Component } from 'react'
import { Router } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import { ThemeProvider } from '@material-ui/styles'
import validate from 'validate.js'
import ReactGA from 'react-ga'

import theme from './theme'
import 'react-perfect-scrollbar/dist/css/styles.css'
import './assets/scss/index.scss'
import validators from './common/validators'
import Routes from './Routes'
import { MuiThemeProvider } from '@material-ui/core'

ReactGA.initialize('UA-153678038-1')
const browserHistory = createBrowserHistory()

validate.validators = {
  ...validate.validators,
  ...validators
}

export default class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Router history={browserHistory}>
          <Routes />
        </Router>
      </MuiThemeProvider>
    )
  }
}
