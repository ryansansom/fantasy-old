import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from '../../components/App';
import PickLeague from '../../components/pages/pick-league';
import RefreshCredentials from '../../components/pages/refresh-credentials';
import Standings from '../../components/pages/Standings';
import h2hStandings from '../../components/pages/h2h-standings';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={PickLeague}/>
    <Route path="/standings" component={Standings}/>
    <Route path="/standings/:leagueID" component={Standings}/>
    <Route path="/h2h/:leagueID" component={h2hStandings}/>
    <Route path="/refresh-credentials" component={RefreshCredentials}/>
  </Route>
)
