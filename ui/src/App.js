import React, { Component } from 'react'
import { Router } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import { createMuiTheme } from '@material-ui/core/styles'
import validate from 'validate.js'
import ReactGA from 'react-ga'

// import theme from './theme'
import 'react-perfect-scrollbar/dist/css/styles.css'
import './assets/scss/index.scss'
import validators from './common/validators'
import Routes from './Routes'
import { MuiThemeProvider } from '@material-ui/core'

ReactGA.initialize('UA-153678038-1')
const browserHistory = createBrowserHistory()
browserHistory.listen(location => {
  ReactGA.set({ page: location.pathname })
  ReactGA.pageview(location.pathname)
})

validate.validators = {
  ...validate.validators,
  ...validators
}

let theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      light: '#63ccff',
      main: '#009be5',
      dark: '#232f3e',
    },
    background: {
      paper: '#232f3e'
    },
    success: {light: '#81c784', main: '#4caf50', dark: '#388e3c', contrastText: 'rgba(0, 0, 0, 0.87)'},
    info: {light: '#64b5f6', main: '#2196f3', dark: '#1976d2', contrastText: '#fff'},
    warning: {light: '#ffb74d', main: '#ff9800', dark: '#f57c00', contrastText: 'rgba(0, 0, 0, 0.87)'},
    error: {light: '#e57373', main: '#f44336', dark: '#d32f2f', contrastText: '#fff'}
  },
  customShadows: {
    widget:
      '0px 3px 11px 0px #E8EAFC, 0 3px 3px -2px #B2B2B21A, 0 1px 8px 0 #9A9A9A1A',
    widgetDark:
      '0px 3px 18px 0px #4558A3B3, 0 3px 3px -2px #B2B2B21A, 0 1px 8px 0 #9A9A9A1A',
    widgetWide:
      '0px 12px 33px 0px #E8EAFC, 0 3px 3px -2px #B2B2B21A, 0 1px 8px 0 #9A9A9A1A',
  },
  typography: {
    h5: {
      fontWeight: 500,
      fontSize: 26,
      letterSpacing: 0.5,
    },
  },
  shape: {
    borderRadius: 8,
  },
  props: {
    MuiTab: {
      disableRipple: true,
    },
  },
  mixins: {
    toolbar: {
      minHeight: 48,
    },
  },
});

theme = {
  ...theme,
  overrides: {
    MuiDrawer: {
      paper: {
        backgroundColor: '#18202c',
      },
    },
    MuiButton: {
      label: {
        textTransform: 'none',
      },
      contained: {
        boxShadow: 'none',
        '&:active': {
          boxShadow: 'none',
        },
      },
    },
    MuiTabs: {
      root: {
        marginLeft: theme.spacing(1),
      },
      indicator: {
        height: 3,
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,
        backgroundColor: theme.palette.common.white,
      },
    },
    MuiTab: {
      root: {
        textTransform: 'none',
        margin: '0 16px',
        minWidth: 0,
        padding: 0,
        [theme.breakpoints.up('md')]: {
          padding: 0,
          minWidth: 0,
        },
      },
    },
    MuiIconButton: {
      root: {
        padding: theme.spacing(1),
      },
    },
    MuiTooltip: {
      tooltip: {
        borderRadius: 4,
      },
    },
    MuiDivider: {
      root: {
        backgroundColor: '#404854',
      },
    },
    MuiListItemText: {
      primary: {
        fontWeight: theme.typography.fontWeightMedium,
      },
    },
    MuiListItemIcon: {
      root: {
        color: 'inherit',
        marginRight: 0,
        '& svg': {
          fontSize: 20,
        },
      },
    },
  },
};

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
