import React from 'react'
import { Switch, Redirect } from 'react-router-dom'

import { RouteWithLayout } from './components'
import { Main as MainLayout, Minimal as MinimalLayout } from './layouts'

import {
  Dashboard as DashboardView,
  PollRankings as PollRankingsView,
  KarmaRankings as KarmaRankingsView,
  Overrides as OverridesView,
  NotFound as NotFoundView
} from './views'

const Routes = () => {
  return (
    <Switch>
      <Redirect
        exact
        from="/"
        to="/karma-rankings"
      />
      <RouteWithLayout
        component={DashboardView}
        exact
        layout={MinimalLayout}
        path="/dashboard"
      />
      <RouteWithLayout
        component={KarmaRankingsView}
        exact
        layout={MainLayout}
        path="/karma-rankings"
      />
      <RouteWithLayout
        component={PollRankingsView}
        exact
        layout={MainLayout}
        path="/poll-rankings"
      />
      <RouteWithLayout
        component={OverridesView}
        exact
        layout={MainLayout}
        path="/overrides"
      />
      <RouteWithLayout
        component={NotFoundView}
        exact
        layout={MinimalLayout}
        path="/404"
      />
      <Redirect to="/404" />
    </Switch>
  )
}

export default Routes
